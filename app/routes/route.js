var express=require('express');
var router=express.Router();
var path=require('path');

router.get('/about',function(req,res){
	// res.sendFile(__dirname+'/public/about.html');
	// res.send("hello about");
	res.sendFile(path.resolve(__dirname, '../../public/about.html'));
})
router.get('/hello', function(req, res) {
	res.send('hello !');
});
module.exports=router;