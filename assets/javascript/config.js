var hash = "4ff8149b5799a6496b13f7c9bf7c7668";

var marvelapi = "0044cc7cb16f9553976a74b044391f37";
var config = {
   		 apiKey: "AIzaSyD5itEBcOOdHdt4ODe-UHnToWG3IvCIFA0",
   		 authDomain: "marvel-puzzle-challenge.firebaseapp.com",
    	 databaseURL: "https://marvel-puzzle-challenge.firebaseio.com",
   	     projectId: "marvel-puzzle-challenge",
  	     storageBucket: "marvel-puzzle-challenge.appspot.com",
 	     messagingSenderId: "875201813648"
 };

firebase.initializeApp(config);

 
      // FirebaseUI config.
var uiConfig = {
        signInSuccessUrl: 'index.html',
        signInOptions: [
          // Leave the lines as is for the providers you want to offer your users.
         
          firebase.auth.GithubAuthProvider.PROVIDER_ID,
         
        ],
        // Terms of service url.
        tosUrl: ''
      };

      // Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
      // The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);