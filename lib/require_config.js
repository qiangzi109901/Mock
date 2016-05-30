// Tell RequireJS where ace is located
require.config({
    urlArgs: "version=" + new Date().getTime(),
    baseUrl : 'js/',
    paths: {
    	'jquery':'../lib/jquery',
        'template' : '../lib/art_template',
        'tool' : '../lib/plugin/frame/tool',
        'dialog' : '../lib/plugin/frame/dialog',
        'frame' : '../lib/plugin/frame/frame',
        'select2' : '../lib/select2/select2.min',
        'parser' : '../lib/epiceditor/js/parser',
        'util' : '../lib/util',
        'message' : '../lib/message',
        'mtemplate' : '../lib/mtemplate',
        'mselect2' : '../lib/mselect2',
        'prism' : '../lib/prism/prism',
        'clip' : '../lib/clipboard.min',
        'dateutil' : '../lib/dateutil',
        'storage' : '../lib/storage',
        'common' : '../lib/common'
    },
    shim : {
    	'message' : {
    		deps : ['jquery']
    	},
        'smartmenu' : {
            deps: ['jquery'],
        },
        'select2' : {
            deps : ['jquery']
        }
    }

});
