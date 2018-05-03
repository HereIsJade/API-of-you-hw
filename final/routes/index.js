var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var PollyFile = require("../amazon-polly-file.js");

// our db model
var Wish = require("../models/model.js");



router.get('/', function(req, res) {
    res.render('index.html')
});

router.get('/hello', function(req,res){
	res.render('helloWorld.html');
})


router.get('/wish/get',function(req,res){
	Wish.find(function(err, data){

		if(err || data == null){
			var error = {status:'ERROR', message: 'Could not find wishes'};
			return res.json(error);
		}

		// otherwise, respond with the data

		res.send(data);

	})
})


// /**
//  * POST '/api/create'
//  * Receives a POST request of the new wish, saves to db, responds back
//  * @param  {Object} req. An object containing the different attributes of the Wish
//  * @return {Object} JSON
//  */
router.post('/wish/create',function (req,res){

	// pull out the information from the req.body
	var wishText = req.body.wishText;
	var rate = req.body.rate;
	var voice = req.body.voice;

	// hold all this data in an object
	// this object should be structured the same way as your db model
	var wishObj = {
		wishText: wishText,
		rate: rate,
		voice: voice
	};

	// TODO: when writing to db, check if wishText already exists
	// create a new wish model instance, passing in the object
	var wish = new Wish(wishObj);

	// mongoose method, see http://mongoosejs.com/docs/api.html#model_Model-save
	wish.save(function(err,data){
		// if err saving, respond back with error
		if (err){
			var error = {status:'ERROR', message: 'Error saving animal'};
			return res.json(error);
		}

		console.log('saved a new wish!');
		console.log(data);

		// now return the json data of the new animal
		var jsonData = {
			status: 'OK',
			wish: data
		}

		//use AWS polly for generating audio files
		var pollyFile=new PollyFile(data);
		pollyFile.generateParams();
		pollyFile.generateFile();

		return res.send(jsonData);

	})
});


module.exports = router;
