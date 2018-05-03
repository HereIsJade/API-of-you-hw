var count;

var synth = window.speechSynthesis;

var inputForm = document.querySelector('form');
var inputTxt = document.querySelector('.txt');
var voiceSelect = document.querySelector('select');

var rate = document.querySelector('#rate');
var rateValue = document.querySelector('.rate-value');

var voices = [];
var numRepeat=30;
var text='';
var utterThis;
var gif;

var trulyEnd=true;

function populateVoiceList() {
	voices = synth.getVoices();
	var selectedIndex = voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
	voiceSelect.innerHTML = '';
	for(i = 0; i < voices.length ; i++) {
		var option = document.createElement('option');
		option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

		if(voices[i].default) {
			option.textContent += ' -- DEFAULT';
		}
		option.setAttribute('data-lang', voices[i].lang);
		option.setAttribute('data-name', voices[i].name);
		voiceSelect.appendChild(option);
	}
	voiceSelect.selectedIndex = selectedIndex;
}

//TODO: rate range: 0.2 - 3
function chooseGif(rateVal){
	if(rateVal>=0.2 && rateVal<0.4){
		document.getElementById('gifs').src="img/animated180.gif";
	}
	else if(rateVal>=0.4 && rateVal<0.6){
		document.getElementById('gifs').src="img/animated80.gif";
	}
	else if(rateVal>=0.6 && rateVal<0.9){
		document.getElementById('gifs').src="img/animated65.gif";
	}
	else if(rateVal>=0.9 && rateVal<1.1){
		document.getElementById('gifs').src="img/animated50.gif";
	}
	else if(rateVal>=1.1 && rateVal<1.3){
		document.getElementById('gifs').src="img/animated40.gif";
	}
	else if(rateVal>=1.3 && rateVal<1.5){
		document.getElementById('gifs').src="img/animated30.gif";
	}
	else if(rateVal>=1.5 && rateVal<1.7){
		document.getElementById('gifs').src="img/animated20.gif";
	}
	else if(rateVal>=1.7 && rateVal<2){
		document.getElementById('gifs').src="img/animated10.gif";
	}
	else if(rateVal>=2 && rateVal<2.2){
		document.getElementById('gifs').src="img/animated9.gif";
	}
	else if(rateVal>=2.2 && rateVal<2.4){
		document.getElementById('gifs').src="img/animated8.gif";
	}
	else if(rateVal>=2.4 && rateVal<2.6){
		document.getElementById('gifs').src="img/animated7.gif";
	}
	else if(rateVal>=2.6 && rateVal<2.8){
		document.getElementById('gifs').src="img/animated6.gif";
	}
	else if(rateVal>=2.8){
		document.getElementById('gifs').src="img/animated5.gif";
	}
}

populateVoiceList();

if (speechSynthesis.onvoiceschanged !== undefined) {
	speechSynthesis.onvoiceschanged = populateVoiceList;
}

// Set up an event listener for the contact form.
$('form').submit(function(event) {
	// Stop the browser from submitting the form.
	event.preventDefault();

	synth.cancel();
	inputTxt.value=inputTxt.value+" ";
	text='';
	var textMp3='';
	for(let i=0;i<numRepeat;i++){
		text+=inputTxt.value;
		if(i==0){
			textMp3=text;
		}
	}

	utterThis = new SpeechSynthesisUtterance(text);

	var rateVal=rate.value;
	rateVal=parseFloat(rateVal).toFixed(1);
	utterThis.rate = rateVal;
	var lang='';
	var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
	for(i = 0; i < voices.length ; i++) {
		if(voices[i].name === selectedOption) {
			utterThis.voice = voices[i];
			lang=voices[i].lang;
			break;
		}
	}

	utterThis.onstart = function() {
		console.log('Speaker started');
	};

	utterThis.onend = function() {
		if(trulyEnd){
			console.log('Speaker ended');

			location.replace("/hello");
		}
		else{
			console.log('Speaker ended due to changes');
			trulyEnd=true;
		}
	};

	synth.speak(utterThis);
	chooseGif(rate.value);

	var newWish={
		wishText:textMp3,
		rate:rateVal,
		voice:lang
	}


	$.ajax({
		type: 'POST',
		data: JSON.stringify(newWish),
		contentType: 'application/json',
		url: $(this).attr('action'),
		success: function(newWish) {
			console.log('success');
			console.log(JSON.stringify(newWish));
		}
	});
});

inputTxt.blur();


rate.onchange = function(event) {
	trulyEnd=false;
	event.preventDefault();
	synth.cancel();
	var rateVal=rate.value;
	rateVal=parseFloat(rateVal).toFixed(1);
	console.log("onChange, rateVal="+rateVal);
	rateValue.textContent = rateVal*100+'%';

	if(utterThis){
		utterThis.rate = rateVal;
		synth.speak(utterThis);
		chooseGif(rate.value);
	}
}




