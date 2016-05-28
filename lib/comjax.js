//这里将列出所有select2需要用的数据

define(['jquery','util',''],function($,util,mtemplate){
	var comon = {
		getHosts : function(cb){
            util.post('/data/db_config/getHost',cb);
		},
        getDbByHost : function(host,cb){
            util.post('/data/db_config/getDbByHost',{'host':host},cb);
		},
        getLanguages : function(cb){
            util.post('/data/temp_catalog/getLanguages',cb);
        },
        getFirstTempCatalogs : function(cb){
            util.post('/data/temp_catalog/listByPid',{'val':0},cb);
        },
        getUsers : function(cb){
            util.jax({
                url : '/data/user/all',
                type : 'post',
                cb : cb
            })
        },
        getUsersByDepartment : function(departmentId,id,cb){
            util.jax({
                url : '/data/user/all',
                type : 'post',
                data : {'department_id':departmentId,"id":id},
                cb : cb
            })
        },
        getApplyTypeFirst : function(cb){
            util.jax({
                url : '/data/apply_type/listByPid',
                type : 'post',
                data : {'pid':0},
                cb : cb
            })
        },
        getApplyTypeSecond : function(cb){
            util.jax({
                url : '/data/apply_type/listByType',
                type : 'post',
                data : {'type':1},
                cb : cb
            })
        },
        
	}

    return comon;
});