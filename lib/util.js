define(['jquery','message'],function($){
	return {
		jax : function(param){
			$.ajax({
				url : param.url,
				type : param.type,
				data : param.data,
				async : param.async == false ? false : true,
				dataType : 'json',
				success : function(e){
					if(!e.success){
						$.error(e.message);
						return;
					}
					if(e.data){
						return param.cb && param.cb(e.data);
					}
					param.cb && param.cb(e);
				},
				error : function(e){
					$.error("服务器错误");
				}
			})
		},
		post : function(url,data,cb){
			if(typeof data == "function"){
				cb = data;
				data = null;
			}
			this.jax({
				url : url,
				type : 'post',
				data : data,
				cb : cb
			});
		},
		postAndGet : function(url, data){
			var result = null;
			this.jax({
				url : url,
				type : 'post',
				data : data,
				async : false,
				cb : function(e){
					result = e;
				}
			});
			return result;
		},
		formdata : function(form){
			return $(form).serialize();
		},
		form2param : function(form){
			return this.query2param($(form).serialize(),form);
		},
		query2param : function(s,form){
			var i = s.indexOf("?");
			if(i>-1){
				s = s.slice(i + 1);
			}
			var ts = s.split("&");
			var result = {};
			for(var i in ts){
				var k = ts[i].split("=");
				if(k.length == 2){
					if(k[1] == ""){
						k[1] = $(form).find("input[name="+k[0]+"]").attr("defaultVal") || '';
					}
					result[k[0]] = decodeURIComponent(k[1]);
				}
			}
			return result;
		},
		assignForm : function(form, data, except){
			var targets = $(form).find('[name]');
			var len = targets.length;
			except = except || [];
			for(var i=0;i<len;i++){
				var item = targets.eq(i);
				var name = item.attr('name');
				if(except.indexOf(name) < 0 && data[name]){
					item.val(data[name]);
				}
			}
		}
	}
})