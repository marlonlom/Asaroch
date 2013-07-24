var atles = {
    templates: {},
    atHome: true,
    googleMapsState: "",
    iscroll: null
};
atles.initialize = function () {
    this.templates.home = Handlebars.compile($("#hbt-home").html());
    this.templates.tomeContents = Handlebars.compile($("#hbt-tomes-list").html());
    this.templates.singleDocs = Handlebars.compile($("#hbt-single-docview").html());
    this.templates.mapdocsList = Handlebars.compile($("#hbt-maps-doclist").html());
    this.templates.mapdocsItems = Handlebars.compile($("#hbt-tome-mapdocs-listitems").html());
};
atles.isOffline = function () {
    var connectionType = navigator.connection ? navigator.connection.type : null;
    return connectionType !== null && (connectionType == Connection.NONE || connectionType == Connection.UNKNOWN);
};
atles.toggleClickEvent = function () {
    return $.device.mobile ? 'touchstart' : 'click';
};
atles.showAlert = function (message, title) {
    if (navigator.notification) {
        navigator.notification.alert(message, null, title, 'OK');
    } else {
        alert(title ? (title + ": " + message) : message);
    }
};
atles.handleDANEWebpageAccess = function () {
    $('body').on(atles.toggleClickEvent(), '.danelogo1', function (e) {
        e.preventDefault();
        window.open('http://www.dane.gov.co', '_system');
    });
};
atles.handleSearchBox = function () {
    $('body').on(atles.toggleClickEvent(), 'button#search-btn', function (e) {
        e.preventDefault();
        var searchtext = $('input#search-text').val() || 'nah';
        atles.prepareSearchsView(searchtext);
    });
};
atles.prepareCommonPageBehaviour = function () {
    if (FastClick) {
        FastClick.attach(document.body);
    }

    if (atles.iscroll !== null) {
        atles.iscroll.destroy();
        atles.iscroll = null;
    }
    atles.iscroll = new iScroll("wrapper");
};
atles.prepareMainView = function () {
    $('body').off(atles.toggleClickEvent());

    $('body').html(this.templates.home({
        menu: data.homeList
    }));

    atles.prepareCommonPageBehaviour();

    $('body').off(atles.toggleClickEvent()).on(atles.toggleClickEvent(), 'a.categ-link', function (e) {
        e.preventDefault();
        var hash = $(this).attr('data-home-link') || 'nah';
        if (hash.indexOf('tome') === 0) {
            atles.showTomeContentsListView(hash);
        }
        if (hash === 'welcome') {
            atles.showWelcomeNoteView();
        }
        if (hash === 'mapslist') {
            atles.showMapdocsListView();
        }
    });
    atles.handleDANEWebpageAccess();
};
atles.showWelcomeNoteView = function(){
    $('body').off(atles.toggleClickEvent());
    atles.atHome = false;
    $('body').html(this.templates.singleDocs());
    $('.document-content').load('pages/welcome.html',function(data, status, xhr){ 
        atles.prepareCommonPageBehaviour();
    });
    $('body').on(atles.toggleClickEvent(), '.back-home-icon', function (e) {
        e.preventDefault();
        atles.atHome = true;
        atles.prepareMainView();
    }).on(atles.toggleClickEvent(), '.back-prev-icon', function (e) {
        e.preventDefault();
        atles.atHome = true;
        atles.prepareMainView();
    });
};
atles.showMapdocsListView = function(){
    $('body').off(atles.toggleClickEvent());
    atles.atHome = false;
    $('body').html(this.templates.mapdocsList());
    $('body').on(atles.toggleClickEvent(), '.back-home-icon', function (e) {
        e.preventDefault();
        atles.atHome = true;
        atles.prepareMainView();
    }).on(atles.toggleClickEvent(), '.back-prev-icon', function (e) {
        e.preventDefault();
        atles.atHome = true;
        atles.prepareMainView();
    }).on(atles.toggleClickEvent(), '.tome-menutab', function (e) {
        e.preventDefault();
        var tome_ref = $(this).attr('data-tomeref') || 'nah';
        if(tome_ref !== 'nah'){
            atles.showTomeMapsListingView(tome_ref);
        }
    });
    atles.showTomeMapsListingView('tome01');
};
atles.showTomeMapsListingView = function(tome_key){
    $('.tome-menutab').css('font-weight', 'normal').css('color','#1D1D1D').css('background','#dddddd');
    $('.tome-menutab[data-tomeref='+tome_key+']').css('font-weight', 'bold').css('color','#B6014C').css('background','#d1d1d1');
    
    var tomeMaps = $.grep(data.mapsList, function (item, index) {
        return item['tome'] === tome_key;
    });
    $('div.maplist-tabcontents').html(this.templates.mapdocsItems({list:tomeMaps}));    
    atles.prepareCommonPageBehaviour();
};
atles.showTomeContentsListView = function (hash) {
    $('body').off(atles.toggleClickEvent());
    atles.atHome = false;

    var tomeContents = $.grep(data.tomesList, function (item, index) {
        return item['tome'] === hash;
    });

    var tome = $.grep(data.homeList, function (item, index) {
        return item['cod'] === hash;
    });

    var context = {
        tomekey: hash,
        tomeName: tome !== null && tome.length > 0 ? tome[0].nom : '',
        list: tomeContents
    };

    $('body').html(this.templates.tomeContents(context));

    $('li.leaf').hide();

    atles.prepareCommonPageBehaviour();

    $('body').on(atles.toggleClickEvent(), '.back-home-icon', function (e) {
        e.preventDefault();
        atles.atHome = true;
        atles.prepareMainView();
    }).on(atles.toggleClickEvent(), 'li.tome-itm span', function (e) {
        e.preventDefault();
        var docroot = $(this).attr('data-tome-docroot') || 'nah';
        var docref = $(this).attr('data-tome-docref');
        $('li.leaf').hide();
        $('li span').css('color','#000000');
        if (docroot !== 'nah') {
            if (docroot.indexOf('/')>0){
                $('li.leaf.leaf-' + docroot.split('/')[0]).show();
                $('span[data-tome-docref='+docroot.split('/')[0]+']').css('color','#B92859');
                $('li.leaf').filter(function (index, item) {
                    var claz = $(this).attr('class');
                    return claz.indexOf(docroot) >= 0;
                }).show();
                $('span[data-tome-docref='+docroot.split('/')[1]+']').css('color','#B92859');
            }else{
                var otkn = docroot.concat('/').concat(docref);
                $('li.leaf.leaf-' + docroot).show();
                $('span[data-tome-docref='+docroot+']').css('color','#B92859');
                $('li.leaf').filter(function (index, item) {
                    var claz = $(this).attr('class');
                    return claz.indexOf(otkn) >= 0;
                }).show();
                $('span[data-tome-docref='+docref+']').css('color','#B92859');
            }
        } else {
            $('li.leaf.leaf-' + docref).show();
            $('span[data-tome-docref='+docref+']').css('color','#B92859');
        }
        atles.prepareCommonPageBehaviour();
    }).on(atles.toggleClickEvent(), 'li.tome-itm img.img-viewdoc', function (e) {
        var docref = $(this).attr('data-tome-doc-link');
        /*atles.showAlert('documento: '+docref,'documento');*/
        atles.showAlert('contenido ','documento');
    }).on(atles.toggleClickEvent(), '.back-prev-icon', function (e) {
        e.preventDefault();
        atles.atHome = true;
        atles.prepareMainView();
    });
    atles.handleDANEWebpageAccess();
};