// url to send to ajax method
var qURL = "https://gateway.marvel.com/v1/public/characters?ts=1&name="+"iron man"+"&apikey="+"0044cc7cb16f9553976a74b044391f37&hash=4ff8149b5799a6496b13f7c9bf7c7668&limit=10";
// var qURL = "https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=th&apikey=0044cc7cb16f9553976a74b044391f37";

$.ajax({

	url: qURL,
	method: "GET"
}).done(function(response){
	//storing relevant object information to fetch image
	var z = response.data.results[0].thumbnail.extension;
	var x = response.data.results[0].thumbnail.path;
	var y = x + "/portrait_uncanny." + z;
	var img = $("<img>").attr("src", y).attr("id", "piece-1");
	img.appendTo("#image");
	//hides image div so only shuffled puzzle appears
	$("#image").hide();
	//console.log(img);
	
	console.log(response);
 	console.log(response.data.results[0].thumbnail.path);

 	//this is very important...this function doesn't
 	//execute until the image from the api is loaded in html DOM
 	//otherwise it will cause an error with canvas drawImage() function
 	$("#piece-1").on("load",function (){
     //once our image is loaded call the function that cuts it to pieces
     cutImage();
     //the following  commented code is an example of cutting one piece only
     //====================================================================
	// var imgs = document.getElementById("piece-1");
	// 	var c = document.createElement("canvas");
	// 	c.className = "canvas";
	// 	$("#1").html(c);
	//     var ctx = c.getContext("2d");
	// 	ctx.drawImage(imgs, 97.95,0, 97.95, 148.05, 0,0,c.width, c.height);
	});
	

});
//declare an empty array to push string numbers from "0" to "8"
var indexARR = [];
//declare empty array to push to a shuffled order of indeces;
 var shuffled = [];
 //I was too lazy to type indexARR = ["0", "1", "2", "3"....etc..]
 //so i used a loop...I love loops(with today's intel core 7 processors they are not as bad)
 for (var i=0; i<9 ; i++){
 	//change i to a string to push into array
 	var str = i.toString();
 	indexARR.push(str);
 	
 }
 //a function that shuffles the array passed to it "arr".
 function shuffleArr(arr){

 	//for loop of length 9 which is the length we need for our purposes
 	for(var i = 0; i<9 ; i++){
 		//a random number between 0 and length of array
 		var r = Math.floor(Math.random()*arr.length);
 		//push the shuffled item to our empty array
 		shuffled.push(arr[r]) ;
 		//remove the item from our index array as to avoid duplication
 		//since this is a random process
 		arr.splice(r,1);

 	}
 	//return the shuffled array
 	return shuffled;

 }
 //new variable that's basically an arr to store the return value of the above function
 var arr = shuffleArr(indexARR);

function cutImage(){
	//the div's containing the canvas are of width 32.65% and height 33% of image ratio 300X450
 	//height of image section to be cut...equal to 33% of 450 image height
 	var h=148.05;
 	// width of image section to be cut...equal to 32.65% of 300 image height
 	var w=97.95;
 	// varaible to store x coordinate of where to start cutting image (x-axis)
 	var x; 
 	// varaiable to store y coordinate of where to start cutting image (y-axis)
 	var y; 
 	//gets image from html element <img> with id="piece-1"
 	var imgs = document.getElementById("piece-1"); 

 	//initiate for loop that goes for 9 times of the 9 sections to cut from image
 	for(var i=0; i<9; i++){
 		//turn value to a string to append to equivalent div id(will upload html to relate)
 		var id = i.toString();
 		// creates a new html element each loop turn to make a new canvas
 		var c = document.createElement("canvas");
 		//assigns canvas a class which I used to set canvas'S width and height to be that of sections 
 		//(the 32.65% and 33%)
 		c.className = "canvas";
 		//CHECKING X AND Y VALUES...NOT REQUIRED
 		console.log("x: "+x+" -- "+"Y: "+y);
 		//The Magic:
 		//The grid is 3X3...for i = 0, 1, 2 three sections of row 1
 		if(i<3){
 		//since here i is 0,1,2..those are the x coordinate multipliers I need..
 		//thus on first iteration x=0*97.95...on second iteration x= 1*97.95
 		//on third iteration x=2*97.95 
 		//in all three cases I get the x coordinate of the image where I want to start
 		//cutting (drawing)
 			x = i*w; 
 		// y coordinate is always 0 on first row
 			y = 0;
 		// canvas function to get drawing context
 			var ctx = c.getContext("2d");
 		//drawImage function:
 		//drawImage(image, x-coordinate of Image, y-coordinate of Image, width to cut, height to cut, x-coordinate of canvas, y-coordinate of canvas, canvas width, canvas height);
 			ctx.drawImage(imgs, x,y,w,h,0,0,c.width,c.height);
 		//show element by passing it as html to the equivalent div now with id = arr[i]..that is our index array
 			$("#"+arr[i]).html(c);
 		

 		}
 		//for i = 3,4,5 three sections of row 2
 		else if(i<6){
 		//y- coordinate of row 2 in image is equal to height of section * 1 always = h;
 			y = h;
 		//x coordinate since all sections are equal always start at 0*w, 1*w, 2*w...inorder to get that from i
 		//we can use i%3....here when i=3 i%3=0 , when i=4 i%3=1, when i=5 i%3=2
 		    x = w * (i%3);
 		//same process as above condition
 			var ctx = c.getContext("2d");
 			ctx.drawImage(imgs, x,y,w,h,0,0,c.width,c.height);
 			$("#"+arr[i]).html(c);
 		}
 	    //for i = 6,7,8 three sections of row 3
 		else if(i<9){
 		//y-coordinate of row 3 in image is equal to height of section * 2 always = h*2
 			y = 2*h;
 		//same logic as earlier need 0,1,2 * w consecutively 
 			x = w*(i%3);
 		//same process again
 			var ctx = c.getContext("2d");
 			ctx.drawImage(imgs, x,y,w,h,0,0,c.width,c.height);
 			$("#"+arr[i]).html(c);
 		}
 	}
 }
 //look at this in console...and then look at the id's in html file...
 console.log(arr);
 console.log(Math.floor(Math.random()*9));
