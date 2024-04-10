
// firebase.initializeApp(firebaseConfig);
var database = firebase.database().ref("allocation_user_data");

function insertAssetAllocationData(){
	var employeId = document.getElementById("employeid").value;
	var assetType = document.getElementById("assetstype").value;
	var assetId = document.getElementById("assetid").value;
	var assetPermission = document.getElementById("assetsPermission").value;
	var allocationDate = document.getElementById("allocationDate").value;
	var allocationExpireDate = document.getElementById("allocationExpireDate").value;
	var fid = document.getElementById("fid").value;

	if(!employeId || !assetId || !assetType || !assetPermission || !allocationDate || !allocationExpireDate){
		alert("please fill all fields.");
		return;
	}
	
	//step2: push the data 


	var data = database.push();

	//step3: prepare the data

	data.set({
     	employeId:employeId,
     	assetId:assetId,
     	assetType:assetType,
     	assetPermission:assetPermission,
     	allocationDate:allocationDate,
     	allocationExpireDate:allocationExpireDate,
     	allocatedBy:fid,
     	claimed:"false",
	});

	alert(`asset alloted to ${employeId} successfully.`);
	updateUserAssetAllocationStatusInOnboardData(employeId);
}

function updateUserAssetAllocationStatusInOnboardData(empId){
	firebase.database().ref('onboard_data').once('value',function(snapshot){
		//fetch the individual data from the snapshot.
		snapshot.forEach(function(childSnapshot){
			//fetch the id from database
			var dbid = childSnapshot.val().empId;
			console.log(dbid,empId);
			if (dbid == empId) {
				childSnapshot.ref.update({allocated:"true"});
				window.location.reload();
			}
		});

	});
}