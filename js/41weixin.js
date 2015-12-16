var stage = new Konva.Stage({
	container: 'container',
	width: window.innerWidth,//È«ÆÁ
	height: window.innerHeight
});


var imgSource = [];
var loadImgs = ['1.png', 'a.jpg', 'b.jpg', 'bb.png', 'bg.jpg', 'lightr.png', 'bh.png','lbg.jpg', 'lightb.png', 'mw.png', 'nom.png', 'yesm.png', 'logo.gif', 'html5.png'];

//执行默认的开场动画1
(function() {
	builderSceneLoading().play();
})();

var scenesIndex = 0;
var scenesFn = [ builderSceneHistogram, builderScenePieChart, builderSceneTextRect  ];
// ======  =>S 监听 滑动，切换场景的事件处理=============
//监听  开始时间，记录当前鼠标的方向起点
function addSceneChangeEvent() {
	var stageStartY = 0;
	var stageEndY = 0; 

	stage.on('contentTouchmove contentMousemove',function(e) {
		if(e.type == 'contentMousemove') { //PC端鼠标事件
			stageEndY = e.evt.screenY
		} else {
			//移动端touch事件
			stageEndY = e.evt.touches[0].screenY;
		}
	});

	stage.on('contentTouchstart contentMousedown', function(e){
		if(e.type == 'contentMousedown') {
			stageStartY = e.evt.screenY
		} else {
			stageStartY = e.evt.touches[0].screenY;
		}
	});

	stage.on('contentTouchend contentMouseup',function(e){

		if(stageEndY > stageStartY ) { //下滑
			scenesIndex = scenesIndex - 1  >= 0 ? scenesIndex - 1 : 0;
		} else {  //上滑
			scenesIndex = scenesIndex + 1  >= scenesFn.length ? scenesIndex : scenesIndex + 1 ;
		}
		//根据上滑和下滑判断 是否切换到 哪个场景
		scenesFn[scenesIndex]().play();
		stageStartY = 0;
		stageEndY = 0;
	});
}
// ======  =>E 监听 滑动，切换场景的事件处理=============

function LoadingComplete() {
	//开始第一个场景
	scenesFn[0]().play();
	// 添加事件
	addSceneChangeEvent();
}

//=============S 加载场景=================
function builderSceneLoading() {
	//切换到下一个场景
	var animateLayer  = new Konva.Layer();
	var progressBar = new ProgressBar({
		x: stage.width() / 8,
		y: stage.height() / 2,
		width: stage.width() * 3/4,
		height: stage.height() / 20,
		fillColor: '#cdcd00',
		strokeColor: '#e0ffff', 
		strokeWidth: 6
	});

	return new ItcastScence({
		name: '场景1',
		stage: stage,
		init: function() {
			var _this = this;
			progressBar.addToLayerOrGroup( _this.layers[0] );
			this.layers.forEach(function( layer ) {
				layer.draw();
			});
		},
		pre: function() {	
			progressBar.group.to({
				opacity: 1,
				duration: .1
			});
			progressBar.pre();

			
			var temp = 0;
			loadImgs.forEach(function( val, i ){
				var img = new Image();
				img.src ='imgs/' + val;
				img.onload = function() {
					temp++;
					imgSource[loadImgs[i]] = img;
				};
			});

			var intervalId = setInterval(function(){
				var currentPrograss = Number(temp / loadImgs.length).toFixed(2);
				if(currentPrograss >= 1) {
					clearInterval(intervalId);
					//加载完成后，执行 后续的场景切换和事件处理
					LoadingComplete();					
				}
				progressBar.changeValue( currentPrograss );
			},200);
		},
		post: function( next ) {
			//离场动画
			var tween  = new Konva.Tween({
				node: progressBar.group,
				scaleX: 0,
				scaleY: 0,
				y: 0,
				x: stage.width() / 2,
				duration: .4,
				opacity: 0,
				easing: Konva.Easings.EaseIn,
				onFinish: function() {
					//移除加载场景
					animateLayer.remove();
				}
			});
			tween.play();
			next();
		},
		layers: [ animateLayer ]
	});
}
//=============E 加载场景=================

//=============S 柱状图场景===============
function builderSceneHistogram() {
	var animateLayer  = new Konva.Layer();
	var bgLayer = new Konva.Layer();
	var lightLayer = new Konva.Layer();
	var data = [{ 
				name: '阿里', value: .2, color: 'lightgreen'
			},{
				name: '百度', value: .4, color: 'red'
			},{
				name: '新浪', value: .1, color: 'blue'
			},{
				name: '盛大', value: .1, color: '#8E8E38'
			},{
				name: '360', value: .2, color: 'purple'
			}];

	var his = new Histogram({
		data: data,
		x: 1/8 * stage.width(),
		y: 3/4 * stage.height(),
		blWidth: 2,
		blColor: 'lightblue',
		width: 3/4 * stage.width(),
		height: 1/2 * stage.height(),
		fontSize: 14
	});

	var lightImg = new Konva.Image({
		width: stage.width(),
		height: stage.height(),
		image: imgSource['lightr.png'],
		opacity: .1
	});

	var triangleUp = new Konva.Shape({
		sceneFunc: function( ctx ) {
			ctx.beginPath();
			ctx.moveTo( 0, 0 );
			ctx.lineTo( stage.width(), 0 );
			ctx.lineTo( 0, 1/4 * stage.height() );
			ctx.closePath();
			ctx.fillStyle = 'green';
			ctx.fill();
		},
		x: 0,
		y: -1/4 * stage.height(),
		opacity: .1
	});

	var triangleDown = new Konva.Shape({
		sceneFunc: function( ctx ) {
			ctx.beginPath();
			ctx.moveTo( 0, stage.height() );
			ctx.lineTo( stage.width(), stage.height() );
			ctx.lineTo( stage.width(), 3/4 * stage.height() );
			ctx.closePath();
			ctx.fillStyle = '#E6E6FA';
			ctx.fill();
		},
		x: 0,
		y: 1/4 * stage.height(),
		opacity: .1
	});

	var bgImg = new Konva.Image({
		width: stage.width(),
		height: stage.height(),
		image: imgSource['lbg.jpg'],
		opacity: .9
	});
	return new ItcastScence({
		name: '场景2',
		stage: stage,
		layers: [ bgLayer, animateLayer, lightLayer  ],
		init: function() {
			var _this = this;

			his.addToGroupOrLayer( animateLayer );
			bgLayer.add( bgImg );
			bgLayer.add( triangleUp );

			bgLayer.add( triangleDown );

			lightLayer.add( lightImg );

			this.layers.forEach(function( layer ) {
				layer.draw();
			});
		},
		pre: function(data) {	
			his.group.to({
				duration: .001,
				opacity: 0
			});

			triangleDown.to({
				x: 0,
				y: 0,
				duration: .5,
				opacity: 1,
				// yoyo: true
			});

			triangleUp.to({
				x: 0,
				y: 0,
				duration: .5,
				opacity: 1,
				onFinish: function() {
					his.playAnimate();
				}
			});

			var tweenLight = new Konva.Tween({
				node: lightImg,
				opacity: .9,
				duration: 3,
				yoyo: true
				// onFinish: function() {
				// 	tweenLight.reverse();
				// }
			});
			tweenLight.play();
		},
		post: function( next ) {
			var _this = this;
			triangleUp.to({
				y: -stage.height(),
				duration: .6,
				opacity: .5,
				// rotation: 360
			});

			triangleDown.to({
				y: stage.height(),
				duration: .6,
				opacity: .5,
				// rotation: 360
			});

			var tween  = new Konva.Tween({
				node: his.group,
				opacity: 0,
				scaleX: 0.1,
				scaleY: 0.1,
				y: 0,
				x: stage.width() / 2,
				duration: .6,
				easing: Konva.Easings.EaseIn,
				onFinish: function() {
					_this.layers.forEach(function(layer) {
						layer.remove();
					});
					// animateLayer.remove();
					next();//执行下一场景
				}
			});
			tween.play();
		}		
	});
}
//=============E 柱状图场景===============


//=============S 饼状图场景=================
function builderScenePieChart() {
	var animateLayer  = new Konva.Layer();
	var bgLayer = new Konva.Layer();
	var lightLayer = new Konva.Layer();
	//创建加载层动画
	//饼状图数据
	var data = [{ 
					name: "前端",
					value: .25,
					color: '#e0e'
				},{
					name: "php",
					value: .2,
					color: 'orange'
				},{
					name: "UI",
					value: .3,
					color: 'blue'
				},{
					name: "C++",
					value: .05,
					color: 'green'
				},{
					name: "游戏",
					value: .1,
					color: 'purple'
				},{
					name: "Java",
					value: .1,
					color: 'red'
				}];

	//创建饼状图
	var maxSize  = stage.width() > stage.height() ? stage.height() : stage.width();
	var pieChart = new PieChart({
		data: data,//扇形区域的数据
		animateDuration: 2,//扇形动画的时间
		easing: Konva.Easings.EaseIn,//扇形动画的速度规格
		x: stage.width() / 2,
		y: stage.height() / 2,
		radius: .3 * maxSize,//半径
		txtAwayFromWedge: .3 * .3 * maxSize//扇形上的文字的距离圆形的距离
	});

	//创建光照
	var lightImg = new Konva.Image({
		width: stage.width(),
		height: stage.height(),
		image: imgSource['lightr.png'],
		opacity: .1
	});

	//上三角形
	var triangleUp = new Konva.Shape({
		sceneFunc: function( ctx ) {
			ctx.beginPath();
			ctx.moveTo( 0, 0 );
			ctx.lineTo( stage.width(), 0 );
			ctx.lineTo( 0, 1/4 * stage.height() );
			ctx.closePath();
			ctx.fillStyle = 'orange';
			ctx.fill();
		},
		x: 0,
		y: -1/4 * stage.height(),
		opacity: .1
	});

	//下三角
	var triangleDown = new Konva.Shape({
		sceneFunc: function( ctx ) {
			ctx.beginPath();
			ctx.moveTo( 0, stage.height() );
			ctx.lineTo( stage.width(), stage.height() );
			ctx.lineTo( stage.width(), 3/4 * stage.height() );
			ctx.closePath();
			ctx.fillStyle = '#FF8247';
			ctx.fill();
		},
		x: 0,
		y: 1/4 * stage.height(),
		opacity: .1
	});

	var bgImg = new Konva.Image({
		width: stage.width(),
		height: stage.height(),
		image: imgSource['bg.jpg'],
		opacity: .9
	});	

	return new ItcastScence({
		name: '饼状图场景',
		stage: stage,
		layers: [  bgLayer, animateLayer, lightLayer  ],
		init: function() {

			bgLayer.add( bgImg );
			bgLayer.add( triangleUp );

			bgLayer.add( triangleDown );

			lightLayer.add( lightImg );

			pieChart.addToLayer(animateLayer);

			this.layers.forEach(function( layer ) {
				layer.draw();
			});
		},
		pre: function() {	

			triangleDown.to({
				x: 0,
				y: 0,
				duration: .5,
				opacity: 1,
				// yoyo: true
			});

			triangleUp.to({
				x: 0,
				y: 0,
				duration: .5,
				opacity: 1,
				onFinish: function() {
				}
			});

			var tweenLight = new Konva.Tween({
				node: lightImg,
				opacity: .9,
				duration: 3,
				yoyo: true
				// onFinish: function() {
				// 	tweenLight.reverse();
				// }
			});
			tweenLight.play();

			pieChart.group.to({
				duration: .4,
				opacity: 1
			});
			pieChart.playAnimate();
		},
		post: function( next ) {
			var _this = this;
			triangleUp.to({
				y: -stage.height(),
				duration: .6,
				opacity: .5,
				// rotation: 360
			});

			triangleDown.to({
				y: stage.height(),
				duration: .6,
				opacity: .5,
				// rotation: 360
			});
			var tween  = new Konva.Tween({
				node: pieChart.group,
				opacity: 0,
				scaleX: 0.1,
				scaleY: 0.1,
				y: 0,
				x: stage.width() / 2,
				duration: .6,
				easing: Konva.Easings.EaseIn,
				onFinish: function() {
					// animateLayer.remove();
					_this.layers.forEach(function(layer) {
						layer.remove();
					});
					next();//执行下一场景
				}
			});
			tween.play();
		}
	});
}
//=============E 饼状图场景=================

//=============S 文字图片说明场景=================
function builderSceneTextRect() {
	var animateLayer  = new Konva.Layer();
	var bgLayer = new Konva.Layer();
	var lightLayer = new Konva.Layer();
	//创建加载层动画
	//饼状图数据
	var data = [];

	//创建光照
	var lightImg = new Konva.Image({
		width: stage.width(),
		height: stage.height(),
		image: imgSource['lightr.png'],
		opacity: .1
	});

	//创建背景
	var bgImg = new Konva.Image({
		width: stage.width(),
		height: stage.height(),
		image: imgSource['bg.jpg'],
		opacity: .9
	});	

	//创建文本
	var txtRect = new Konva.Text({
		x: 0,
		y: 0,
		text: '大前端时代已经到来!\n\n传智播客前端与移动开发学院\n\n谁与争锋',
		fontSize: (stage.width() < 500 ? 12 : 24),
		fontFamily: '微软雅黑',
		fill: '#fff',
		width: 1 / 3 * stage.width(),
		padding: 24,
		align: 'center',
		strokeWidth: 4,
		// stroke: '#ccc'
	});

	//创建文本矩形
	var textBoxRect = new Konva.Rect({
		x: 0,
		y: 0,
		height: 1/3 * stage.height(),
		width: 1/3 * stage.width(),
		stroke: 'gole',
		strokeWidth: 5,
		shadowColor: 'black',
        shadowBlur: 10,
        shadowOffset: [10, 10],
        shadowOpacity: 0.2,
        cornerRadius: 10
	});

	var txtGroup = new Konva.Group({
		x: 0,
		y: stage.height()
	});
	txtGroup.add( textBoxRect );
	txtGroup.add( txtRect );

	//创建html5 logo 组
	var imgGroup = new Konva.Group({
		x: 0,
		y: 0
	});

	//创建html5图片
	var imgHtml5 = new Konva.Image({
		image: imgSource['html5.png'],
		width: 1 / 8 * stage.width(),
		height: 1 / 8 * stage.width(),
		x: 0,
		y: -(1 / 5 * stage.width()),
		opacity: .9
	});
	imgGroup.add( imgHtml5 );
	
	var imgLogo = new Konva.Image({
		image: imgSource['logo.gif'],
		width: 1/2 * stage.width(),
		x: 5/4 * stage.width(),
		y: 2 / 5 * stage.width(),
	});
	imgGroup.add( imgLogo );

	//返回一个场景对象
	return new ItcastScence({
		name: '文字场景',
		stage: stage,
		layers: [  bgLayer, animateLayer, lightLayer  ],
		init: function() {
			bgLayer.add( bgImg );
			animateLayer.add( txtGroup );
			animateLayer.add( imgGroup );
			lightLayer.add( lightImg );
			this.layers.forEach(function( layer ) {
				layer.draw();
			});
		},
		pre: function() {	
			var tween  = new Konva.Tween({
				node: txtGroup,
				opacity: .9,
				x: 1/5 * stage.width(),
				y: 1/2 * stage.height(),
				duration: 1,
				scaleX: 1.3,
				scaleY: 1.3,
				opacity: .5,
				easing: Konva.Easings.EaseIn,
				onFinish: function() {
				}
			});
			tween.play();

			lightImg.to({
				yoyo: true,
				opacity: .6,
				duration: 1
			});

			imgLogo.to({
				x: 1/4 * stage.width(),
				scaleX: 1.2,
				scaleY: 1.2,
				opacity: .9,
				duration: .8,
				easing: Konva.Easings.EaseOut
			});
			imgHtml5.to({
				y: (1 / 8 * stage.width()),
				scaleX: 1.2,
				scaleY: 1.2,
				opacity: .9,
				duration: .8,
				easing: Konva.Easings.EaseOut,
				yoyo: true
			});
		},
		post: function( next ) {
			var _this = this;
			imgLogo.to({
				x: 5/4 * stage.width(),
				scaleX: .5,
				scaleY: .5,
				opacity: .4,
				duration: .6,
				easing: Konva.Easings.EaseOut
			});
			imgHtml5.to({
				y: -(1 / 8 * stage.width()),
				scaleX: .5,
				scaleY: .5,
				opacity: .5,
				duration: .6,
				easing: Konva.Easings.EaseOut
				// yoyo: true
			});

			var tween  = new Konva.Tween({
				node: txtGroup,
				opacity: 0,
				scaleX: 0.1,
				scaleY: 0.1,
				y: 0,
				x: stage.width() / 2,
				duration: .6,
				easing: Konva.Easings.EaseIn,
				onFinish: function() {
					// animateLayer.remove();
					_this.layers.forEach(function(layer) {
						layer.remove();
					});
					next();//执行下一场景
				}
			});
			tween.play();
		}
	});
}
//=============E 饼状图场景=================

















// var s1 = (function(){
	
// })();

//场景2
// var s2 = (function() {
	
// })();



// var s3 = new ItcastScence({

// });
// var s4 = new ItcastScence({

// });

// scenes[0] = s1;
// scenes[1] = s2;
// scenes[2] = s3;
// scenes[3] = s4;

// s1.play();
