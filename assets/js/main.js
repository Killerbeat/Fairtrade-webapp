// Created By Martijn Grul
// 2014 - Fairtrade Amsterdam

// Global variables

//map is used als id of the Google Maps object
var map;
//Load favorites array stored in localstorage
var favorites_list 	= localStorage.favorites? JSON.parse(localStorage.favorites) : [];
//List with all company categories
var categories 		= [];
//API url to main website
var api 			= "assets/php/dl.php?file=http://fairtradeamsterdam.nl";
//Google maps marker array
var allMarkers 		= [];

$(function(){

	// Search icon click
	$(".search").click(function(){
		$(".menu input").toggle().focus();
		if($("#search_results li").is(":visible")){
			$("#search_results li").hide();
		}else{
			$("#search_results li").show();
		}
	});

	// Show favorites page
	$("#map .favorite").click(function(){
		showPage(1);
	});

	//If a category is selected display markers from this category
	$(document).on("click", "#company_category li", function(){

		//Reset hover
		$("#company_category li").css("background-color", "none");

		//Loop all markers to find correct category
		for (var company in allMarkers) {

			//If all company's item is clicked, show all companies
			if($(this).attr("data-id") == "all"){
				allMarkers[company].setMap(map);

			//Else show only a specific category
			}else{

				//Category is not correct, hide marker
				if(allMarkers[company].company_cat !== $(this).attr("data-id")){
					allMarkers[company].setMap(null);

				//Else show marker
				}else{
					allMarkers[company].setMap(map);
				}

			}

			//Make item hover
			$(this).css("background-color", "rgba(255, 127, 0, 0.32)");
			//Hide menu
			$("#company_category").hide();

		}

	});


	// Show company when favorite company is clicked
	$(document).on("click", "#favorites h2", function(){
		showPage(2, parseInt($(this).attr("data-id")));
	});

	// Go to company in search results after click
	$(document).on("click", "#search_results li", function(){
		showPage(2, parseInt($(this).attr("data-id")));
	});


	// Back button from dynamic screen
	$(".back").click(function(){

		//Reset position pane
		$("#pane").css({"left": "0px"});

		//After sliding reset page
		setTimeout(function(){
			$("#company_decription").html("");
			$("#favorites ul").html("");
			$("#company_title").html("<h2>Laden...</h2>");
			$("#company_decription").html("<p>Pagina wordt geladen.</p>");
		}, 200);

	});

	// Show catagory list
	$("#company_category_button").click(function(){
		$("#company_category").toggle();

		if($("#company_category").is(":visible")){
			$("#company_category_button span").css("background-image", "url(assets/img/down.png)");
		}else{
			$("#company_category_button span").css("background-image", "url(assets/img/up.png)");
		}
	});

	// Search function
	$("#fairtrade_search").keyup(function(){
	   
	    var query = $(this).val();

	    if(query !== "") {

	    	//Get company list
		    $.post(api +"/api/companies?fields=id,name,address", function(data) {
		     	
		    	var search_data 	= jQuery.parseJSON(data);
		     	var results 		= [];		

		     	//Loop through items
			    for(var i=0;i<search_data.length;i++){

			    	//If value is in name add it to find array
			    	if(search_data[i].name.indexOf(query) != -1){

			    		var company_name = search_data[i].name.replace(query, "<span>"+ query +"</span>")

			    		results.push(Array(company_name, search_data[i].address, search_data[i].id));
			    	}

			    	//If value is in adress add it to find array
			    	if(search_data[i].address.indexOf(query) != -1){

			    		var company_name 	= search_data[i].name;
			    		var company_adress 	= search_data[i].address.replace(query, "<span>"+ query +"</span>")

			    		results.push(Array(company_name, company_adress, search_data[i].id));
			    	}

			    	//Maximum of five items
			    	if(i == 5){break}

			    }

			console.log(results);

			    if(results.length !== 0){

			    	$("#search_results").html("").show()

				    for(var hit in results){
				    	$("#search_results").append("<li data-id='"+ results[hit][2] +"'>"+ results[hit][0] +"<div>"+ results[hit][1] +"</div></li>");
				    }	

			    }else{
			    	$("#search_results").hide();
			    }

		    });

	    }else{
	    	$("#search_results").hide();
	    }

	});

	$("#city-map").height($(document).height() - 100);

	//Remove company from favorites
	$(document).on("click", "#favorites img", function(){

		$(this).attr("src", "assets/img/favorite_half.png")
		var index = favorites_list.indexOf($(this).attr("data-id"));

		if (index > -1) {
			favorites_list.splice(index, 1);
		   	$(this).parent().fadeOut(200, function(){
				$(this).remove();
			});
		}

	})

	//Check if company is favorite and change star image according
	$("#page .favorite").mouseup(function(){

		favorites_list.push($(this).attr("data-id"));

		favorites_list = favorites_list.filter(function(element, position) {
		    return favorites_list.indexOf(element) == position;
		})		

		if($(this).find("img").attr("src") == "assets/img/favorite.png"){
			$(this).find("img").attr("src", "assets/img/favorite_half.png");

			var index = favorites_list.indexOf($(this).attr("data-id"));

			if (index > -1) {
			    favorites_list.splice(index, 1);
			}

			//delete favorites_list[$(this).attr("data-id")];
		}else{
			$(this).find("img").attr("src", "assets/img/favorite.png");
		}

		localStorage.favorites = JSON.stringify(favorites_list)

	});

	loadCategories();

	createMap();

});

function showPage(id, place_id){

	//Page information
	var page_title 		= $("#page h1"),
		favorites 		= $("#favorites"),
		company 		= $("#company"),
		menu_favorite 	= $("#page .favorite"),
		company_title	= $("#company_title h2"),
		make_favorite	= $("#page .favorite");

	//Switch pages
	switch(id){

		//Favorites page
		case 1:
			page_title.html("Favorieten");
			company.hide();
			menu_favorite.hide();
			favorites.show();

			// Check if there are favorites
			if(Object.keys(favorites_list).length <= 0){
				$("#favorites").html("<p>Je hebt nog geen favorite Fairtrade winkels</p>");
			}else{

				$("#favorites").html("<ul></ul>");

				//Show favorites
				for (var star in favorites_list) {
					createFavorites(favorites_list[star]);
				}

			}

			//Add favorites to localstorage array
			localStorage.favorites = JSON.stringify(favorites_list)


		break;

		//Company page
		case 2:

			//Load company information with ID
			$.post(api +"/api/companies?id="+ place_id, function(data) {

				var company_content = jQuery.parseJSON(data);
					company_content	= company_content[0],
					company_bg		= "assets/img/default.png";

				//Check if company has a photo
				if(null != company_content.photo){
					company_bg = "http://fairtradeamsterdam.nl/uploads/companies/"+ company_content.photo;
				}

				//Fill page with info
				page_title.html("Fairtrade bedrijf");
				company_title.html(company_content.name);
				$("#company_title").css("background-image", "url("+ company_bg +")");
				make_favorite.attr("data-id", place_id);

				$("#company_decription").html(company_content.description);
				$("#company_minimap").css("background-image", "url('http://maps.googleapis.com/maps/api/staticmap?size=500x80&maptype=roadmap&zoom=15&markers=color:red%7C"+ company_content.lat
					+","+ company_content.lng +"&sensor=false')");
				$("#company_adress strong").html(company_content.address +"<br>"+ company_content.postal_code +" ");

				company.show();
				favorites.hide();
				menu_favorite.show();

				//Check if page is favorite
				for(var star in favorites_list){

					if(make_favorite.attr("data-id") == favorites_list[star]){
						$("#page .favorite img").attr("src", "assets/img/favorite.png");
						break;
					}else{
						$("#page .favorite img").attr("src", "assets/img/favorite_half.png");
					}

				}

				//Add to favorites
				localStorage.favorites = JSON.stringify(favorites_list);

			});

		break;

	}

	//Show dynamic page
	$("#pane").css({"left": "-100%"});

}

// Populate categories
function loadCategories(){

	//Load categories
	$.post(api +"/api/categories", function(data) {
		
		//Main json array
		var cats = jQuery.parseJSON(data);
		
		//Reset
		$("#company_category").html("");

		//Show all option
		$("#company_category").append('<li data-id="all">Geef alle bedrijven weer</li>');

		//Loop through items
		for (var item in cats) {

			//Add the item
			$("#company_category").append('<li data-id="'+ cats[item].id +'"><span style="background-color: '+ cats[item].color +';"></span>'+ cats[item].name +'</li>');
			categories[cats[item].id] = cats[item].color

		}

	});
}


// Populate favorite list
function createFavorites(id){

	//Load favorites
	$.post(api +"/api/companies?id="+ id, function(data) {

		//Favorite defaults and info
		var company_data 	= jQuery.parseJSON(data);
			company_data 	= company_data[0],
			company_bg		= "assets/img/default.png";

		//Check if company has a photo
		if(null != company_data.photo){
			company_bg = "http://fairtradeamsterdam.nl/uploads/companies/"+ company_data.photo;
		}

		//Create favorite item
		var favorite_li = '<li style="background-image: url('+ company_bg +')"><img src="assets/img/favorite.png" data-id="'+ id +'"><h2 data-id="'+ id +'">'+ company_data.name +'</h2></li>';

		//Add item
		$("#favorites ul").append(favorite_li);
	});


}


// Create google maps en populate it
function createMap(){

	//Marker location lat, lon
	var location;

	//Main map options
	var mapOptions = {
	    	zoom: 13,
	    	streetViewControl: false,
	    	mapTypeControl: false,
	   		center: new google.maps.LatLng(52.354900 , 4.911934),
	    	mapTypeId: google.maps.MapTypeId.ROADMAP
	  	};

	//Assign map object
	map = new google.maps.Map(document.getElementById('city-map'), mapOptions);

	//Load all companies
	$.post(api +"/api/companies", function(data) {

		var company_data = jQuery.parseJSON(data);

		//Fetch all companies
		$.each(company_data, function(key, company){

			//Create marker location
			location = new google.maps.LatLng(company.lat, company.lng);

			//Company marker options
			company_marker = new google.maps.Marker({
				position: location,
				map: map,
				icon: "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|"+ categories[company.category].substring(1)
			});

			//Assign ID & Category for later use
			company_marker.company_id 	= company.id;
			company_marker.company_cat 	= company.category;	

			//Create function for each marker click event
		    (function(company_marker, i) {

				google.maps.event.addListener(company_marker, 'click', function(data) {
			  		showPage(2, parseInt(company_marker.company_id));
				});

		    })(company_marker, key);

		    //Add marker to marker array
		    allMarkers.push(company_marker);

		});

	});

	// Create current position using geolocation
 	if(navigator.geolocation) {
 		
        GeoMarker = new GeolocationMarker();
        GeoMarker.setCircleOptions({fillColor: '#ff7f00'});

        google.maps.event.addListenerOnce(GeoMarker, 'position_changed', function() {});

        google.maps.event.addListener(GeoMarker, 'geolocation_error', function(err) {
          console.log("Error: " + err.message);
        });

        //Place current position on the map
        GeoMarker.setMap(map);
  	}



}
