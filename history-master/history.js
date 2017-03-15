$(function(){
	$.extend({
		history:{
			startTime: null,
			endTime: null,
		}
	})

	setupGraphDimension();
	setupDatepicker();

	var oneWeekAgo = new Date();
	oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

	var oneDayAgo = new Date();
	oneDayAgo.setDate(oneDayAgo.getDate() -1);
	var today = new Date();

	$.history.startTime = oneDayAgo.getTime();
	$.history.endTime = today.getTime();


	search();

 	$("#showGraph").click(function(e){
 		search();
 	})
 	function search(){
 		var startTime = $.history.startTime;
 		var endTime = $.history.endTime;
 		chrome.history.search({text:"", startTime:startTime, endTime:endTime, maxResults:1000}, function(results){
	 		var convertedData = convertData(results);
	 		var flotData = convertedData.data;
	 		var ticks = convertedData.ticks;

	 		var options = {
	 			series:{
	 				bars:{
	 					show: true,
	 					barWidth: .2,
	 					horizontal: true
	 				}
	 			},
	 			xaxis:{
					show:true
				},
				yaxis:{
					ticks:ticks
				}
	 		};

	 		var plot = $.plot("#graphDiv", [flotData], options );
	 		editCanvas(plot);
	 	});
 	}

 	function editCanvas(plot){
 		var data = plot.getData()[0].data;

 		var canvas = plot.getCanvas();
 		var ctx = canvas.getContext('2d');

 		for(var i=0; i<data.length; i++){
 			var x = data[i][0];
 			var y = data[i][1];

 			var offset = plot.pointOffset({x:x, y:y});
	 		var left = offset.left;
	 		var top = offset.top;

 			if(ctx.measureText){
				var metric = ctx.measureText(x);
				ctx.fillStyle = "black";
				ctx.font = 'bold 12px Arial,Helvetica,sans-serif';
				if(metric.width + left > canvas.width){
					left -= metric.width;
				}
				ctx.fillText(x, left, top);
			}
 		}
 	}
 	function convertData(results){
 		var helper = groupDataByHostname(results);
 		var barChartData = transformToBarChartData(helper);
 		console.log(helper);
 		return barChartData;
 	}
 	function groupDataByHostname(results){
 		var keys = Object.keys(results);
 		var helper = {};

 		for(var i=0; i<keys.length; i++){
 			var key = keys[i];
 			var entry = results[key];

 			var url = entry['url'];
 			var parsedUrl = parseUrl(url);
 			var host = parsedUrl.hostname;
 			var path = parsedUrl.path;

 			if(!helper[host]){
 				helper[host] = {};
 				helper[host].visitCount = entry.visitCount;
 				helper[host].path = [path];
 			}
 			else{
 				helper[host].visitCount += entry.visitCount;
 				helper[host].path.push(path);
 			}
 		}
 		return helper;
 	}

 	function transformToBarChartData(helper){
 		var ticks = [];
 		var a = [];
 		var data = [];
 		for(var i=0; i<Object.keys(helper).length; i++){
 			var key = Object.keys(helper)[i];
 			a.push([key, helper[key].visitCount]);
 		}

 		a.sort(function(a,b){return a[1] - b[1];});

 		for(var i=0; i<a.length; i++){
 			var el = a[i];
 			ticks.push([i, el[0]]);
 			data.push([el[1], i]);
 		}

 		return {data: data, ticks: ticks, type:'bar', label: "Sites Visited"};
 	}

 	function parseUrl(string){
 		var a = document.createElement("a");
 		a.href = string;
 		console.log(a.pathname)
 		return {hostname: a.hostname, path: a.pathname}
 	}

 	function setupDatepicker(){
		//Setup date picker
		$("#from").datepicker({
			defaultDate: "+1w",
			changeMonth: true,
			numberOfMonths:1,
			onClose: function(selectedDate){
				$.history.startTime = new Date(selectedDate).getTime();
				$("#to").datepicker("option", "minDate", selectedDate);
			}
		});
		$("#to").datepicker({
			defaultDate:"+1w",
			changeMonth:true,
			numberOfMonths: 1,
			onClose: function(selectedDate){
				$.history.endTime = new Date(selectedDate).getTime();
				$("#from").datepicker("option", "maxDate", selectedDate);
			}
		});
	}

	function setupGraphDimension(){
	 	$("#graphDiv").height("1000px");
	 	$("#graphDiv").width($(window).width()*0.5);
	}
  });