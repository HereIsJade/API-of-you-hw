/*data={
    __v: 0,
	wishText: 'I WANT LOTS OF BITCOINS ',
	rate: 2,
	voice: 'en-US',
	_id: 5ae2117c588664fcb7ef9432,
	dateAdded: 2018-04-26T17:50:52.340Z
	}
	*/

function PollyFile(dbWishData){

	this.id=dbWishData._id;
	this.params={};

	const AWS = require('aws-sdk');
	require('./amazon-polly-file.js');
	const Fs = require('fs')
	// Load AWS credentials
	AWS.config.loadFromPath('./awscreds.json');

	// Create a new AWS Polly object
	const polly = new AWS.Polly();


	// node.js built-in method: opening a read stream to an existing file
	//TODO: CHANGE DEFAULT AUDIO FILE
	var rstream = Fs.createReadStream('./public/sounds/default.mp3');

	//TODO: CHECK VOICE PARAMS
	var voiceEnUS=['Joanna','Salli','Kimberly','Kendra','Ivy','Justin','Joey'];
	var voiceEsES=['Conchita','Enrique'];
	var voiceEsUS=['Penélope','Miguel'];
	var voiceFr=['Céline','Mathieu','Chantal'];
	var voiceItIT=['Carla','Giorgio'];

	var voiceId='';



	if(dbWishData.voice=='en-US'){
		voiceId=voiceEnUS[parseInt(Math.random()*7)];
	}
	else if(dbWishData.voice=='es-ES'){
		voiceId=voiceEsES[parseInt(Math.random()*2)];
	}
	else if(dbWishData.voice=='es-US'){
		voiceId=voiceEsUS[parseInt(Math.random()*2)];
	}
	else if(dbWishData.voice=='ja-JP'){
		voiceId='Mizuki';
	}
	else if(dbWishData.voice=='it-IT'){
		console.log('it');
		voiceId=voiceItIT[parseInt(Math.random()*2)];
	}
	else if(dbWishData.voice=='fr-CA'||'fr-FR'){
		voiceId=voiceFr[parseInt(Math.random()*3)];
	}

	else{
		voiceId='Joey';
	}

	//AWS polly ssml: to save audio file based on text, rate and voice, also added whisper effect
	this.generateParams=function(){

		//<prosody rate=""></prosody> x-slow, slow, medium, fast, x-fast or use float numbers
		//data.rate (Number) range 0.2 - 3

		var rateStr=""

		if(dbWishData.rate>=0.2 && dbWishData.rate<0.5){
			rateStr="x-slow";
		}
		else if(dbWishData.rate>=0.5 && dbWishData.rate<0.8){
			rateStr="slow";
		}
		else if(dbWishData.rate>=0.8 && dbWishData.rate<1.5){
			rateStr="medium";
		}
		else if(dbWishData.rate>=1.3 && dbWishData.rate<2){
			rateStr="fast";
		}
		else{
			rateStr="x-fast";
		}

		this.params={
			'Text':`<speak><prosody rate="${rateStr}"><amazon:effect name="whispered">${dbWishData.wishText}</amazon:effect></prosody></speak>`,
			'OutputFormat': 'mp3',
			'TextType':'ssml',
			'VoiceId':voiceId
		}
	}

	this.generateFile=function(){

		polly.synthesizeSpeech(this.params, (err, data) => {
			// console.log("params",this.params);
			if (err) {
				console.log("err in synthesizeSpeech");
				console.log(err.code);
			} else if (data) {
				if (data.AudioStream instanceof Buffer) {
					Fs.writeFile("./public/sounds/"+this.id+".mp3", data.AudioStream, function(err) {
						if (err) {
							console.log(err);
							// node.js built-in method: opening a write stream for storing data in a file
							var wstream = Fs.createWriteStream("./public/sounds/"+this.id+".mp3");
							rstream.pipe(wstream);

							console.log("Saved the file using default audio");
						}
						console.log("The file was saved")
					})
				}
			}
		})
	}
}
module.exports=PollyFile;