var express=require("express");
var app=express();
var http=require('http');
var server=http.createServer(app);
var io=require('socket.io')(server);

var router=require('./app/routes/route.js')

var hostname='127.0.0.1';
var port=process.env.PORT||3000;


app.use(express.static(__dirname+'/public'));
app.use('/',router);

server.listen(port,hostname,function(){
  console.log(`Server is running at http://${hostname}:${port}/`);
});

io.on("connect",function(socket){
	socket.on("drawing",data=>socket.broadcast.emit('drawing',data));
});