var Sandbox = {
    eval: function (code) {
        // make a new iframe every time evaluate
        var iframe = document.createElement("iframe");
        iframe.style.width="0px";
        iframe.style.height="0px"
        iframe.style.visibility="hidden";
        document.body.appendChild(iframe);            
        var iframeWindow = iframe.contentWindow;
        var iframeDocument = iframeWindow.document;
                    
        var result;
        
        // TODO: initialize API
        
        iframeDocument.open();
        try {        
            if(iframeWindow.eval)
                result = iframeWindow.eval(code);
            else if(!iframeWindow.eval && iframeWindow.execScript)
                result = iframeWindow.execScript(code);
            else
                alert("Sandbox: Unsupport browser");
        } catch (ex) {
            result = ex.message;
        }
        
        iframeDocument.close();
                
        // remove iframe from body
        document.body.removeChild(iframe);
        
        return result;
    }  
}                 






