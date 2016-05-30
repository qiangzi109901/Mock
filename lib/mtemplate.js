

define(['template'],function(template){

    template.helper('dateFormat',function(val,pattern){
        if(val == null || val == ''){
            return '-'
        }
        if(val.indexOf('0000-00-00') == 0){
            return '-';
        }
        pattern = pattern || 'datetime';
        switch (pattern){
            case 'datetime' :
                return val;
            case 'date':
                return val.slice(0,10);
            case 'spectial':
                return showTime(val);
            default :
                return val;
        }
    });

    template.helper('mvalue', function(item){
        if(/^\d+$/.test(item.value)){
            return item.value;
        }
        return '"' + item.value + '"';
    });

    template.helper('comma', function(items, index, tag){
        tag = tag || ",";
        return items.length - 1 > index ? tag : '';
    });

    function htmlEscape(str) {
        return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
    }


    function compress(str){
        return String(str)
                .replace(/\s\s*/g, ' ')
                .replace(/ \"/g,'"')
                .replace(/\" /g,'"')
    }

    template.config('openTag','[[');
    template.config('closeTag',']]');

    return {
        render : function(id,data){
            return template(id,data);
        },
        htmlEscape : function(source){
            return htmlEscape(source);
        },
        removeBlankLine : function(source){
            return source.replace(/\n\s*\n/g,'\n');
        },
        compressData : function(source){
            return compress(source);
        },
        renderAndCompress : function(id,data){
            var source = this.render(id,data);
            return compress(source);
        },
        makeNewLine : function(source, tag, rep){
            var regexp = new RegExp(tag,"gm");
            rep = rep || (tag + "\n");
            return source.replace(regexp, rep);
        },
        compile : function(source,data){
            return template.compile(source)(data);
        }
    }


});