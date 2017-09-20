// Initialize Firebase
 var config = {
   		 apiKey: "AIzaSyD5itEBcOOdHdt4ODe-UHnToWG3IvCIFA0",
   		 authDomain: "marvel-puzzle-challenge.firebaseapp.com",
    	 databaseURL: "https://marvel-puzzle-challenge.firebaseio.com",
   	     projectId: "marvel-puzzle-challenge",
  	     storageBucket: "marvel-puzzle-challenge.appspot.com",
 	     messagingSenderId: "875201813648"
 };

firebase.initializeApp(config);

var database = firebase.database();

var soundID = "Thunder";
var EFX1 = "ButtonDrop";
var EFX2 = "SWISH";
var backgroundMusic = "M-GameBG";

var heroImage = ["cyclops (x-men: battle of the atom)", "vision", "dr. strange (marvel: avengers alliance)", "hulk", "cable", "silver surfer", "spider-man", "wolverine", "storm", "jean grey", "guardians of the galaxy", "gladiator (kallark)", "colossus", "nova", "iron man" ]
var number = 0;
var randomHeros = [];

var pieceW = 300;
var pieceH = 450;
var rowsCol;
var win;
var dropped;
var indexARR = [];

function loadHeros(){

	for(var i=0; i<3; i++){

		var x = Math.floor(Math.random()*heroImage.length);
		while(randomHeros.indexOf(heroImage[x]) === -1){

			randomHeros.push(heroImage[x]);
		}

	}
	console.log(randomHeros);
}

//Loads sound from Create JS
function loadSound () {
  createjs.Sound.registerSound("assets/sounds/Thunder1.mp3", soundID);
//   createjs.Sound.registerSound("M-GameBG.mp3", soundID);
	createjs.Sound.registerSound("assets/sounds/G1_FX_DashboardClick.mp3", EFX1);
	createjs.Sound.registerSound("assets/sounds/G2_FX_ClickWrong.mp3", EFX2);
}

//Plays sound from Create JS
function playSound (Sound) {
  createjs.Sound.play(Sound);
  // createjs.Sound.play(backgroundMusic);
}

window.onload = function() {
	$(".puzzle-container").hide();
	$("#frame").hide();
	$("#score-panel").hide();
	// Had to add this here in order to get the thunder sound effect. Also added to the HTML body tag, 
	// but not sure if it is needed there or if it actually working there. Removed from Body tag in HTML and still works.
	loadSound(); // Will try the loadSounds() for multiple sounds as well.
	playAudio();
	loadHeros();
};
$("#start").on("click", function(){

	//call video modal

	// $("#modalRules").modal("show");
	 setTimeout(modalcontrol, 1000);

});
$(".mybtn").on("click", function(){
	$(".page-header").hide();
	$("#main-menu-image").hide();
	$(".puzzle-container").show();
	$("#frame").show();
	$("#score-panel").show();
	

	if($(this).attr("data-value") === "3"){

		pieceW = Math.ceil(pieceW * (33/100));
		pieceH = Math.ceil(pieceH * (33/100));
		rowsCol = 3*3;
		number = 20;
	}
	else if($(this).attr("data-value") === "4"){

		pieceW = Math.ceil(pieceW * (25/100));
		pieceH = Math.ceil(pieceH * (25/100));
		rowsCol = 4*4;
		number = 45;
	}
	else{

		pieceW = Math.ceil(pieceW * (20/100));
		pieceH = Math.ceil(pieceH * (20/100));
		rowsCol = 5*5;
		number = 90;
	}
	
	// dropped = rowsCol;
	createDroppables_Draggables(rowsCol, pieceW, pieceH);
	makeDrag_drop();
	// $(".difficulty").hide();
	playSound(soundID);
	callImage(randomHeros[0]);
	randomHeros.splice(0,1);
	run();
});

function callImage(heroName){

	var queryURL = "https://gateway.marvel.com/v1/public/characters?ts=1&name="+
	heroName+"&apikey="+
	"0044cc7cb16f9553976a74b044391f37&hash=4ff8149b5799a6496b13f7c9bf7c7668&limit=10";

	var img = $("<img>").attr("id", "myImage");
	var imgPath;
	var imgExt;
	var imgURL;

	$.ajax({

		url: queryURL,
		method: "GET"
	}).done(function(response){

		imgPath = response.data.results[0].thumbnail.path;
		imgExt = response.data.results[0].thumbnail.extension;
		imgURL = imgPath + "/portrait_uncanny." + imgExt;
		img.attr("src", imgURL);
		$(".empty").html(img);
		$(".empty").hide();
		$("#myImage").on("load", function(){

			createImgPieces();
		})

	});

	
}
function createDroppables_Draggables(num, w, h){

	for(var i = 0; i<num; i++){
		var id = i.toString();
		var drop = $("<div>").addClass("drop").attr("grid-index", i);
		drop.attr("id", "drop"+id);
		drop.css({float: "left", background: "none", width: w, height: h, position: "relative"});
		var drag = $("<div>").addClass("drag").attr("id", "drag"+id);
		drag.css({float: "left", background: "#dddddd", width: w, height: h,"z-index": 3});
		drop.appendTo(".grid");
		drop.html(drag);
	}

}
function createImgPieces(){
	shuffleArr(rowsCol);
	var canvas;
	var ctx;
	var x;
	var y;
	var image = document.getElementById("myImage");
	if(rowsCol === 9){

		for(var i = 0 ; i<rowsCol ; i++){

			canvas = document.createElement("canvas");
			canvas.width = pieceW;
			canvas.height = pieceH;
			canvas.id = i;
			ctx = canvas.getContext("2d");
			if(i<3){

				x = i*pieceW;
				y = 0;
				ctx.drawImage(image, x,y,pieceW,pieceH,0,0,canvas.width,canvas.height);
				$("#drag"+indexARR[i]).html(canvas);

			}
			else if(i<6){

				x = pieceW*(i%3);
				y = pieceH;
				ctx.drawImage(image, x,y,pieceW,pieceH,0,0,canvas.width,canvas.height);
				$("#drag"+indexARR[i]).html(canvas);

			}
			else{

				x = pieceW*(i%3);
				y = pieceH*2;
				ctx.drawImage(image, x,y,pieceW,pieceH,0,0,canvas.width,canvas.height);
				$("#drag"+indexARR[i]).html(canvas);

			}

		}


	}
	else if(rowsCol === 16){

		for(var i = 0 ; i<rowsCol ; i++){

			canvas = document.createElement("canvas");
			canvas.width = pieceW;
			canvas.height = pieceH;
			canvas.id = i;
			ctx = canvas.getContext("2d");
			if(i<4){

				x = pieceW * i;
				y = 0;
				ctx.drawImage(image, x,y,pieceW,pieceH,0,0,canvas.width,canvas.height);
				$("#drag"+indexARR[i]).html(canvas);

			}
			else if(i<8){

				x = pieceW * (i%4);
				y = pieceH;
				ctx.drawImage(image, x,y,pieceW,pieceH,0,0,canvas.width,canvas.height);
				$("#drag"+indexARR[i]).html(canvas);
			}
			else if(i<12){

				x = pieceW * (i%4);
				y = pieceH * 2;
				ctx.drawImage(image, x,y,pieceW,pieceH,0,0,canvas.width,canvas.height);
				$("#drag"+indexARR[i]).html(canvas);

			}
			else{

				x = pieceW * (i%4);
				y = pieceH * 3;
				ctx.drawImage(image, x,y,pieceW,pieceH,0,0,canvas.width,canvas.height);
				$("#drag"+indexARR[i]).html(canvas);

			}

		}


	}
	else if(rowsCol === 25){

		for(var i = 0 ; i<rowsCol ; i++){

			canvas = document.createElement("canvas");
			canvas.width = pieceW;
			canvas.height = pieceH;
			canvas.id = i;
			ctx = canvas.getContext("2d");
			if(i<5){

				x = pieceW*i;
				y = 0;
				ctx.drawImage(image, x,y,pieceW,pieceH,0,0,canvas.width,canvas.height);
				$("#drag"+indexARR[i]).html(canvas);

			}
			else if(i<10){

				x = pieceW * (i%5);
				y = pieceH;
				ctx.drawImage(image, x,y,pieceW,pieceH,0,0,canvas.width,canvas.height);
				$("#drag"+indexARR[i]).html(canvas);

			}
			else if(i<15){

				x = pieceW * (i%5);
				y = pieceH * 2;
				ctx.drawImage(image, x,y,pieceW,pieceH,0,0,canvas.width,canvas.height);
				$("#drag"+indexARR[i]).html(canvas);

			}
			else if(i<20){

				x = pieceW * (i%5);
				y = pieceH * 3;
				ctx.drawImage(image, x,y,pieceW,pieceH,0,0,canvas.width,canvas.height);
				$("#drag"+indexARR[i]).html(canvas);
			}
			else{

				x = pieceW * (i%5);
				y = pieceH * 4;
				ctx.drawImage(image, x,y,pieceW,pieceH,0,0,canvas.width,canvas.height);
				$("#drag"+indexARR[i]).html(canvas);

			}
		}
	}
}

function shuffleArr(num){

	var arr = [];
	for(var i = 0; i<num; i++){
		var str = i.toString();
		arr.push(str);
	}

	for(var i = 0; i<num ; i++){
 		//a random number between 0 and length of array
 		var r = Math.floor(Math.random()*arr.length);
 		//push the shuffled item to our empty array
 		indexARR.push(arr[r]) ;
 		//remove the item from our index array as to avoid duplication
 		//since this is a random process
 		arr.splice(r,1);
 	}
 	console.log(indexARR);
}

function modalcontrol(){
	$("#modalRules").modal("hide");
	$("#modalStart").modal("show");
}

function makeDrag_drop(){
		var lastPlace;

		$(".drag").draggable({
			
			revert: true,
			zIndex: 10,
			snap:".drop",
			snapMode: "inner",
			snapTolerance: 40,
			start: function(event, ui){

				lastPlace = $(this).parent();
			},
			stop: function(){


				
			}
		});



		$(".drop").droppable({
			drop: function(event, ui){

				var dragged = ui.draggable;
				var droppedOn = this;
				var yours = dragged.children().attr("id");
				var isRight = $(this).attr("grid-index"); 
				console.log(isRight + " " + yours);

				if((yours === isRight)){

					playSound(EFX1);
					$(droppedOn).children().detach().prependTo($(lastPlace));
					$(dragged).detach().css({
               			 top: 0,
                		 left: 0
           			 }).prependTo($(droppedOn));
				}
				else{

					playSound(EFX2);
				}
			}
		});
}
function isWin(num){
	var count = 0;
	for(var i=0; i < num; i++){
		var id = i.toString();
		var static= $("#drop"+id).attr("grid-index");
		var motion= $("#drop"+id).children().children().attr("id");
		if(static === motion){

			count++;
		}

	}
	if(count === num && number>0){

		return true;

	}
	// else {

	// 	return false;
	// }


}

function isLose(num){
	var count = 0;
	for(var i=0; i < num; i++){
		var id = i.toString();
		var static= $("#drop"+id).attr("grid-index");
		var motion= $("#drop"+id).children().children().attr("id");
		if(static === motion){

			count++;
		}

	}
	if( number === 0 && count != num){

		return true;
	}
	// else{

	// 	return false;
	// }

}

// var text = $("<p>"+"True believers....."+"<br><br>"+"a bunch of text"+"</p>");

//************************************************************************************************************************************
//**** COUNTDOWN TIMER ***************************************************************************************************************
//************************************************************************************************************************************

	function run() {
      intervalId = setInterval(decrement, 1000);
   //    if ($(".mybtn").attr("data-value") === "3") {
   //      number = 20;
   //    } 
   //    else if ($(".mybtn").attr("data-value") === "4") {
   //    	number = 45;
   //    }
	  // else if ($(".mybtn").attr("data-value") === "5") {
	  // 	number = 90;
	  // }

      $("#timer").css("color", "white").html("<h1>" + number + "</h1>");
    };

    function decrement() {
      number--;
      $("#timer").html("<h1>" + number + "</h1>");
      if(number <= 15) {
      	$("#timer").css("color", "yellow").html("<h1>" + number + "</h1>");
      }

      if(number <= 10) {
      	$("#timer").css("color", "red").html("<h1>" + number + "</h1>");
      }

      if(number === 0) {
        stop();
        $("#timer").css("color", "red").html("<h1>0</h1>");
        // wrong++;
      }
      if(isWin(rowsCol)){

					stop();//stops timer
					$("#modalStart").modal("show");//shows intitial modal for now
					//other to-do's
					//update heroes panels
					//fetch next puzzle on continue click...

		}
		else if(isLose(rowsCol)){

					alert("you lose");
		}
    }

    function stop() {
      clearInterval(intervalId);
    }

    function reset() {
    	number = 0;
		$("#timer").html(number);
		// $("#stats").hide();
		// $("#question-area").show();
		run();
	}

//************************************************************************************************************************************
//**** BACKGROUND MUSIC **************************************************************************************************************
//************************************************************************************************************************************

	var audio = document.getElementById("game-music");

	function playAudio() {
		audio.play();
	}

	function pauseAudio() {
		audio.pause();
	}
// *******************************************
// ******Next FOR CONTINUITY*****************
// *******************************************
//not done yet
function getNext(){

	indexARR =[];
	$(".grid").empty();
	if(rowsCol === 9){

		number = 20;


	}


} 