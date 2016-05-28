define(['template','data/demo'], function (template,demoData) {

    template.helper('dateFormat', function (val, pattern) {
        if (val == null || val == '') {
            return '-'
        }
        if (val.indexOf('0000-00-00') == 0) {
            return '-';
        }
        pattern = pattern || 'datetime';
        switch (pattern) {
            case 'datetime' :
                return val;
            case 'date':
                return val.slice(0, 10);
            case 'spectial':
                return showTime(val);
            default :
                return val;
        }
    });


    template.config('openTag', '[[');
    template.config('closeTag', ']]');
    template.config('escape',false);

    function maketemplate(fn) {
        return fn.toString().split('\n').slice(1,-1).join('\n') + '\n'
    }


    var node_where_date = maketemplate(function(){/*
{{[[column.column_name]]_start | and:'t1.[[column.column_name]]','gte'}}
            {{[[column.column_name]]_end | and:'t1.[[column.column_name]]','lte'}}
     */});
    
    var node_where_string = maketemplate(function(){/*
{{[[column.column_name]] | and:'t1.[[column.column_name]]'}}
     */});

    var java_set_string = maketemplate(function(){/*
<if test="[[column.name]] != null and [[column.name]] != ''">
                [[column.column_name]] = #{[[column.name]]}
            </if>
    */})
     var java_set_digit = maketemplate(function(){/*
<if test="[[column.name]] != null">
                [[column.column_name]] = #{[[column.name]]}
            </if>
    */})
    var java_where_string = maketemplate(function(){/*
<if test="[[column.name]] != null and [[column.name]] != ''">
            [[column.column_name]] = #{[[column.name]]}
        </if>
    */})
     var java_where_digit = maketemplate(function(){/*
<if test="[[column.name]] != null">
            [[column.column_name]] = #{[[column.name]]}
        </if>
    */})

    //索引
    template.helper('ms', function (val, data, index) {
        if (index < data.length - 1) {
            val += ','
        }
        return val;
    });

    template.helper('m', function (data, index) {
        if (index < data.length - 1) {
            return ','
        }
        return ''
    });


    template.helper('col', function (column, data, index) {
        var col = column.column_name;
        if (col == 'id') {
            return ''
        }
        if (index < data.length - 1) {
            col += ','
        }
        return col;

    });

    template.helper('ncol', function (column, data, index) {
        var col = column.column_name;
        if (col == 'id') {
            return '';
        }
        var dou = index < data.length - 1 ? ',' : '';
        switch (column.type) {
            case 'Date':
                return '{{now | d}}' + dou;
            case 'String':
            case 'Integer':
            case 'Long':
                return '{{' + col + ' | q}}' + dou;
        }
    });


    template.helper('jcol', function (column, data, index) {
        var prop = column.name;
        if (prop == 'id') {
            return '';
        }
        var dou = index < data.length - 1 ? ',' : '';
        return "#{" + prop + "}" + dou;
    });

    template.helper('neq', function(column, data, index){
        var col = column.column_name;
        if(col == 'id'){
            return ''
        }
        var dou = index < data.length - 1 ? ',' : '';
        switch (column.type){
            case 'Date':
                return "{{now | ed:'" + col + "'}}" + dou;
            case 'String':
            case "Integer":
            case "Long":
                return "{{" +col+ " | eq:'" + col + "'}}" + dou;
        }
    });


    function return_template(source, column){
        return template.compile(source)({'column':column})
    }

    template.helper('nand', function(column, data, index){
        var col = column.column_name;
        if(col == 'id'){
            return ''
        }
        switch (column.type){
            case 'Date':
                return return_template(node_where_date, column)
            case 'String':
            case "Integer":
            case "Long":
                return return_template(node_where_string, column)
        }
    });

    template.helper('jset', function(column){
        if(column.name == 'id'){
            return '';
        }
        switch(column.type){
            case 'String':
                return return_template(java_set_string, column)
            default:
                return return_template(java_set_digit, column)
        }
    });

    template.helper('jwhere', function(column){
        if(column.name == 'id'){
            return '';
        }
        switch(column.type){
            case 'String':
                return return_template(java_where_string, column)
            case 'Date':
                return ''
            default:
                return return_template(java_where_digit, column)
        }
    });


    function htmlEscape(str) {
        return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
    }

    return {
        compile: function (source, data) {
            return template.compile(source)(data);
        },
        zipCompile : function(source, data){
            template.config('compress',true);
            var html = template.compile(source)(data);
            template.config('compress',false);
            return html;
        },
        htmlEscape : function(source){
            return htmlEscape(source);
        },
        compileWithDemo : function(source){
            template.config('escape',true);
            return template.compile(source)(demoData);
        },
        render : function(id,data){
            return template(id,data);
        }
    }

});