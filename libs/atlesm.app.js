var atles = {
    templates: {},
    atHome: true,
    googleMapsState: "",
    iscroll: null
};
atles.initialize = function () {
    this.templates.home = Handlebars.compile($("#hbt-home").html());
    this.templates.tomeContents = Handlebars.compile($("#hbt-tomes-list").html());
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
        if (hash.indexOf('welcome') === 0) {
            alert(hash);
        }
    });
    atles.handleDANEWebpageAccess();
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
        if (docroot !== 'nah') {
            if (docroot.indexOf('/')>0){
                $('li.leaf.leaf-' + docroot.split('/')[0]).show();
                $('li.leaf').filter(function (index, item) {
                    var claz = $(this).attr('class');
                    return claz.indexOf(docroot) >= 0;
                }).show();
            }else{
                var otkn = docroot.concat('/').concat(docref);
                $('li.leaf.leaf-' + docroot).show();
                $('li.leaf').filter(function (index, item) {
                    var claz = $(this).attr('class');
                    return claz.indexOf(otkn) >= 0;
                }).show();
            }
        } else {
            $('li.leaf.leaf-' + docref).show();
        }
        atles.prepareCommonPageBehaviour();
    }).on(atles.toggleClickEvent(), '.back-prev-icon', function (e) {
        e.preventDefault();
        atles.atHome = true;
        atles.prepareMainView();
    });
    atles.handleDANEWebpageAccess();
};