'use strict';

(function(){
	var socket=io();
	var canvas=document.querySelector('.whiteboard');
	var colors=document.getElementsByClassName('color');
	var colorDiv=document.querySelector('.colors');
	//getContext("2d") 对象是内建的 HTML5 对象，拥有多种绘制路径、矩形、圆形、字符以及添加图像的方法。
	var context=canvas.getContext("2d");

	var current={
		color:"black"
	};
	var drawing=false;

	canvas.addEventListener('mousedown',onMouseDown,false);
	canvas.addEventListener('mouseup',onMouseUp,false);
	canvas.addEventListener('mouseout',onMouseOut,false);
	//这里运用了闭包，返回一个函数，调用onMouseMove并且把参数event再通过apply方法传递给onMouseMove
	//这个函数主要就是为了控制画图的事件，利用闭包，将当前时间变为一个私有变量
	canvas.addEventListener('mousemove',throttle(onMouseMove,10),false);

	colorDiv.addEventListener('click',function(e){
		var target=e.target;
		if(target.classList.contains("color")){
			onColorUpdate(target);
		}
	},false);

	socket.on('drawing', onDrawingEvent);

	window.addEventListener('resize', onResize, false);
  	onResize();

  	// function drawLine(x0,y0,x1,y1,color,emit){
  	// 	context.beginPath();
  	// 	context.moveTo(x0,y0);
  	// 	context.lineTo(x1,y1);
  	// 	context.strokeStyle=color;
  	// 	context.lineWidth=2;
  	// 	context.stroke();
  	// 	context.closePath();
  	// 	if(!emit)return;

  	// 	var w=canvas.width;
  	// 	var h=canvas.height;
  	// 	// 这里需要考虑浏览器大小的问题
  	// 	socket.emit('drawing',{
  	// 		x0:x0/w,
  	// 		y0: y0 / h,
		 //    x1: x1 / w,
		 //    y1: y1 / h,
		 //    color: color
  	// 	});
  	// }
  	function drawLine(x0, y0, x1, y1, color, emit){
	    context.beginPath();
	    context.moveTo(x0, y0);
	    context.lineTo(x1, y1);
	    context.strokeStyle = color;
	    context.lineWidth = 2;
	    context.stroke();
	    context.closePath();

	    if (!emit) { return; }
	    var w = canvas.width;
	    var h = canvas.height;

	    socket.emit('drawing', {
	      x0: x0 / w,
	      y0: y0 / h,
	      x1: x1 / w,
	      y1: y1 / h,
	      color: color
	    });
	}

  	function onMouseDown(e){
  		drawing=true;
  		current.x=e.clientX;
  		current.y = e.clientY;
  	}

  	function onMouseUp(e){
  		if(!drawing)return;
  		drawing=false;
  		drawLine(current.x, current.y, e.clientX,e.clientY, current.color, true)
  	}

  	function onMouseOut(e){
  		if(!drawing)return;
  		drawing=false;
  		drawLine(current.x, current.y, e.clientX,e.clientY, current.color, true)
  	}

  	function onMouseMove(e){
  		if (!drawing) { return; }
	    drawLine(current.x, current.y, e.clientX, e.clientY, current.color, true);
	    current.x = e.clientX;
	    current.y = e.clientY;
  	}

  	function throttle(callback,delay){
  		var callTime=new Date().getTime();
  		return function(){
  			var time=new Date().getTime();
  			if((time-callTime)>=delay){
  				callTime=time;
  				callback.apply(null,arguments);
  			}
  		}
  	}
  	// limit the number of events per second
	// function throttle(callback, delay) {
	//     var previousCall = new Date().getTime();
	//     return function() {
	//       var time = new Date().getTime();

	//       if ((time - previousCall) >= delay) {
	//         previousCall = time;
	//         callback.apply(null, arguments);
	//       }
	//     };
	// }


  	function onColorUpdate(target){
	    current.color = target.className.split(' ')[1];
	}

  	function onDrawingEvent(data){
  		var w=canvas.width;
  		var h=canvas.height;
  		drawLine(data.x0*w,data.y0*h,data.x1 * w, data.y1 * h, data.color);
  	}



  	function onResize(){
  		canvas.width=window.innerWidth;
  		canvas.height=window.innerHeight;
  	}

})();