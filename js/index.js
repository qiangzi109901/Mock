require(['dialog','frame','prism'])

			
require(['datatype','jquery','storage','common','mselect2','mtemplate','datautil','clip'],function(datatype,$,storage,common,mselect2,mtemplate,datautil,Clipboard){

	var config = {
		NAME_LIST : 'mock_list',
		NAME_KEY_PREFIX : 'mock_key_'
	};


	var currentHistory = storage.getJson(config.NAME_LIST) || [];
	var currentItem = null;
	var lastSaveTime = common.nowTime();


	addId();
	bindTypeEvent();
	
	function bindTypeEvent(){
		$(".mtype").each(function(){
			bindTypeOneEvent("#"+$(this).attr("id"));
		});
	}

	function bindTypeOneEvent(mid){
		mselect2.renderDataAndBind(mid,datatype,function(val,id){
			var def = "";
			switch (val) {
				case "String":
					def = '{"minlen":"10","maxlen":"20"}'
					break;
				case "Number":
					def = '{"min":"0","max":"100"}'
					break;
				case "Date":
					def = "yyyy-MM-dd HH:mm:ss"
					break;
				case "Enum":
					def = '["val1","val2"]'
					break;
				case "Only" :
					def = "value";
					break;
				default:
					// statements_def
					break;
			}
			$(id).parent("td").next("td").find("input").val(def)
		});
	}

	bindDelete();
	$("#plus").click(function(){
		var itemhtml = mtemplate.render("temp_item",{});
		$("#mbody").append(itemhtml);
		bindDelete();
		var id = common.randomStr(8)
		$(".mtype:eq(-1)").attr('id', id);
		bindTypeOneEvent("#"+id);

	});

	mselect2.renderData('#number',function(){
		var result = [];
		for(var i=1;i<101;i++){
			result.push({
				id : i,
				text : i+'个'
			});
		}
		var ot = [200,300,500,1000];
		for(var i in ot){
			result.push({
				id : ot[i],
				text : ot[i]+'个'
			});
		}
		
		return result;
	});

	mselect2.renderDataAndBind('#catalog',[
		{
			id : 'Object',
			text : '对象'
		},
		{
			id : 'ObjectArray',
			text : '对象数组'
		},
		{
			id : 'ZipObject',
			text : '压缩对象'
		},
		{
			id : 'ZipObjects',
			text : '多个压缩对象'
		},{
			id : 'ZipObjectArray',
			text : '压缩对象数组'
		},{
			id : 'Sql',
			text : 'Insert语句'
		},{
			id : 'ManySql',
			text : '多个Insert语句'
		}

	],function(val){
		if(val == 'ObjectArray' || val == 'ZipObjects' || val == 'ZipObjectArray' || val == 'ManySql'){
			$("#dnumber").show();
			mselect2.val('#number',10);
		}
		else{
			$("#dnumber").hide();
		}

		if(val == "Sql" || val == "ManySql"){
			$("#mtable").show();
		}
		else{
			$("#mtable").hide();
		}
	},'Object');


	$("#render_btn").click(function(){

		var items = [];
    	$("#mbody tr").each(function(index){
			var key = $(this).find("input:eq(0)").val();
			var type = $(this).find("select").val();
			var extra = $(this).find("input:eq(-1)").val();
			if(key != "" && datautil[type]){
				items.push({key:key,type:type,extra:extra});
			}
		});


    	var name = $("#mname").val();
    	
    	if(name == ""){
    		name = common.randomStr(8);
    	}

    	//先获取对象
    	var list = currentHistory;
    	var id = "";
    	if(currentItem != null){
    		id = currentItem.id;
    	}
    	else{
    		id = config.NAME_KEY_PREFIX  +  common.randomStr(8);

    	}
    	var storeItem = {
    		id : id,
    		text : name,
    		value : items,
    		catalog : mselect2.val("#catalog"),
    		number : mselect2.val("#number"),
    		table : $("#mtable").val(),
    		ordinal : common.autoId()
    	}


    	var t2  = common.gapTime(lastSaveTime);
    	lastSaveTime = common.nowTime();

    	if(currentItem == null || t2 > 5){
    		common.addOrReplaceItem(list, storeItem, "id");
	    	currentHistory = list;
	    	setHistory();
	    	currentItem = storeItem;
			initSelectList();
	    	mselect2.val('#mlist', id)
    	}
    	
 

	    render(items);
	});


	var clipboard = new Clipboard('#copy');
    clipboard.on('success', function(e){
        $.success("复制成功");
        e.clearSelection();
    });

    clipboard.on('error', function(e){
        $.warn("请按快捷键复制");
    });


    

    function render(items){
    	var finalHtml = null;
    	var catalog = mselect2.val("#catalog");
    	var number = mselect2.val("#number");

    	if(catalog == 'ObjectArray' || catalog == 'ZipObjects' || catalog == 'ZipObjectArray' || catalog == 'ManySql'){
			
		}
		else{
			number = -1;
		}

    	var result = [];
    	if(number == -1){
    		for(var i in items){
    			var item = items[i];
    			result.push({key:item.key,value:datautil[item.type](item.extra)});
    		}	
    	}
    	else{
    		for(var j = 0;j<number ;j++){
    			var mitems = [];
	    		for(var i in items){
	    			var item = items[i];
	    			mitems.push({key:item.key,value:datautil[item.type](item.extra)});
	    		}
	    		result.push(mitems);
    		}
    	}


    	if(catalog == "Object"){
			finalHtml = mtemplate.render('temp_obj',{"items":result});
    	}
    	else if(catalog == "ObjectArray"){
    		finalHtml = mtemplate.render('temp_obj_array',{"lists":result});
    	}
    	else if(catalog == "ZipObject"){
    		finalHtml = mtemplate.renderAndCompress('temp_obj',{"items":result})
    	}
    	else if(catalog == "ZipObjects"){
    		finalHtml = mtemplate.renderAndCompress('temp_obj_many_zip',{"lists":result})
    		finalHtml = mtemplate.makeNewLine(finalHtml,'},');
    	}
    	else if(catalog == "ZipObjectArray"){
    		finalHtml = mtemplate.renderAndCompress('temp_obj_array',{"lists":result})
    		finalHtml = mtemplate.makeNewLine(finalHtml,'},');
    	}
    	else if(catalog == "Sql"){
    		finalHtml = mtemplate.renderAndCompress('temp_insert_sql',{"items":result,"table":$("#mtable").val()||'table'});
    	}
    	else if(catalog === "ManySql"){
    		finalHtml = mtemplate.renderAndCompress('temp_batch_insert',{"lists":result,"table":$("#mtable").val()||'table'})
    		finalHtml = mtemplate.makeNewLine(finalHtml,'\\);',');\n');
    	}

		$("#code").html(mtemplate.removeBlankLine(finalHtml));
		Prism.highlightAll();

    }


    $("#bAdd").click(function(){


    	var items = [];
    	$("#mbody tr").each(function(index){
			var key = $(this).find("input:eq(0)").val();
			var type = $(this).find("select").val();
			var extra = $(this).find("input:eq(-1)").val();
			if(key != "" && datautil[type]){
				items.push({key:key,type:type,extra:extra});
			}
		});

    	if(items.length > 0){
    		var name = $("#mname").val() || common.randomStr(8);

    		//先获取对象
	    	var list = currentHistory;
	    	var id = "";
	    	if(currentItem != null){
	    		id = currentItem.id;
	    	}
	    	else{
	    		id = config.NAME_KEY_PREFIX  +  common.randomStr(8);

	    	}
	    	var storeItem = {
	    		id : id,
	    		text : name,
	    		value : items,
	    		catalog : mselect2.val("#catalog"),
	    		number : mselect2.val("#number"),
	    		table : $("#mtable").val(),
	    		ordinal : common.autoId()
	    	}


	    	var t2  = common.gapTime(lastSaveTime);
	    	lastSaveTime = common.nowTime();

	    	if(currentItem == null || t2 > 5){
	    		common.addOrReplaceItem(list, storeItem, "id");
		    	currentHistory = list;
		    	setHistory();
		    	currentItem = storeItem;
				initSelectList();
	    	}
    	}


    	mselect2.val("#mlist","");
    	newOne();
    	currentItem = null;
    });

    $("#bDelete").click(function(){
    	if(currentItem == null || currentHistory.length == 0){
    		return;
    	}
    	
    	$.showConfirm("确定要删除吗？",function(){
    		var mlistValue = mselect2.val("#mlist");
	    	common.removeFromArrayByKey(currentHistory, 'id', mlistValue);
	    	setHistory();
	    	newOne();
			initSelectList();
			currentItem = null;
    	});
    	
    });	


    function newOne(){
    	var itemhtml = mtemplate.render("temp_item",{});
		$("#mbody").html(itemhtml);
		$("#mname").val("");
		bindDelete();
		var id = common.randomStr(8)
		$(".mtype:eq(-1)").attr('id', id);
		bindTypeOneEvent("#"+id);
		mselect2.val("#catalog","Object");
    }

    function setHistory(){
    	storage.setJson(config.NAME_LIST, currentHistory);
    }


    function initSelectList(){
    	common.sortArray(currentHistory, "ordinal", "desc");
    	console.log(currentHistory)
    	mselect2.renderDataAndBind("#mlist",currentHistory,function(val){
    		if(val == ''){
    			return;
    		}
	    	var item = common.getItemByKey( currentHistory, 'id', val);
	    	$("#mbody").html(mtemplate.render('temp_backup', {'lists':item.value}));
	    	addId();
	    	bindTypeEvent();
	    	$("#mname").val(item.text);
	    	var catalog = item.catalog || 'Object';
	    	mselect2.val("#catalog", catalog);
	    	if(catalog == 'ObjectArray' || catalog == 'ZipObjects' || catalog == 'ZipObjectArray' || catalog == 'ManySql'){
				$("#dnumber").show();
				mselect2.val('#number',item.number || 10);
			}
			else{
				$("#dnumber").hide();
			}
			$("#mtable").val(item.table || '')
	    	currentItem = item;

	    	$("#code").html("");
	    	bindDelete();
	    });
    }	

    initSelectList();

    function bindDelete(){
    	$(".mclose").each(function(){
    		$(this).unbind("click");
    		$(this).click(function(){
    			$(this).parents("tr").remove();
    		});
    	})
    }

    function addId(){
    	$(".mtype").each(function(){
    		$(this).attr('id',common.randomStr(8));
    	});
    }

});

