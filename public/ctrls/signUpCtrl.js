angular.module('signUpCtrl', ['mgcrea.ngStrap']).controller('SignUpController', function($scope, $location, $http, tags){

	/*	$scope.skillsListTO = [".htaccess", ".net", "actionscript-3", "ajax", "algorithm",
	 "android", "angularjs", "apache", "api", "arrays", "asp.net",
	  "asp.net-mvc", "bash", "c", "c#", "c++", "class", "codeigniter",
	   "cordova", "css", "css3", "database", "django", "eclipse",
	    "entity-framework", "excel", "excel-vba", "facebook", "file",
	     "forms", "function", "git", "google-chrome", "google-maps",
	      "hibernate", "html", "html5", "image", "ios", "iphone",
	       "java", "javascript", "jquery", "json", "jsp", "laravel",
	        "linq", "linux", "list", "matlab", "maven", "mongodb",
	         "multithreading", "mysql", "node.js", "objective-c",
	          "oracle", "osx", "performance", "perl", "php",
	           "postgresql", "python", "python-2.7", "qt", "r", "regex",
	            "rest", "ruby", "ruby-on-rails", "ruby-on-rails-3",
	             "scala", "shell", "sockets", "spring", "sql",
	              "sql-server", "sql-server-2008", "sqlite", "string",
	               "swift", "swing", "symfony2", "twitter-bootstrap",
	                "uitableview", "unit-testing", "validation", "vb.net",
	                 "vba", "visual-studio", "visual-studio-2010", "wcf",
	                  "web-services", "windows", "winforms", "wordpress",
	                  "wpf", "xaml", "xcode", "xml"];

	$scope.skillsListTL = [".htaccess", ".net", "actionscript-3", "ajax", "algorithm",
	 "android", "angularjs", "apache", "api", "arrays", "asp.net",
	  "asp.net-mvc", "bash", "c", "c#", "c++", "class", "codeigniter",
	   "cordova", "css", "css3", "database", "django", "eclipse",
	    "entity-framework", "excel", "excel-vba", "facebook", "file",
	     "forms", "function", "git", "google-chrome", "google-maps",
	      "hibernate", "html", "html5", "image", "ios", "iphone",
	       "java", "javascript", "jquery", "json", "jsp", "laravel",
	        "linq", "linux", "list", "matlab", "maven", "mongodb",
	         "multithreading", "mysql", "node.js", "objective-c",
	          "oracle", "osx", "performance", "perl", "php",
	           "postgresql", "python", "python-2.7", "qt", "r", "regex",
	            "rest", "ruby", "ruby-on-rails", "ruby-on-rails-3",
	             "scala", "shell", "sockets", "spring", "sql",
	              "sql-server", "sql-server-2008", "sqlite", "string",
	               "swift", "swing", "symfony2", "twitter-bootstrap",
	                "uitableview", "unit-testing", "validation", "vb.net",
	                 "vba", "visual-studio", "visual-studio-2010", "wcf",
	                  "web-services", "windows", "winforms", "wordpress",
	                  "wpf", "xaml", "xcode", "xml"];	                  */
	$scope.skillsListTL = [];
        for (var i = 0; i < tags.items.length; i++) {
                $scope.skillsListTL[i] = tags.items[i].name;
        }
	$scope.skillsListTO = [];
        for (var i = 0; i < tags.items.length; i++) {
                $scope.skillsListTO[i] = tags.items[i].name;
        }
        $scope.skillsListTL.sort();
        $scope.skillsListTO.sort();
        console.log($scope.skillsList);
	$scope.firstName = '';
	$scope.lastName = '';
	$scope.userID = '';
	$scope.email = '';
	$scope.bio = '';
	$scope.avatar = '';

	$scope.selectedSkillTO = '';
	$scope.selectedSkillsTO = [];
	$scope.selectedSkillTL = '';
	$scope.selectedSkillsTL = [];
	$scope.$on('$typeahead.select', function(event, value, index, elem){
	        if(elem.$id == 'skillsTO'){
	        	$scope.selectedSkillsTO.push(value);
	        	$scope.selectedSkillTO = '';
	        	$scope.place = $scope.skillsListTO.indexOf(value);
	        	$scope.skillsListTO.splice($scope.place, 1)
	        }
	        else{
	        	$scope.selectedSkillsTL.push(value);
	        	$scope.selectedSkillTL = '';
	        	$scope.place = $scope.skillsListTL.indexOf(value);
	        	$scope.skillsListTL.splice($scope.place, 1)
	        }
	       	$scope.$digest();
	});
	$scope.remSkillTL = function(place) {
		$scope.skillsListTL.push($scope.selectedSkillsTL[place]);
		$scope.selectedSkillsTL.splice(place, 1);
		$scope.selectedSkillsTL.sort()
	}
	$scope.remSkillTO = function(place) {
		$scope.skillsListTO.push($scope.selectedSkillsTO[place]);
		$scope.selectedSkillsTO.splice(place, 1);
		$scope.selectedSkillsTO.sort()
	}


	$scope.sendUserData = function(){
		var userData = JSON.stringify({
			'firstName': $scope.firstName,
			'lastName': $scope.lastName,
			'userID': $scope.userID,
			'email': $scope.email,
			'skillsTO': $scope.selectedSkillsTO,
			'skillsTL': $scope.selectedSkillsTL,
			'bio': $scope.bio,
			'avatar': $scope.avatar
		    });
		//console.log(userData);
			$http.post('/users', userData)
			.success(function(data){
				//$scope.status = 'We\'ll notify you when the site is up and running!';
				$location.path('/signedUp');
			})
			.error(function(data){
				console.log('Error: ' + data.body)
				});
		console.log('valid');
		    /*	    else{
		console.log('Please make sure you have entered a valid email address');
		}
	    var answer=this.email.$valid;
	    console.log(answer);
	    };
	    $scope.submitUserData = function(data){*/
	    /*if(data.$valid){
		console.log('valid');
	    }
	    else{
		console.log('invalid');
		}*/
	};


});




