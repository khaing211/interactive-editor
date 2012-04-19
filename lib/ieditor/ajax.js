function syncAjax(src) {

    if(window.XMLHttpRequest) {
        var ajax = new XMLHttpRequest();
    } else {
        var ajax = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if(ajax) {
        ajax.open("GET", src, false);
        ajax.send(null);
        return ajax.responseText;
    } else {
        return false;
    }      
}
