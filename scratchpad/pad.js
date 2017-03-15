chrome.contextMenus.create({
	"title": "Delete Element",
	"contexts": ["all"],
	"id": "del",
	"onclick": function(){
		console.log("foo");
	}
});


chrome.contextMenus.create({
	"title": "Organize Tabs",
	"contexts": ["all"],
	"id": "parent"
});
var id = chrome.contextMenus.create({
	"title": "Move far left",
	"contexts": ["all"],
	"parentId": "parent",
	"onclick": function(){
		chrome.tabs.query({active:true}, function(a){
			var b = a[0];
			chrome.tabs.move(b.id, {index:0});
		});
	}
});
var __ = chrome.contextMenus.create({
	"title": "Move far right",
	"contexts": ["all"],
	"parentId": "parent",
	"onclick": function(){
		chrome.tabs.query({active:true}, function(a){
			var current = a[0];
			chrome.tabs.query({currentWindow:true}, function(b){
				chrome.tabs.move(current.id, {index: b.length-1} )
			})
		});
	}
});
var id2 = chrome.contextMenus.create({
	"title": "New Window",
	"contexts": ["all"],
	"parentId": "parent",
	"onclick": function(){
		chrome.tabs.query({active:true}, function(a){
			var b = a[0];
			chrome.windows.create({tabId: b.id});
		});
	}
});
var id3 = chrome.contextMenus.create({
	title:"Combine All",
	contexts: ["all"],
	parentId: "parent",
	"onclick": function(){
		
	}
});

function sendRequest(method, params, body){
	var hostname = "http://localhost:8081";
	var path = "/bookmark"
	// var params = {};
	console.log(JSON.stringify(params));
	$.ajax({
		url:hostname+path,
		method: method,
		data: JSON.stringify(params),
		contentType: "text/plain; charset=utf-8",
		headers:{
			'Access-Control-Allow-Origin': '*'
		},
		complete: function(xhr, status){
			console.log("Completed: " + status);
			console.log(xhr);
		},
		success: function(data, status, xhr){
			console.log("Success: " + data + status);
			console.log(xhr);
		},
		error: function(xhr, status, e){
			console.log("Error: " + status + e);
			console.log(xhr);
		}
	})

}
chrome.contextMenus.create({
	"title": "Bookmark Page",
	"contexts": ["all"],
	"parentId": "parent",
	"onclick":function(){
		chrome.tabs.query({active: true}, function(a){
			console.log(a);
			var title = a[0].title;
			var url = a[0].url;

			sendRequest('POST', {title: title, url: url}, "body");
		});
	}
});