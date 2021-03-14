/** 1.0.1 **/
/*模块加载及逻辑处理*/
layui.use('element', function(){
	var element = layui.element;
});
layui.use('upload', function() {
    
    var res_md5;
    var signstr = '26148d621ef74844918af182d63976b6';
    
    record_url = record_url==undefined?'':record_url;
    var uploadurl = 'https://upload.ffsup.com/';
    var dingxiang_udid = '26148d621ef74844918af182d63976b6';
    var myCaptcha = _dx.Captcha(document.getElementById('c1'), {
        appId: '08eb3829a03415227dbb146780129cca', //appId，在控制台中“应用管理”或“应用配置”模块获取
        style: 'inline',
        inlineFloatPosition: 'down',
        success: function (token) {
            document.getElementById('dingxiang').value = token;
            $.ajax({  
               url: uploadurl,  
               dataType: 'json',  
               type: 'GET',  
               cache: false,  
               data:{"dingxiang":token},
               //contentType: 'application/x-www-form-urlencoded',  
               success: function (getdata) {
                   console.log(getdata)
               }  
           });  
          // console.log('token:', token)
          //console.log(uploadListIns.config)
        }
    })
    var options = {
        appId: '519f81752968eedb0358531c4027541b', // 唯一标识，必填
        server: 'https://constid.dingxiang-inc.com/udid/c1', // constId 服务接口，可选
        //userId: navigator.userAgent // 用户标识，可选
    };
    
    _dx.ConstID(options, function (err, token) {
        if (err) {
             console.log('error: ' + err);
            return;
        }
        dingxiang_udid = token;
         console.log('const-id token is ' + token);
    });
	var element = layui.element;
	var $ = layui.jquery,
		upload = layui.upload;
	var OriginTitile = document.title;
	var titleTime;
	var demoListView = $('#demoList'),
		uploadListIns = upload.render({
			elem: '#testList',
			url: uploadurl,
			accept: 'file',
			exts: 'jpg|zip|gif|png|bmp|mp3|txt',
			//|mp4|zip|rar|wav|apk|7z
			size: 200*1024,
			multiple: true,
			auto: false,
			drag: true,
			bindAction: '#testListAction',
			headers:{sign:signstr},
			progress: function(n,a){
				console.log(n);
				console.log(a);
				var percent = n + '%'; //获取进度百分比
				element.progress('upload-progress', percent); //可配合 layui 进度条元素使用
				console.log(percent);
			},
			choose: function(obj) {
			    this.data={'md5':'null','uid':$.cookie('FFSUP_OnLineCount'),'time':new Date().getTime()}
			    this.data.dingxiang = document.getElementById('dingxiang').value;
			    this.data.udid = dingxiang_udid;
				var files = this.files = obj.pushFile();
				obj.preview(function(index, file, result) {
				    
                var tr = $(['<tr id="upload-' + index + '">', '<td>' + file.name + '</td>', '<td>' + (file.size / 1014).toFixed(1) + 'kb</td>', '<td>等待上传</td>', '<td>', '<button class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>', '<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>', '</td>', '</tr>'].join(''));
				tr.find('.demo-reload').on('click', function() {
						obj.upload(index, file);
					});
				tr.find('.demo-delete').on('click', function() {
					delete files[index];
					tr.remove();
					uploadListIns.config.elem.next()[0].value = '';
					});
				console.log(tr);
				demoListView.append(tr);
				browserMD5File(file, function (err, md5) {
				    res_md5 = md5;
				    console.log(uploadListIns.config);
				    uploadListIns.config.data.md5 = res_md5;
				    $.ajax({  
                       url: uploadurl,  
                       dataType: 'json',  
                       type: 'post',  
                       data:uploadListIns.config.data,
                       //cache: false,  
                       //contentType: 'application/x-www-form-urlencoded',  
                      //headers : {'Access-Control-Allow-Origin':'*'},
                        xhrFields: {
                　　　　    　　withCredentials: true
                　　　　},
                       beforeSend: function(xhr) {
                            xhr.setRequestHeader("sign",signstr);
                        },
                       success: function (res) {  
                           console.log(res);
                            if (res.code == 2) {
                                //console.log(index);
                                var tr = demoListView.find('tr#upload-' + index),tds = tr.children();
                                console.log(tr);
                				tds.eq(2).html('<span style="color: #5FB878;">秒传成功</span>');
                				tds.eq(3).html('<button type="button" class="layui-btn" onclick="window.open(\'' + res.data.url + '\');"><i class="layui-icon layui-icon-link"></i></button><button type="button" class="layui-btn" onclick="layer.open({title: \'' + res.data.name + '\',content: \'' + res.data.url + '\'});"><i class="layui-icon"></i></button>');
                				var tr = $(['<tr id="upload-' + index + '">', '<td>' + res.data.name + '</td>', '<td>' + res.data.url + '</td>', '</tr>'].join(''));
                				$('#upload-data-List').append(tr);
                				upload_data += res.data.name + '：' + res.data.url + '\n';
                				record_url += res.data.name + '：' + res.data.url + '\n';
                				$.cookie('record_url', record_url, { expires: 30 });
                				
                				delete files[index];
                				}
                       }  
                   });  
				    /*$.post(
        			    uploadurl,
        			    {'md5':md5},
        			    function(res){
        			        
        			        console.log(res);
                            if (res.code == 2) {
                                
                                var tr = demoListView.find('tr#upload-' + index),tds = tr.children();
                                console.log(tr);
                				tds.eq(2).html('<span style="color: #5FB878;">秒传成功</span>');
                				tds.eq(3).html('<button type="button" class="layui-btn" onclick="window.open(\'' + res.data.url + '\');"><i class="layui-icon layui-icon-link"></i></button><button type="button" class="layui-btn" onclick="layer.open({title: \'' + res.data.name + '\',content: \'' + res.data.url + '\'});"><i class="layui-icon"></i></button>');
                				var tr = $(['<tr id="upload-' + index + '">', '<td>' + res.data.name + '</td>', '<td>' + res.data.url + '</td>', '</tr>'].join(''));
                				$('#upload-data-List').append(tr);
                				upload_data += res.data.name + '：' + res.data.url + '\n';
                				record_url += res.data.name + '：' + res.data.url + '\n';
                				$.cookie('record_url', record_url, { expires: 30 });
                				
                				delete files[index];
                				}
                            },
                        'json'
        			);*/
                    console.log(md5); // 97027eb624f85892c69c4bcec8ab0f11
                });
                
				//ress = check(file); // 执行获取md5
			    //console.log(res_md5);
			    //console.log(file);
				console.log(index);
				});
			},
			before: function(obj){ //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
			$.ajaxSetup({
                        // 发送cookie
                xhrFields: {
                    withCredentials: true
                }
        　　})
			this.headers.sign= signstr;
            console.log(res_md5,13)
            this.data={'md5':res_md5,'uid':$.cookie('FFSUP_OnLineCount'),'time':new Date().getTime()}
            this.data.dingxiang = document.getElementById('dingxiang').value;
            this.data.udid = dingxiang_udid;
            },
			done: function(res, index, upload) {
				var tr = demoListView.find('tr#upload-' + index),
					tds = tr.children();
				if (res.code == 1) {
					tds.eq(2).html('<span style="color: #5FB878;">上传成功</span>');
					tds.eq(3).html('<button type="button" class="layui-btn" onclick="window.open(\'' + res.data.url + '\');"><i class="layui-icon layui-icon-link"></i></button><button type="button" class="layui-btn" onclick="layer.open({title: \'' + res.data.name + '\',content: \'' + res.data.url + '\'});"><i class="layui-icon"></i></button>');
					var tr = $(['<tr id="upload-' + index + '">', '<td>' + res.data.name + '</td>', '<td>' + res.data.url + '</td>', '</tr>'].join(''));
					$('#upload-data-List').append(tr);
					upload_data += res.data.name + '：' + res.data.url + '\n';
					record_url += res.data.name + '：' + res.data.url + '\n';
					$.cookie('record_url', record_url, { expires: 30 });
					return delete this.files[index];
				}
				if (res.code == 2) {
					tds.eq(2).html('<span style="color: #5FB878;">秒传成功</span>');
					tds.eq(3).html('<button type="button" class="layui-btn" onclick="window.open(\'' + res.data.url + '\');"><i class="layui-icon layui-icon-link"></i></button><button type="button" class="layui-btn" onclick="layer.open({title: \'' + res.data.name + '\',content: \'' + res.data.url + '\'});"><i class="layui-icon"></i></button>');
					var tr = $(['<tr id="upload-' + index + '">', '<td>' + res.data.name + '</td>', '<td>' + res.data.url + '</td>', '</tr>'].join(''));
					$('#upload-data-List').append(tr);
					upload_data += res.data.name + '：' + res.data.url + '\n';
					record_url += res.data.name + '：' + res.data.url + '\n';
					$.cookie('record_url', record_url, { expires: 30 });
					return delete this.files[index];
				}
				if (res.code < 0) {
					tds.eq(2).html('<span style="color: #FF5722;">上传失败:' + res.msg + '</span>');
				}
				this.error(index, upload);
			},
			error: function(index, upload) {
				var tr = demoListView.find('tr#upload-' + index),
					tds = tr.children();
				tds.eq(3).find('.demo-reload').removeClass('layui-hide');
			}
		});
		layui.use('laytpl', function(){
      var laytpl = layui.laytpl;
      //页首
      $.get('top.htm',function(getdata){
    	var htm_top = document.getElementById('top');
    	var gethtm = htm.innerHTML;
    	laytpl(gethtm).render(getdata, function(html){
    	  htm_top.innerHTML = html;
    	});
      });
      //页尾
      $.get('fot.htm',function(getdata){
    	var htm_fot = document.getElementById('fot');
    	var gethtm = htm.innerHTML;
    	laytpl(gethtm).render(getdata, function(html){
    	  htm_fot.innerHTML = html;
    	});
      });
    });
    /*
     *标题
     */
    document.addEventListener('visibilitychange', function () {
    	if (document.hidden) {
    		$('[rel="icon"]').attr('href', "/favicon.ico");
    		document.title = '╭(°A°`)╮ 页面崩溃啦 ~ | 你快回来！';
    		clearTimeout(titleTime);
    	}
    	else {
    	$('[rel="icon"]').attr('href', "/favicon.ico");
    		document.title = '(ฅ>ω<*ฅ) 噫又好了~' + OriginTitile;
    		titleTime = setTimeout(function () {
    		document.title = OriginTitile;
    		}, 2000);
    	}
    });
});