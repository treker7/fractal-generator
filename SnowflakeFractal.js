var DIMENSION = 520;
var CENTER = [(DIMENSION / 2), (DIMENSION / 2)];
var RADIUS = (DIMENSION / 2) - 20;
var COLOR = "#6699ff";

window.onload = function(){	
	var canvas = document.getElementById("canvas");
	canvas.width = DIMENSION;
	canvas.height = DIMENSION;
	
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = COLOR;
	
	var inputSeed = document.getElementById("seed");
	var inputDepth = document.getElementById("depth");
	var inputOrientation = document.getElementById("orientation");
	
	document.getElementById("draw").onclick = function(){
		var seed = parseInt(inputSeed.value);
		var depth = parseInt(inputDepth.value);		
		var orientation = ((Math.PI / 180) * parseInt(inputOrientation.value));
		
		console.log("Seed: " + seed + " Depth: " + depth + " Orientation: " + orientation);
		
		if(isNaN(seed) || (seed < 2)){
			seed = 2;
			inputSeed.value = "2";
		}else if(seed > 15){
			seed = 15;
			inputSeed.value = "15";
		}
		
		if(isNaN(depth) || (depth < 0)){
			depth = 0;
			inputDepth.value = "0";
		}else if(depth > 7){
			depth = 7;
			inputDepth.value = "7";
		}
		
		if(isNaN(orientation)){
			orientation = 0;
			inputOrientation = "0";
		}		
		drawFractal(ctx, seed, depth, orientation);
	};
	window.drawFractal(ctx, 3, 4, Math.PI / 6);	
};
var drawFractal = function(graphicsContext, seedNum, depth, orientation){	
	var points = [];
	var numSides = 0;
	
	//compute seed polygon
	var theta = orientation;
	for(var i = 0; i < seedNum; i++){
		points.push([Math.round(RADIUS * Math.cos(theta)) + CENTER[0], Math.round(RADIUS * Math.sin(theta)) + CENTER[1]]);
		numSides++;
		theta += ((2 / seedNum) * Math.PI);
	}
	
	var oldPoints;				
	var currDepth = 1;
	while(currDepth <= depth){
		oldPoints = copyPoints(points);
		points = [];
		numSides = 0;
		for(var i = 0; i < oldPoints.length; i++){
			var p1 = oldPoints[i];								
			var p2 = oldPoints[(i + 1) % oldPoints.length];
			var newPoints = []
			
			var delta = [(p2[0] - p1[0]), (p2[1] - p1[1])];
			newPoints.push([p1[0] + Math.round(delta[0] * (1 / 3)), p1[1] + Math.round(delta[1] * (1 / 3))]);
			newPoints.push([p1[0] + Math.round(delta[0] * (2 / 3)), p1[1] + Math.round(delta[1] * (2 / 3))]);								
			
			newPoints.push([(averagePoint([p1, p2])[0]) + Math.round(delta[1] * (Math.sqrt(3) / 6)), (averagePoint([p1, p2])[1]) - Math.round(delta[0] * (Math.sqrt(3) / 6))]);
			newPoints.push([(averagePoint([p1, p2])[0]) - Math.round(delta[1] * (Math.sqrt(3) / 6)), (averagePoint([p1, p2])[1]) + Math.round(delta[0] * (Math.sqrt(3) / 6))]);
							
			points.push(p1);
			points.push(newPoints[0]);
			points.push(newPoints[2]);
			points.push(newPoints[1]);
			points.push(newPoints[3]);
			numSides += 5;
		}
		currDepth++;
	}
	document.getElementById("sides").innerHTML = numSides.toString();
	fillPolygon(graphicsContext, points);	
};
var copyPoints = function(points){
	var retPoints = [];
	for(var i = 0; i < points.length; i++){
		retPoints.push([points[i][0], points[i][1]]);
	}
	return retPoints;
};
var averagePoint = function(points){
	var avePoint = [0, 0];
	for(var i = 0; i < points.length; i++){
		avePoint = [avePoint[0] + points[i][0], avePoint[1] + points[i][1]];		
	}
	avePoint = [Math.round(avePoint[0] / points.length), Math.round(avePoint[1] / points.length)];
	return avePoint;	
};
var fillPolygon = function(ctx, points){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	ctx.beginPath();	
	ctx.moveTo(points[0][0], points[0][1]);
	for(var i = 1; i < points.length; i++){
		ctx.lineTo(points[i][0], points[i][1]);		
	}
	
	ctx.closePath();
	ctx.fill();
};
