var stage = new Konva.Stage({
	container: 'container',
	width: window.innerWidth,
	height: window.innerHeight
});

var layer = new Konva.Layer();
stage.add(layer);

var progressValueRect = new Konva.Rect({
	x: stage.getWidth() / 8,
	y: stage.getHeight() / 2,
	height: 40,
	width: stage.getWidth() / 8 * 3,
	fill: 'lightblue',
	cornerRadius: 5,
	lineCap: 'round'
});
layer.add(progressValueRect);


var progressLine = new Konva.Rect({
	strokeWidth: 5,
	x: stage.getWidth() / 8,
	y: stage.getHeight() / 2,
	height: 40,
	width: stage.getWidth() / 8 * 6,
	stroke: '#d0d0d0',
	cornerRadius: 5,
	shadowBlur: 4,
	shadowColor: '#f0f0f0',
	shadowOffset: {x : 0, y : 0},
    shadowOpacity: 0.5
});
layer.add(progressLine);



layer.draw();



var rect = new Konva.Rect({
	x: 100,
	y: 100,
	height: 30,
	width: 30,
	fill: 'teal',
	rotation: 30,
	stroke: 'red',
	strokeWidth: 4,
	scale: {
		x: 1,
		y: 1
	}
});

var wjx = new Konva.Star({
	x: 100,
	y: 100,
	numPoints: 5,
	lineJoin: 'round',
	outerRadius: 50,
	innerRadius: 30,
	fill: 'teal'
});

var text = new Konva.Text({
	text: '传智播客',
	fontSize: 40,
	fontFamily: '微软雅黑',
	x: 100,
	y: 400,
	fill: 'blue',
	opacity: .8,
	shadowColor: '#ccc',
	shadowBlur: 4,
	shadowOpacity: .7,
	shadowOffset: {
		x: 5,
		y: 5
	}
});

// 
layer.draw();

setInterval(function(){
	if(progressValueRect.width() < progressLine.width() ) {
		progressValueRect.width(progressValueRect.width() + 1);
		layer.batchDraw();
	}
},20);

var animate = new Konva.Animation(function(frame){
	var time = frame.time,		//动画执行的时间
        timeDiff = frame.timeDiff,	//上次动画执行到现在的时间
        frameRate = frame.frameRate;	//每秒中执行的帧数
 //    rect.setX(rect.x()+50/frameRate);
 //    if(rect.x() > stage.width()){
 //    	this.stop();
 //    }

    // rect.rotation((rect.rotation() + 2 ) % 360);
    // wjx.rotation((wjx.rotation() + 2 ) % 360);
    // text.scaleX(text.scaleX() +  1 / frameRate );
    // text.scaleY(text.scaleY() +  1 / frameRate);
    // text.opacity(text.opacity() - .3 / frameRate);
    // if(text.opacity() <= 0){
    // 	this.stop();
    	
    // 	text.opacity(0);
    // }

}, layer);



animate.start();