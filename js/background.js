var ports = [];
var domainToLogs = {
  // "server":["/path/to/log/", ... ]
  // "example.com":["/myservice/logs/", "myservice2/logs"]
};
chrome.runtime.onConnect.addListener(function(port) {
    if (port.name !== "devtools") return;
    ports.push(port);
    // Remove port when destroyed (eg when devtools instance is closed)
    port.onDisconnect.addListener(function() {
        var i = ports.indexOf(port);
        if (i !== -1) ports.splice(i, 1);
    });
    port.onMessage.addListener(function(msg) {
        // Received message from devtools. Do something:
        if(msg.type === "getDetails") {
            getLogDetails(msg);
        }
    });
});
//Function to send a message to all devtools.html views:
var response_json = {};
function notifyDevtools(msg) {
    ports.forEach(function(port) {
        port.postMessage(msg);
        response_json = {};
    });
}

function getLogDetails(msg) {
    response_json["transaction_id"] = msg.transaction_id;
    var url = msg.url;
    var domainMatch = url.match(/^https?\:\/\/([^\/:?#]+)(?:[\/:?#]|$)/i);
    var domain = domainMatch && domainMatch[1];
    if(! (domain in domainToLogs) ){
      return;
    }
    var logs = domainToLogs[domain];

    var deferredArr = $.map(logs, function(log, i) {
      // Your logentries account key
      var accountKey = "";
      var url = "https://pull.logentries.com/"+accountKey+"/hosts"+log+"?filter=" + msg.transaction_id;
      console.log("Fetching " + url);
      return $.ajax({
            url : url,
            type : 'GET',
            crossDomain: true,
            error : function(){
                response_json["type"] = "getDetailsResponse";
                response_json["details"] = "";
                notifyDevtools(response_json);
                alert('There was problem in receiving response from logentries server. Please try Again!');
                }
            });
    });
    $.when.apply(this, deferredArr).then(function (){
        response_json["type"] = "getDetailsResponse";
        response_json["details"] = "";
        $.each(arguments, function (i, data) {
            response_json["details"] = response_json["details"] + data[0];
        });
        notifyDevtools(response_json);
    });

}

var transaction_id_json = {};
chrome.webRequest.onCompleted.addListener(
    function(response){
        for(var i=0;i< response.responseHeaders.length; i++) {
            if (response.responseHeaders[i].name === "X-Transaction-Id") {
                transaction_id_json = {};
                transaction_id_json['url'] = response.url;
                transaction_id_json['transactionId'] = response.responseHeaders[i].value;
                notifyDevtools(transaction_id_json);
            }
        }
    },{urls:[ /* "http://example.com/*" */ ]}, ["responseHeaders"]);
