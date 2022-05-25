define( ["qlik", "text!./template.html","css!./Styles.css"],
	function ( qlik, template ) {

		return {
			template: template,
			support: {
				snapshot: true,
				export: true,
				exportData: false
			},
			paint: function () {
				return qlik.Promise.resolve();co
			},
			controller: ['$scope', function ( $scope ) {

				var hRefMask = location.pathname.substring(0,location.pathname.indexOf('/sense/'));
				$.when(
					$.ajax({
						url: hRefMask + "/qps/user?xrfkey=GAMG717cpRsrx7xR",
						type: "GET",
						headers: {
							"X-Qlik-XrfKey":"GAMG717cpRsrx7xR"
						},
						error: function (error){
							console.log(error)
						}
					})
				).then(function(user){
					//console.log(user);
					var url = hRefMask + "/qrs/app/object/full?xrfkey=GAMG717cpRsrx7xR&filter=objectType eq 'bookmark' and app.published eq true and owner.userId eq '" + user.userId + "'&orderby=app.name";
					return $.ajax({
						url: url,
						type: "GET",
						headers: {
							"X-Qlik-XrfKey":"GAMG717cpRsrx7xR",
							"X-Qlik-User": user.userId
						},
						cache: true,
						complete: function(bookmarks){
							$scope.bookmarks = bookmarks;
						},
						error: function(err){
							console.log('Error: ', err);
						}
					})
				});

				//onchange handles when a value is selected in the dropdown
				qlikExtBookmarks.onchange = function navigateBookmark(){
				
					//get dropdown selection, split value to create array with [0] app ID & [1] Bookmark Engine ID
					var selectBox = document.getElementById("qlikExtBookmarks");
					var selectedValue = selectBox.options[selectBox.selectedIndex].value.split('|');
					
					//next series of commands is to retrieve a sheet from the app with the bookmark. Any sheet works; the referenced bookmark will force navigation to the appropriate sheet.
					$.ajax({
						url: hRefMask + "/qrs/app/object/full?xrfkey=GAMG717cpRsrx7xR&filter=objectType eq 'sheet' and published eq true and app.id eq "+selectedValue[0],
						type: "GET",
						headers: {
							"X-Qlik-XrfKey":"GAMG717cpRsrx7xR"
						},
					success: function (sheets){
					
						//build myRef url with random 1st sheet & navigate to URL in new tab
						var myRef = location.href.substring(0,location.href.indexOf('app/'));
						myRef += 'app/' + selectedValue[0] + '/sheet/' + sheets[0].engineObjectId + '/state/analysis/bookmark/' + selectedValue[1];
						window.open(myRef,'_blank');
					},
					error: function (error){
						console.log(error)
						}
					});//*/
					
				};
				$scope.html = "Choose bookmark";
				console.log($scope.html);
			}]
		};

	} );

