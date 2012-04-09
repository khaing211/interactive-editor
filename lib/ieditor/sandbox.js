var Sandbox = function() {
    var iframe = document.createElement("iframe");
    iframe.style.width="0px";
    iframe.style.height="0px"
    iframe.style.visibility="hidden";
    document.body.appendChild(iframe);            
    var iframeWindow = iframe.contentWindow;
    var iframeDocument = iframeWindow.document;
    var eval = function (code) {        
        var result;
        iframeDocument.open();        
        if(iframeWindow.eval)
            result = iframeWindow.eval(code);
        else if(!iframeWindow.eval && iframeWindow.execScript)
            result = iframeWindow.execScript(code);
        else
            alert("Sandbox: Unsupport browser");
        iframeDocument.close();
        return result;
    }
        
    return {eval:eval}     
}                 






