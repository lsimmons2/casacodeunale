angular.module('profCtrl', [
	'tagsMod'
]).controller('ProfileController', function($scope, $http, userData, tags, $location, Upload){

	$scope.uploadImage = function(){
		var file = $scope.file;
		var fileLength = file.name.length;
		var username = $scope.userData.username;
		file.name = username + '_image' + file.name.slice((fileLength - 4), (fileLength));
		var postParams = {
			name: file.name,
			type: file.type
		}
		$http.post('/aws/signature', postParams)
		.then(function(data){
			var config = {
				headers: {
					'Content-Type': file.type//,
					//'x-amz-acl': 'id="xyz@amazon.com"'
				}
			};
			$http.put(data.data, file, config)
			.then(function(data){
			}, function(data){
			})
		}, function(data){
		})
	}

	$scope.userData = userData.profile;
	$scope.linkStatus = userData.linkStatus;
	$scope.skillsListTL = $scope.skillsListTO = tags;
	$scope.modified = false;
	angular.element('.basicInfoInput').keydown(function(event) {
        if (event.keyCode == 13) {
            angular.element('.basicInfoInput').submit();
            $scope.modified = true;
            return false;
        }
    });

	$scope.deleteUser = function(){
		$http.delete('/user')
		.then(function(data){
			$location.path('/');
		}, function(data){
			//$location.path('/home');
		});
	}


//=================General Info Buttons=================
//Not sure if this is the best way to do all this...
	$scope.showButtonsBasic = function() {
	    angular.element('.buttonBasic').css('display', 'inline');
	}
	$scope.hideButtonsBasic = function() {
	    angular.element('.buttonBasic').css('display', 'none');
	}
	$scope.showInputFirstName = function() {
		angular.element('#infoFirstName').css('display', 'none');
		angular.element('#firstNameEdit').css('display', 'inline');
	}
	$scope.hideInputFirstName = function() {
		angular.element('#infoFirstName').css('display', 'inline');
		angular.element('#firstNameEdit').css('display', 'none');
	}
	$scope.showInputLastName = function() {
		angular.element('#infoLastName').css('display', 'none');
		angular.element('#lastNameEdit').css('display', 'inline');
	}
	$scope.hideInputLastName = function() {
		angular.element('#infoLastName').css('display', 'inline');
		angular.element('#lastNameEdit').css('display', 'none');
	}
	$scope.showInputEmail = function() {
		angular.element('#infoEmail').css('display', 'none');
		angular.element('#emailEdit').css('display', 'inline');
	}
	$scope.hideInputEmail = function() {
		angular.element('#infoEmail').css('display', 'inline');
		angular.element('#emailEdit').css('display', 'none');
	}
	$scope.showInputBio = function() {
		angular.element('#infoBio').css('display', 'none');
		angular.element('#bioEdit').css('display', 'inline');
	}
	$scope.hideInputBio = function() {
		angular.element('#infoBio').css('display', 'inline');
		angular.element('#bioEdit').css('display', 'none');
	}



//=================Skills to Learn Buttons=================
	$scope.showSkillsTLEdit = function() {
	    angular.element('.buttonTL').css('display', 'inline');
	    angular.element('#profSkillTLInputHolder').css('min-height', '0px');
	}
	$scope.hideSkillsTLEdit = function() {
	    angular.element('.buttonTL').css('display', 'none');
	    angular.element('#profSkillTLInputHolder').css('min-height', '20px');
	}
	$scope.showSkillsTLInput = function() {
	    angular.element('#skillsTLInput').css('display', 'inline');
	    angular.element('#showSkillsTLInput').remove();
	    angular.element('#profSkillTLInputHolder').remove();
	}
	$scope.remSkillTL = function(place) {
	    $scope.userData.skillsTL.splice(place, 1);
	    $scope.modified = true;
	}



//=================Skills to Offer Buttons=================
	$scope.showSkillsTOEdit = function() {
	    angular.element('.buttonTO').css('display', 'inline');
	    angular.element('#profSkillTOInputHolder').css('min-height', '0px');
	}
	$scope.hideSkillsTOEdit = function() {
	    angular.element('.buttonTO').css('display', 'none');
	    angular.element('#profSkillTOInputHolder').css('min-height', '20px');
	}
	$scope.showSkillsTOInput = function() {
	    angular.element('#skillsTOInput').css('display', 'inline');
	    angular.element('#showSkillsTOInput').remove();
	    angular.element('#profSkillTOInputHolder').remove();
	}
	$scope.remSkillTO = function(place) {
	    $scope.userData.skillsTO.splice(place, 1);
	    $scope.modified = true;
	}



//=================Bio Buttons=================
	$scope.showBioEdit = function() {
	    angular.element('#bioEditButton').css('display', 'inline');
	}
	$scope.hideBioEdit = function() {
	    angular.element('#bioEditButton').css('display', 'none');
	}
	$scope.showBioInput = function() {
	    angular.element('#bioEditInput').css('display', 'inline');
	    angular.element('#infoBio').css('display', 'none');
	    angular.element('#bioEditButton').css('display', 'none');
	}
	$scope.hideBioInput = function() {
	    angular.element('#bioEditInput').css('display', 'none');
	    angular.element('#infoBio').css('display', 'inline');
	    angular.element('#bioEditButton').css('display', 'inline');
	}


	angular.element('#bioEditInput').keydown(function(event) {
        if (event.keyCode == 13) {
            angular.element('#bioEditInput').submit();
            $scope.modified = true;
            return false;
        }
    });



	$scope.updateUserData = function(){
		var userData = {
			'username' : $scope.userData.username,
			'firstName' : $scope.userData.firstName,
			'lastName' : $scope.userData.lastName,
			'email' : $scope.userData.email,
			'skillsTL' : $scope.userData.skillsTL,
			'skillsTO' : $scope.userData.skillsTO,
			'bio' : $scope.userData.bio
		}
		$http.put('/user', userData)
		.then(function(res){

		}, function(err){
		})
		angular.element('#updateButton').css('display', 'none');
		angular.element('#confirm').css('display', 'inline-block');

	}

	$scope.$on('$typeahead.select', function(event, value, index, elem){
		       if(elem.$id == 'skillsTOInput'){
			   $scope.userData.skillsTO.push(value);
			   $scope.userData.skillsTO.sort();
			   $scope.selectedSkillTO = '';
			   $scope.place = $scope.skillsListTO.indexOf(value);
			   $scope.skillsListTO.splice($scope.place, 1);
			   $scope.modified = true;
			       }
		       else if (elem.$id == 'skillsTLInput'){
			   $scope.userData.skillsTL.push(value);
			   $scope.userData.skillsTL.sort();
			   $scope.selectedSkillTL = '';
			   $scope.place = $scope.skillsListTL.indexOf(value);
			   $scope.skillsListTL.splice($scope.place, 1)
			   $scope.modified = true;
			       }
		       $scope.$digest();
		   });
    });
