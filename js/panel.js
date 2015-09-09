function updateTable(msg){
	var transactionIdtable = $('#transactionIdtable').DataTable();
	transactionIdtable.row.add( [
	            msg.transactionId, msg.url
	            ] ).draw();
}

function updateView(msg) {
  try{
    logDetailMsgDiv = document.getElementById("logDetailsMsgDiv");
    detailsTableDiv = document.getElementById("detailsTableDiv");
    if(msg.details != "undefined" && msg.details != "" && msg.details != undefined && msg.details.match(/[a-zA-Z]/gi) != null) {
      var transactionDetailsTable = $('#transactionDetailsTable').DataTable();
      var findDate = /[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]/g;
                  var previousIndex = 0;
      str = msg.details;
      while (m = findDate.exec(str)) {
        if (m.index != 0) {
          transactionDetailsTable.row.add([str.substring(previousIndex, m.index)]).draw();
        }
        previousIndex = m.index;
      }
      transactionDetailsTable.row.add([str.substring(previousIndex)]).draw();
      logDetailMsgDiv.style.display = "none";
      detailsTableDiv.style.display = "block";
    } else {
      logDetailMsgDiv.innerHTML = "";
      logDetailMsgDiv.innerHTML = "There was problem in receiving response from logentries server. Please try Again!"
      logDetailMsgDiv.style.display = "block";
      detailsTableDiv.style.display = "none";
    }
  }  catch(err){
      alert(err)
  }
}

function getDataFromLogentries(event) {
	$("#transactionIdtable tbody tr").removeClass('selected');  
	$(this).addClass('selected');
	right = document.getElementById("logDetailsMsgDiv");
	detailsTableDiv = document.getElementById("detailsTableDiv");
	right.style.display = "block";
	detailsTableDiv.style.display = "none";
	right.innerHTML = "";
	right.align = "center";
	right.innerHTML = '<div style="background: url(../images/loader.gif) center center no-repeat; width: 100px; height: 100px;" align="center"  ></div>';
	var table = $('#transactionDetailsTable').DataTable();
	table.clear().draw();
	setTimeout(respond({type: "getDetails", transaction_id: event.path[1].id, url: event.path[1].url}), 5000); 
}

$(document).ready(function() {
	$('#transactionIdtable').DataTable({
		"paging":   false,
		"ordering": false,
		"info":     false,
		"createdRow" : function( row, data, index ) {
			// Add identity if it specified
			row.id = data[0];
                        row.url = data[1];
			row.onclick=getDataFromLogentries;
		},
		"columnDefs": [
		               {
		            	   "targets": [0],
		            	   "visible": false,
		               }
		              ]
	});
	$('#transactionDetailsTable').DataTable({
		"paging":   false,
		"ordering": false,
		"info":     false
	});
});
