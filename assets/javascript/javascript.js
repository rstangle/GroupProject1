$(".page-header").hide();
$(".modal").modal({
	show: false,
	backdrop: false,
});
var database = firebase.database();
var userRef = null;
var userCount =  database.ref("users");
var currentHero;
var imgURL;
var saves;
var losses;
var game;
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
var indexARR = [];
var timeOut;
var currentUser;
var ctr;
$("#anonymous").on("click", function(){

	firebase.auth().signInAnonymously().catch(function(error) {
  		// Handle Errors here.
  		var errorCode = error.code;
 		var errorMessage = error.message;
  		// ...
	});

});
userCount.once("value", function(snap){

	ctr = snap.val();

});
firebase.auth().onAuthStateChanged(function(user){

	if(user.isAnonymous){


		userCount.transaction(function(count){

			return count++;
		});

		currentUser = "anonymous"+ctr.toString();
		console.log(currentUser);
		$(".page-header").show();
		$("#auth").hide();
		userRef = database.ref(currentUser);

	}else if(user.displayName){

		currentUser = user.displayName;
		console.log(currentUser);
		$("#auth").hide();
		$(".page-header").show();
		userRef = database.ref(currentUser);
	}

userRef.on("value", function(snap){


	currentHero = snap.val().currentHero;
	saves = snap.val().saves;
	losses = snap.val().losses;
	game = snap.val().game;
	console.log(saves+" "+losses);
});

});
function createImageDiv(panel){

	var img = $("<div>").css({"width": "100px", "height": "150px", 
							background: "url("+imgURL+")", 
							"background-size": "cover",
							margin:"3px", float: "left"});
	img.append($("<p>"+currentHero+"</p>").css("color", "white"));
	img.appendTo("#"+panel);

}
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
	$("#ytplayer").attr("src", "https://www.youtube.com/embed/rmznTYTPINc?autoplay=1&controls=0&end=25&modestbrandding=1&disablekb=1&enablejsapi=1&rel=0&showinfo=0&origin=http://example.com");

});

$("#startCinematic").on("shown.bs.modal", function(){
		console.log("shown");
		if(randomHeros.length !=0){
		timeOut = setTimeout(modalcontrol, 26000);
		}

	});
	
$("#startCinematic").on("hidden.bs.modal", function(){
		console.log("hidden");
		clearTimeout(timeOut);
		$("#ytplayer").attr("src", "");
		if(randomHeros.length <= 0){
				
				getNext();
	
		}
		modalcontrol();

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
	userRef.set({

		currentHero: randomHeros[0],
		saves: 0,
		losses: 0,
		

	});
	randomHeros.splice(0,1);
	console.log(randomHeros);
	run();
});

$(".next").on("click", function(){

	pieceW = 300;
	pieceH = 450;

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
	console.log(rowsCol);
	getNext();

});

$("#modalIntergame").on("shown.bs.modal", function(){

	stop();
	
 });
$("#modalIntergame").on("hidden.bs.modal", function(){

	getNext();

});
function callImage(heroName){

	var queryURL = "https://gateway.marvel.com/v1/public/characters?ts=1&name="+
	heroName+"&apikey="+marvelapi+
	"&hash="+hash+"&limit=10";

	var img = $("<img>").attr("id", "myImage");
	var imgPath;
	var imgExt;
	// var imgURL;

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
	console.log(rowsCol);
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

	$("#startCinematic").modal("hide");
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
			containment: ".grid",
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
				// console.log(isRight + " " + yours);

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

     // $("#timer").css("color", "white").html("<h1>" + number + "</h1>");
};

function decrement() {
      
      number--;
      
      if(number <  15) {
      	$("#timer").css("color", "yellow").html("<h1>" + number + "</h1>");
      }

      else if(number < 10) {
      	$("#timer").css("color", "red").html("<h1>" + number + "</h1>");
      }

      else if(number === 0) {
        stop();
        $("#timer").css("color", "red").html("<h1>0</h1>");
        
      }
      else{

      	$("#timer").html("<h1>" + number + "</h1>");


      }


      if(isWin(rowsCol) && randomHeros.length > 0){

					
					$("#modalIntergame").modal("show");//shows intitial modal for now
					// console.log(userRef.currentUser);
					createImageDiv("saves");
					userRef.transaction(function(user){

						user.saves++;
						return user;
					})
					

		}
		else if(isLose(rowsCol) && randomHeros.length > 0){

					
					$("#modalIntergame").modal("show");
					createImageDiv("losses");
					userRef.transaction(function(user){

						user.losses++;
						return user;
					})
		}
		else if(isWin(rowsCol) && randomHeros.length === 0){
			
			createImageDiv("saves");
			userRef.transaction(function(user){

						user.saves++;
						return user;
			});
			$("#startCinematic").modal("show");//final modal will show here
			stop();
			 

		}
		else if(isLose(rowsCol) && randomHeros.length === 0){
			
			createImageDiv("losses");
			userRef.transaction(function(user){

						user.losses++;
						return user;
			});
			$()
			$("#startCinematic").modal("show");//final modal will show here
			stop();
		}
    }

    function stop() {
      clearInterval(intervalId);
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
	if(randomHeros.length > 0){
	indexARR =[];
	$(".grid").empty();
	if(rowsCol === 9){

		number = 20;

	}
	else if (rowsCol === 16){

		number = 45;

	}
	else if(rowsCol === 25){

		number = 90;

	}
	createDroppables_Draggables(rowsCol, pieceW, pieceH);
	callImage(randomHeros[0]);
	makeDrag_drop();
	// $(".difficulty").hide();
	playSound(soundID);
	console.log(randomHeros);
	
	userRef.update({

		currentHero: randomHeros[0],

	});
	
	randomHeros.splice(0,1);
	run();
	}
	else if( randomHeros.length <= 0 ){

	pieceW = 300;
	pieceH = 450;
	randomHeros = [];
	indexARR = [] ;
	$(".grid").empty();
	loadHeros();
	console.log(randomHeros);
	// userRef.update({

	// 	saves: 0,
	// 	losses: 0,
		
	// });
	}
	
} 