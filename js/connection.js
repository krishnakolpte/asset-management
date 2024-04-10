//initializing firebase app and connecting database

const firebaseConfig = {
	apiKey: "AIzaSyCTlQtp-RRzZWBNBJqO87gZWiZBizdmf4c",
	authDomain: "myapp2024-83923.firebaseapp.com",
	databaseURL: "https://myapp2024-83923-default-rtdb.firebaseio.com",
	projectId: "myapp2024-83923",
	storageBucket: "myapp2024-83923.appspot.com",
	messagingSenderId: "131951877932",
	appId: "1:131951877932:web:14b7003d9bedf36a0b9689",
	measurementId: "G-49KRND18QF"
};

firebase.initializeApp(firebaseConfig);
var authObj = firebase.auth();

	
