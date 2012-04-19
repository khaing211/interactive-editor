var Sandbox = {
    eval: function (code) {
        // make a new iframe every time evaluate
        var iframe = document.createElement("iframe");
        // iframe.style.width ="0px";
        // iframe.style.height = "0px";
        // iframe.style.visibility = "hidden";        
        iframe.src = "index.html";
        document.body.appendChild(iframe);
        
        // Cross-platform: http://xkr.us/articles/dom/iframe-document/
        var iframeWindow = iframe.contentWindow;
        var iframeDocument = iframe.contentWindow || iframe.contentDocument;
        if (iframeDocument.document) {
            iframeDocument = iframeDocument.document;
        }                    
                        
        // getting result
        var result;
        iframeDocument.open();
        try {        
            if(iframeWindow.eval)
                result = iframeWindow.eval(code);
            else if(!iframeWindow.eval && iframeWindow.execScript)
                result = iframeWindow.execScript(code);
            else
                result = "Sandbox: Unsupport browser";
        } catch (ex) {
            result = ex.message;
        }
        
        iframeDocument.close();
                
        // remove iframe from body
        //document.body.removeChild(iframe);
        
        return result;
    }  
}






