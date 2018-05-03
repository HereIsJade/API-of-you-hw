//if put inside init, will cause reference error: xxx not defined. why??????
var bodyWidth=$('body').width()-200;
var bodyHeight=$('body').height()-200;
var nthBand=0;
var nthVideo=0;
var numOfBands=0;
var videosPerBand=0;
var windowScrollPos=0;
// init controller



function init(){
  // on page load, load in our data from our json file

  $.ajax({
    url: './data/myFavBands.json',
    type: 'GET',
    failure: function(err){
      console.log ("There was an issue getting the data.");
    },
    success: function(response) {
      // if no data, let's stop the script from running and log it
      if(!response || response==null || response.length==0) return console.log('no data to show!');
      numOfBands=response.length;
      videosPerBand=response[0].myFavSongs.length;
      //render videos for each band
      response.forEach(function(currentBand){
        addBandVideos(currentBand);
        nthBand++;
      });

      getBandInfo(response[0]);

      renderBandInfo(response);


      //render band info after loading all the videos according to the scrolling  position
      //numOfBands=5,videosPerBand=4
      // if(nthBand>=numOfBands && nthVideo>=videosPerBand){
      //   renderBandInfo(response);
      // }

    }
  });
}

function renderBandInfo(response){
  window.onscroll = function() {
    windowScrollPos=window.scrollY;
    for(var i=0;i<numOfBands;i++){
      if(i!=4){
        var currentPos=$(`#video${i}0`).position().top-400;
        var nextPos=$(`#video${i+1}0`).position().top-400;

        if(currentPos<windowScrollPos && nextPos>windowScrollPos){
          getBandInfo(response[i]);
          break;
        }
      }
      else{
        if(currentPos<windowScrollPos){
          getBandInfo(response[i]);
          break;
        }
      }
    }
  }
}

function getBandInfo(data){
  console.log(data.name);
  $("#band-name").text(data.name);
  $("#origin").text(data.origin);
  $("#genres").text(data.genres.join(', '));
  $("#formed-year").text(data.yearFormed);
  $("#albums").text(data.studioAlbums.join(', '));
}

// function renderBandInfo(response){
//
//   // build scrollmagic scenes for each band
//   for(var i=0;i<numOfBands;i++){
//     scenes[i]=new ScrollMagic.Scene({triggerElement: `#video${i}0`,duration:800})
//       .addTo(controller).on("enter", function () {
//         console.log("scene entered");
//
//       });
//   }
//
//   // let temp=2;
//   // console.log("with variable "+response[temp].name);
//   // console.log(response[1].name);
//   console.log("on scene "+scenes.findIndex(getCurrentScene));
//   // console.log(response[scenes.findIndex(getCurrentScene)].name);
//   // $("#band-name").text(response[scenes.findIndex(getCurrentScene)].name);
//
// }

// function getCurrentScene(){
//   scenes.forEach(function(currentScene){
//     currentScene.on("enter", function () {
//       console.log("scene entered");
//       console.log(currentScene);
//       return currentScene;
//     });
//   });
// }

function addBandVideos(currentBand){
  nthVideo=0;
  currentBand.myFavSongs.forEach(function(currentSong){
    // var videoHTML=`
    // <div class="favorite-song-video">
    //   <iframe src="${currentSong.songUrl}?controls=0&&showinfo=0" frameborder="0"></iframe>
    //   <p>${currentSong.songName} - ${currentBand.name}</p>
    // </div>`;
    var videoId=`video${nthBand}${nthVideo}`;
    console.log(videoId);

    var videoHTML=`
    <div id="${videoId}" class="favorite-song-video">
      <iframe src="${currentSong.songUrl}?controls=0&&showinfo=0" frameborder="0"></iframe>
    </div>`;

    var randPosX = Math.floor((Math.random()*bodyWidth));
    var randPosY = Math.floor((Math.random()*bodyHeight));

    $(videoHTML).css({
      left : getRandomPosition(nthBand,nthVideo).randPosX,
      top : getRandomPosition(nthBand,nthVideo).randPosY
    }).appendTo($("#favorite-videos"));

    $(`#${videoId}`).find("iframe").css({
      width : getRandomSize().randWidth,
      height : getRandomSize().randHeight
    });

    $(`${videoId}`).append(`<p>${currentSong.songName} - ${currentBand.name}</p>`);

    // if(nthVideo==0){
    //   $(videoId).addClass( "firstVideos" );
    // }
    nthVideo++;
  });
}

function getRandomPosition(nthBand,nthVideo){
  if(nthVideo%2==0){
    //position the video on the left side
    var randPosX = getRandomInt(5,bodyWidth/10);
    var randPosY = nthBand*1600+nthVideo*250+getRandomInt(0,bodyHeight/10);
    // console.log(randPosX);
  }
  else{
    //position the video on the right side
    var randPosX = getRandomInt(6*bodyWidth/10,bodyWidth);
    var randPosY = nthBand*1500+nthVideo*300+getRandomInt(-200,bodyHeight/8);

    // console.log("right="+randPosX);
  }
  return {
        randPosX: randPosX,
        randPosY: randPosY
    };
}

function getRandomSize(){
  var randWidth=getRandomInt(320,450);
  return {
    randWidth: randWidth,
    randHeight: randWidth+getRandomInt(-100,10)
  };
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

// window.addEventListener('load', init);
init();
