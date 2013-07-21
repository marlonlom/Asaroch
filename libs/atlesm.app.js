var atles = {
    templates: {},
    atHome: true,
    googleMapsState: "",
    iscroll: null
};
atles.initialize = function () {
    this.templates.home = Handlebars.compile($("#hbt-home").html());
    /*this.templates.indqsList = Handlebars.compile($("#hbt-indiqs-list").html());
    this.templates.searchs = Handlebars.compile($("#hbt-search-results").html());
    this.templates.mapping = Handlebars.compile($("#hbt-mapping").html());*/
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
    if(FastClick){
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
    });
    atles.handleDANEWebpageAccess();
};