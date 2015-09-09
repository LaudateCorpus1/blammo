chrome.devtools.panels.create('Logger', '../imgages/panel_icon.png', "../html/panel.html", function(extensionPanel) {
    var _window; // Going to hold the reference to panel.html's `window`

    var data = [];
    var port = chrome.runtime.connect({name: 'devtools'});
    port.onMessage.addListener(function(msg) {
        // Write information to the panel, if exists.
        // If we don't have a panel reference (yet), queue the data.
        if (_window) {
        	if(msg.type === "getDetailsResponse")
        		_window.updateView(msg);
        	else
        		_window.updateTable(msg);
        } else {
            data.push(msg);
        }
    });

    extensionPanel.onShown.addListener(function tmp(panelWindow) {
        extensionPanel.onShown.removeListener(tmp); // Run once only
        _window = panelWindow;

        // Release queued data
        var msg;
        
        while (msg = data.shift()) 
            _window.updateTable(msg);
        // Just to show that it's easy to talk to pass a message back:
        _window.respond = function(msg) {
            port.postMessage(msg);
        };
    });
});