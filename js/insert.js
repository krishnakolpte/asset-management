// step1: create table name
firebase.initializeApp(firebaseConfig);
var database = firebase.database().ref("personal_data");

function inserUserData(){
	var name = document.getElementById("name").value;
	var dob = document.getElementById("dob").value;
	var contact = document.getElementById("contact").value;
	var gender = document.getElementById("gender").value;
	var fid = document.getElementById("fid").value

	if(!name || !dob || !contact || !gender){
		alert("please fill all fields.");
		return;
	}
	//user validation

	if(/\d/.test(name)){
		alert("name should contain only characters.");
		document.getElementById("name").style.borderColor = "red";
		return
	}

	//valdating password
	if(contact.toString().length < 10 ||  contact.toString().length > 10 ){
		alert("the contact number should be only 10 digits ");
		document.getElementById("contact").style.borderColor = "red";
		return
	}


	//step2: push the data 


	var data = database.push();

	//step3: prepare the data

	data.set({
     	name:name,
     	dob:dob,
     	contact:contact,
     	gender:gender,
     	fid:fid,
	});

	updateUserProfleStatusInOnboardTable(fid);

	alert("data inserted");

	document.getElementById("modal").style.display = "none";
		
}


function updateUserProfleStatusInOnboardTable(fid){
	firebase.database().ref('permission_data').once('value',function(snapshot){
		//fetch the individual data from the snapshot.
		snapshot.forEach(function(childSnapshot){
			//fetch the id from database
			var dbid = childSnapshot.val().email;

			if (dbid == fid) {		
				childSnapshot.ref.update({profile:"true"});
				window.location.reload();
			}
		});
	});
}

