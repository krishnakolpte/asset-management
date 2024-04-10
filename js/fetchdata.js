

function fetchData(){
	let haveDetails = false;
	//connect to database & 
	firebase.database().ref('personal_data').once('value',function(snapshot){
		//fetch the individual data from the snapshot.
		snapshot.forEach(function(childSnapshot){
			//fetch the id from database
			var dbuser = childSnapshot.val();
			var dbid = childSnapshot.val().fid;

			//fetch the id of the active user

			var aid = document.getElementById("fid").value;

			//compare both id

			if (dbid == aid) {
				//hide btn container and display details container
				document.getElementById("loader").style.display = "none";
				document.getElementById("notify").style.display = "none";
				document.getElementById("main").style.gridTemplateColumns= "1.4fr 5fr";
				document.getElementById("profile-details").style.display = "flex";

				//setting user data in profile
				document.getElementById("greet").innerHTML = `Welcome, ${dbuser.name} 👋`;
				document.getElementById("u_name").innerHTML = dbuser.name;
				document.getElementById("u_mail").innerHTML = dbuser.fid;
				document.getElementById("u_dob").innerHTML = dbuser.dob;
				document.getElementById("u_contact").innerHTML = dbuser.contact;
				document.getElementById("u_gender").innerHTML = dbuser.gender;

				//setting update profile form data
				document.getElementById("up_name").value = dbuser.name;
				document.getElementById("up_mail").value = dbuser.fid;
				document.getElementById("up_dob").value = dbuser.dob;
				document.getElementById("up_contact").value = dbuser.contact;
				document.getElementById("up_gender").value = dbuser.gender;
				haveDetails = true;
			}
		});
	});

	return haveDetails;
}

function fetchAdminData(){
	
	//connect to database & 
	firebase.database().ref('permission_data').once('value',function(snapshot){
		//fetch the individual data from the snapshot.
		snapshot.forEach(function(childSnapshot){
			//fetch the id from database
			var dbid = childSnapshot.val().email;

			//fetch the id of the active user

			var aid = document.getElementById("fid").value;

			//compare both id

			if (dbid == aid) {
				//hide btn container and display details container
				document.getElementById("loader").style.display = "none";
				
				//setting user data in profile
				document.getElementById("greet").innerHTML = `Welcome, ${dbid} 👋`;	

				fetchAdminUsersData();			
				
			}
		});
	});

}


function fetchAdminUsersData(){
	let  i  = 1;
	//connect to database & 
	firebase.database().ref('allocation_user_data').once('value',function(snapshot){
		//fetch the individual data from the snapshot.
		snapshot.forEach(function(childSnapshot){
			//fetch the id from database
			var dbuser = childSnapshot.val();

			document.getElementById("tabaleBody").innerHTML += `<tr>
				<td>${i}</td>
				<td>${dbuser.employeId}</td>
				<td>${dbuser.assetId}</td>
				<td>${dbuser.assetType}</td>
				<td>${dbuser.assetPermission}</td>
				<td>${dbuser.allocationDate}</td>
				<td>${dbuser.allocationExpireDate}</td>
				<td>${dbuser.allocatedBy}</td>
			</tr>`;
			i++;
			
     
		});
	});
	
}

function fetchUsersToAdminCanOnboardUserData(){
	//connect to database & 
    document.getElementById("onboardEmployee").disabled = true;
    document.getElementById("onboardEmployee").style.cursor = "not-allowed";
    
	firebase.database().ref('permission_data').once('value',function(snapshot){
		//fetch the individual data from the snapshot.
		snapshot.forEach(function(childSnapshot){
			//fetch the id from database
			var dbid = childSnapshot.val().email;
			var dbrole = childSnapshot.val().role;
			var onboard = childSnapshot.val().onboard;
			var profile = childSnapshot.val().profile;

			if(dbrole=="user" && onboard == "false" && 	profile=="true"){
				document.getElementById("onboard_user_emails").innerHTML += `<option value="${dbid}">${dbid}</option>`;
				document.getElementById("onboardEmployee").disabled = false;
				document.getElementById("onboardEmployee").style.cursor = "pointer";
			}
		});
	});
}


function fetchUsersEmployeeIdsToAdminCanAllocateAssets(){
	//connect to database & 
	document.getElementById("allocateAssetBtn").disabled = true;
    document.getElementById("allocateAssetBtn").style.cursor = "not-allowed";
   
	firebase.database().ref('onboard_data').once('value',function(snapshot){
		//fetch the individual data from the snapshot.
		snapshot.forEach(function(childSnapshot){
			//fetch the id from database
			var empId = childSnapshot.val().empId;
			var allocated = childSnapshot.val().allocated;
			

			if( allocated == "false" ){
				document.getElementById("employeid").innerHTML += `<option value="${empId}">${empId}</option>`;
				document.getElementById("allocateAssetBtn").disabled = false;
				document.getElementById("allocateAssetBtn").style.cursor = "pointer";
			}
			
		});
	});

}


//==========================================

function fetchUserEployeeId(email){
	firebase.database().ref('onboard_data').once('value',function(snapshot){
		//fetch the individual data from the snapshot.
		snapshot.forEach(function(childSnapshot){
			//fetch the id from database
			var dbid = childSnapshot.val().email;
			
			if (dbid == email) {
				var empId = childSnapshot.val().empId;
				document.getElementById("employeidContainer").style.display = "flex";
				document.getElementById("u_empid").innerHTML = empId;
				document.getElementById("onboardEmployeeSuccess").style.display = "block";
				document.getElementById("empid").innerHTML = "employee id : "+empId;
				document.getElementById("calimedetailsBtn").style.display = "none";
				fetchUserThatAssetIsAllocatedToUserOrNot(empId);
			}
		});
	});
}

function fetchUserThatAssetIsAllocatedToUserOrNot(empId){
	firebase.database().ref('allocation_user_data').once('value',function(snapshot){
		//fetch the individual data from the snapshot.
		snapshot.forEach(function(childSnapshot){
			//fetch the id from database
			var allocatedData = childSnapshot.val();
			var dbid = childSnapshot.val().employeId;
			var expireDate = childSnapshot.val().allocationExpireDate;

			// Get the current date
		    const currentDate = new Date();
		    
		    // Format the current date as YYYY-MM-DD
		    const formattedTodayDate = currentDate.toISOString().split('T')[0];

			if(formattedTodayDate == expireDate){
				//cancelling asset permission forb the user
				childSnapshot.ref.update({assetPermission:"false"});
			}else{
				childSnapshot.ref.update({assetPermission:"true"});
			}


			
			if (dbid == empId) {

				//if data is claimed by user then dont display 	claimeAssetNotification
				if(allocatedData.claimed == "false"){
					document.getElementById("claimeAssetNotification").style.display = "flex";
					document.getElementById("calimedetailsBtn").style.display = "none";
				}
				if(allocatedData.claimed == "true"){
					document.getElementById("calimedetailsBtn").style.display = "flex";
					document.getElementById("calimedataBtn").style.display = "none";
				}		
				
				//set allocated details in allocated information modal
				document.getElementById("asset_empid").value = allocatedData.employeId;
				document.getElementById("asset_id").value = allocatedData.assetId;
				document.getElementById("asset_type").value = allocatedData.assetType;
				document.getElementById("asset_permis").value = allocatedData.assetPermission;
				document.getElementById("asset_allocated_date").value = allocatedData.allocationDate;
				document.getElementById("asset_all_expire_date").value = allocatedData.allocationExpireDate;
				document.getElementById("asset_all_by").value = allocatedData.allocatedBy;

				setReminder();
			}
		});
	});
}


function setReminder() {
	var expiryDate = document.getElementById('asset_all_expire_date').value;
	var oneDayBefore = new Date(expiryDate);
	oneDayBefore.setDate(oneDayBefore.getDate() - 1); // Get one day before expiry

	// Get the current date
	const currentDate = new Date();
						    
	// Format the current date as YYYY-MM-DD
	const formattedTodayDate = currentDate.toISOString().split('T')[0];


	if(formattedTodayDate == oneDayBefore.toISOString().split('T')[0]){
		showNotification();
		return;
	}else if(expiryDate == formattedTodayDate){
		showNotification2();
	}
}	


function showNotification() {
	var popup = document.getElementById("notificationPopup");
	document.getElementById("reclaimdataBtn").style.display = "flex";
	popup.classList.add("active");
}

function closeNotification() {
	var popup = document.getElementById("notificationPopup");
	popup.classList.remove("active");
}

function showNotification2() {
	var popup = document.getElementById("notificationPopup2");
	popup.classList.add("active");
}

function closeNotification2() {
	var popup = document.getElementById("notificationPopup2");
	popup.classList.remove("active");
}				    

			

