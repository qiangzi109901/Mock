define(function(){

	var store = window.localStorage;
	//特有的id
	
	var Storage = {
		check : function(){
			if(!store){
				alert("请使用chrome,firefox等高级浏览器");
			}
		},
		setItem : function(key,value){
			store.setItem(key,value); 
		},
		getItem : function(key){
			return store.getItem(key);
		},
		removeItem : function(key){
			store.removeItem(key);
		},
		clear : function(){
			store.clear();
		},
		setJson : function(key,jsonVal){
			var v = JSON.stringify(jsonVal);
			this.setItem(key, v);
		},
		getJson : function(key){
			var v = this.getItem(key);
			if(v){
				return JSON.parse(v);
			}
			return null
		},
		setJsonArray : function(key, jsonArray){
			this.setJson(key, jsonArray);
		},
		getJsonArray : function(key){
			return this.getJson(key);
		}
	}
	return Storage;
});