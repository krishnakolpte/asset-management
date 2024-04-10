
//creating a table in database
var database = firebase.database().ref("permission_data");
var onboardTable = firebase.database().ref("onboard_data");

function toggleToSignUp() {
	document.getElementById("sign_in_p1").style.display = "none";
	document.getElementById("sign_in_p2").style.display = "block";

	document.getElementById("confirm_pass_div").style.display = "flex";
	document.getElementById("captcha_container").style.display = "none";

	document.getElementById("login").style.display = "none";
	document.getElementById("secondoryBtn").style.display = "none";
	document.getElementById("register").style.display = "block";

	document.getElementById("social_p1").style.display = "none";
	document.getElementById("social_p2").style.display = "block";

	document.getElementById("s_notify1").style.display = "none";
	document.getElementById("s_notify2").style.display = "block";

}

function toggleToSignIn() {
	document.getElementById("sign_in_p1").style.display = "block";
	document.getElementById("sign_in_p2").style.display = "none";

	document.getElementById("confirm_pass_div").style.display = "none";
	document.getElementById("password_container").style.display = "flex";
	document.getElementById("captcha_container").style.display = "flex";

	document.getElementById("login").style.display = "block";
	document.getElementById("secondoryBtn").style.display = "block";
	document.getElementById("register").style.display = "none";

	document.getElementById("social_p1").style.display = "block";
	document.getElementById("social_p2").style.display = "none";

	document.getElementById("s_notify1").style.display = "block";
	document.getElementById("s_notify2").style.display = "none";
	
}


function loginUser(){
	var email = document.getElementById("email_id").value;
	var password = document.getElementById("password").value;
	var userEnteredCaptcha = document.getElementById("captcha").value;
	var captcha = document.getElementById("hiddenCaptcha").value;

	//valdating email
	if(email == ""){
		document.getElementById("email_container").style.borderColor = "red";
		return
	}else{
		document.getElementById("email_container").style.borderColor = "royalblue";
	}

	//valdating password
	if(password == ""){
		document.getElementById("password_container").style.borderColor = "red";
		return
	}else{
		document.getElementById("password_container").style.borderColor = "royalblue";
	}


	if(userEnteredCaptcha == "" || userEnteredCaptcha != captcha){
		document.getElementById("captcha_container").style.borderColor = "red";
		return;
	}else{
		document.getElementById("captcha_container").style.borderColor = "royalblue";
	}



	//sign in user using email and password
	firebase.auth().signInWithEmailAndPassword(email,password).then((success)=>{
		alert("Welcome to Creative.com");
		document.getElementById("email_id").value = "";
		document.getElementById("password").value = "";
		document.getElementById("captcha").value = "";

		isAdminUser(email);	
		
	}).catch((error)=>{
		alert("something went wrong");
	});
	
}

//insert data in a database
//step1 : import the package.
//step2 : connect to firebase server.
//step3 : push the data in the database.

function createUserAccount(email,password){
	//validating user details
	if(email != "" || password !=""){
		//step2: push the data 

		var data = database.push();

		//step3: prepare the data

		data.set({
	     	email:email,
	     	password:password,
	     	role:"user",
	     	onboard:"false",
	     	profile:"false",
		});

		document.getElementById("email_id").value = "";
		document.getElementById("password").value = "";
		document.getElementById("confirm_pass").value="";
	}
}

function registerUser(){
	//fetch the details
	var email = document.getElementById("email_id").value;
	var password = document.getElementById("password").value;
	var confirm_pass = document.getElementById("confirm_pass").value;
	

	if(validateUser(email,password,confirm_pass)){
		document.getElementById("verify").style.display = "flex";
		createUserAccount(email,password);
		firebase.auth().createUserWithEmailAndPassword(email,password).then((success)=>{
			alert("account created successfully");
		}).catch((error)=>{
			alert("something went wrong");
		});
	}
	
}

function logoutUser() {
	// logout user 

	authObj.signOut().then(()=>{
		alert("user logout successfully.");
		window.location.href = "../index.html"
	}).catch((error)=>{
		alert("somthing went wrong.");
	});
}

function verifyUserEmail() {
	// send email verification
	var user = authObj.currentUser;
	user.sendEmailVerification().then(function(){
		alert("email sent successfully");
		document.getElementById("verify").style.display = "none";
	}).catch(function(){
		alert("something went wrong");
	});
		
}

function closeVerifyModal(){
	document.getElementById("verify").style.display = "none";
}

function validateUser(email,password,confirm_pass){

	//valdating email
	if(email == ""){
		document.getElementById("email_container").style.borderColor = "red";
		return false;
	}else{
		document.getElementById("email_container").style.borderColor = "royalblue";
	}

	//valdating password
	if(password == ""){
		document.getElementById("password_container").style.borderColor = "red";
		return false;
	}else{
		document.getElementById("password_container").style.borderColor = "royalblue";
	}

	//valdating confirm password
	if(confirm_pass == ""){
		document.getElementById("confirm_pass_div").style.borderColor = "red";
		return false;
	}else{
		document.getElementById("confirm_pass_div").style.borderColor = "royalblue";
	} 

	//valdating or matching password and confirm_pass
	if(password != confirm_pass){
		document.getElementById("confirm_pass_div").style.borderColor = "red";
		return false;
	}else {
		document.getElementById("confirm_pass_div").style.borderColor = "royalblue";
	}


	return true;	
}


// -------------------------------------------



function openModal() {
	document.getElementById("modal").style.display = "flex";
	document.getElementById("notify").style.bottom = "-200px";
}

function closeModal() {
	document.getElementById("modal").style.display = "none";
	document.getElementById("notify").style.bottom = "20px";
}


// --------------------------------------------

function openUpdateProfilePage(){
	document.getElementById("update_form").style.display = "flex";
}

function closeUpdateProfilePage(){
	document.getElementById("update_form").style.display = "none";
} 


// ==================================

function isAdminUser(email){

	//check the given email user is admin or user .
	
		firebase.database().ref('permission_data').once('value',function(snapshot){
				//fetch the individual data from the snapshot.
				snapshot.forEach(function(childSnapshot){
				//fetch the id from database
						
				var dbid = childSnapshot.val().email;
				var role = childSnapshot.val().role;

				if (dbid == email) {
					if (role == "admin") {
						//redirect to admin home page
						window.location.href = "./templet/assetmanagement.html";
					}
					if (role == "user") {
						//redirect to user home page
						window.location.href = "./templet/home.html";
					}
				}
			});
		});	
}

//================ onboard functionalities ================

function onBoardDisplay(){
	document.getElementById("onboardContainer").style.display = "flex";
	fetchUsersToAdminCanOnboardUserData();

	//generating the employee id and set in input field of onboard container
	const empId = "EMP-" + Math.floor(1000 + Math.random() * 9000).toString();
	//setting the empid
	document.getElementById("onboardEmpId").value = empId;
}

function onBoardDisplayNone(){
	document.getElementById("onboardContainer").style.display = "none";
}

function onboardEmployee(){
	var emailId = document.getElementById("onboard_user_emails").value;
	var empId = document.getElementById("onboardEmpId").value;

	console.log("jhgfjhfhgfdhgfhgf")

	//insert data in onboard table
	insertDataInOnboardDataTable(emailId,empId);

	//update employee in onboard data
	updateUserOnboardStatus(emailId);
}

function insertDataInOnboardDataTable(email,empId){
	
	var data = onboardTable.push();

	//step3: prepare the data

	data.set({
	   email:email,
	   empId:empId,
	   allocated:"false",
	});
}

function updateUserOnboardStatus(email){
	firebase.database().ref('permission_data').once('value',function(snapshot){
		//fetch the individual data from the snapshot.
		snapshot.forEach(function(childSnapshot){
			//fetch the id from database
			var dbid = childSnapshot.val().email;

			if (dbid == email) {
				childSnapshot.ref.update({onboard:"true"});
			}
		});
	});

	alert("User onboarded successfully.");

	document.getElementById("onboardContainer").style.display = "none";
	
}


function addAssetDisplay(){
	var element = document.getElementById("right-container");
	var element2 = document.getElementById("main");
	element2.style.gridTemplateColumns = "5fr 2fr";
	element.style.display = "flex";

	fetchUsersEmployeeIdsToAdminCanAllocateAssets();

	//generating the asset id and set in input field of onboard container
	const assId = "ASS-" + Math.floor(1000 + Math.random() * 9000).toString();
	//setting the asset id
	document.getElementById("assetid").value = assId;

    generateDateAndSetDate()

}

function generateDateAndSetDate(){
	//generating current date and setting current date.
	const dateInput = document.getElementById('allocationDate');
    const nextThreeMonthsInput = document.getElementById('allocationExpireDate');
    
    // Get the current date
    const currentDate = new Date();
    
    // Format the current date as YYYY-MM-DD
    const formattedDate = currentDate.toISOString().split('T')[0];
    
    // Set the value of the input element to the current date
    dateInput.value = formattedDate;

    // Calculate the date exactly 3 months later
    const nextThreeMonthsDate = new Date(currentDate);
    nextThreeMonthsDate.setMonth(nextThreeMonthsDate.getMonth() + 3);
    
    // Format the next three months date as YYYY-MM-DD
    const formattedNextThreeMonthsDate = nextThreeMonthsDate.toISOString().split('T')[0];
    
    // Set the value of the next three months date input element
    nextThreeMonthsInput.value = formattedNextThreeMonthsDate;
}

function addAssetDisplayNone(){
	var element = document.getElementById("right-container");
	var element2 = document.getElementById("main");
	element2.style.gridTemplateColumns = "1fr";
	element.style.display = "none";
}


// ======================================================

function checkUserIsOnboardedOrNot(email){
	firebase.database().ref('permission_data').once('value',function(snapshot){
		//fetch the individual data from the snapshot.
		snapshot.forEach(function(childSnapshot){
			//fetch the id from database
			var dbid = childSnapshot.val().email;
			var onboard = childSnapshot.val().onboard;

			if (dbid == email) {
				if(onboard == "true"){
					document.getElementById("pendingStateDiv").style.display = "none";
				}else{
					document.getElementById("pendingStateDiv").style.display = "block";
				}
			}
		});
	});
}




function openAssetModal(){
	document.getElementById("modal2").style.display = "flex";
	document.getElementById("claimeAssetNotification").style.display = "none";
}

function closeAssetModal(){
	document.getElementById("modal2").style.display = "none";
}

