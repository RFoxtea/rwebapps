//Rotates text of an element over an array of possible values.
var nextText = function(element, textArray) {
	element.innerHTML = textArray[(textArray.indexOf(element.innerHTML) + 1) % (textArray.length)];
}

var siteListApp = angular.module('siteList', []);

siteListApp
	.controller('siteListCtrl', function ($scope, $http){
		$http.get('sitelist.json').success(function(data) {
		$scope.sitelist = data;
		});
	});