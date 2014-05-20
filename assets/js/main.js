var map;
var favorites_list = localStorage.favorites? JSON.parse(localStorage.favorites) : [];

console.log(favorites_list);

$(function(){

	$(".search").click(function(){
		$(".menu input").toggle().focus();
		if($("#search_results li").is(":visible")){
			$("#search_results li").hide();
		}else{
			$("#search_results li").show();
		}
	});

	$("#map .favorite").click(function(){
		showPage(1);
	});

	$("#company_category li").click(function(){

		if($(this).attr("data-id", 4)){
			google.maps.Map.prototype.clearMarkers = function() {
			    for(var i=0; i < this.markers.length; i++){
			        this.markers[i].marker.setVisible(false);
			    }
			    this.markers = new Array();
			};
		}


	});

	$(document).on("click", "#favorites h2", function(){
		showPage(2, parseInt($(this).attr("data-id")));
	});

	$(document).on("click", "#search_results li", function(){
		showPage(2, parseInt($(this).attr("data-id")));
	});

	$(".back").click(function(){

		$("#pane").css({"left": "0px"});

		setTimeout(function(){
			$("#company_decription").html("");
			$("#favorites ul").html("");
			$("#company_title").html("<h2>Laden...</h2>");
			$("#company_decription").html("<p>Pagina wordt geladen.</p>");
		}, 200);

	});

	$("#company_category_button").click(function(){
		$("#company_category").toggle();

		if($("#company_category").is(":visible")){
			$("#company_category_button span").css("background-image", "url(assets/img/down.png)");
		}else{
			$("#company_category_button span").css("background-image", "url(assets/img/up.png)");
		}
	});

	$("#fairtrade_search").keyup(function(){
	   
	    var query = $(this).val();

	    if(query !== "") {

		    $.post("assets/php/dl.php?file=http://localhost/api/companies", function(data) {
		     	
		    	var search_data 	= jQuery.parseJSON(data);
		     	var results 		= [];		

			    for(var i=0;i<search_data.length;i++){

			    	if(search_data[i].name.indexOf(query) != -1){

			    		var company_name = search_data[i].name.replace(query, "<span>"+ query +"</span>")

			    		results.push(Array(company_name, search_data[i].address, search_data[i].id));
			    	}

			    	if(i == 1){break}

			    }

			    console.log(results.length);

			    if(results.length !== 0){

			    	$("#search_results").html("").show()

				    for(var hit in results){
				    	$("#search_results").append("<li data-id='"+ results[hit][2] +"'>"+ results[hit][0] +"<div>"+ results[hit][1] +"</div></li>");
				    }	

			    }else{
			    	$("#search_results").hide();
			    }

			    console.log(results);

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

		console.log(favorites_list);

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
		console.log(favorites_list);

	});

	createMap();

	loadCategories();
});

function showPage(id, place_id){

	var page_title 		= $("#page h1"),
		favorites 		= $("#favorites"),
		company 		= $("#company"),
		menu_favorite 	= $("#page .favorite"),
		company_title	= $("#company_title h2"),
		make_favorite	= $("#page .favorite");

	switch(id){

		//Favorites page
		case 1:
			page_title.html("Favorieten");
			company.hide();
			menu_favorite.hide();
			favorites.show();

			console.log(Object.keys(favorites_list).length);

			if(Object.keys(favorites_list).length <= 0){
				$("#favorites").html("<p>Je hebt nog geen favorite Fairtrade winkels</p>");
				console.log(Object.keys(favorites_list).length)
			}else{

				$("#favorites").html("<ul></ul>");

				for (var star in favorites_list) {
					console.log(star);

					createFavorites(favorites_list[star]);
				}

			}

			localStorage.favorites = JSON.stringify(favorites_list)


		break;

		//Company page
		case 2:

			console.log("assets/php/dl.php?file=http://localhost/api/companies?id="+ place_id);

			$.post("assets/php/dl.php?file=http://localhost/api/companies?id="+ place_id, function(data) {
				var company_content = jQuery.parseJSON(data);

				console.log(company_content);

				page_title.html("Fairtrade bedrijf");
				company_title.html(company_content.name);
				make_favorite.attr("data-id", place_id);

				$("#company_decription").html(company_content.description);
				$("#company_minimap").css("background-image", "url('http://maps.googleapis.com/maps/api/staticmap?size=500x80&maptype=roadmap&zoom=15&markers=color:red%7C"+ company_content.lat
					+","+ company_content.lng +"&sensor=false')");
				$("#company_adress strong").html(company_content.address +"<br>"+ company_content.postal_code +" ");

				company.show();
				favorites.hide();
				menu_favorite.show();

				for(var star in favorites_list){

					console.log(favorites_list[star], make_favorite.attr("data-id"));

					if(make_favorite.attr("data-id") == favorites_list[star]){
						$("#page .favorite img").attr("src", "assets/img/favorite.png");
						break;
						console.log("active");
					}else{
						$("#page .favorite img").attr("src", "assets/img/favorite_half.png");
						console.log("not active")
					}

				}

				localStorage.favorites = JSON.stringify(favorites_list);

			});

		break;

	}

	$("#pane").css({"left": "-100%"});

}

function loadCategories(){
	$.post("assets/php/dl.php?file=http://localhost/api/categories", function(data) {
		var cats = jQuery.parseJSON(data);
		$("#company_category").html("");

		$("#company_category").append('<li data-id="all">Geef alle bedrijven weer</li>');

		for (var item in cats) {
			console.log(cats[item]);
			$("#company_category").append('<li data-id="'+ cats[item].id +'"><span style="background-color: '+ cats[item].color +';"></span>'+ cats[item].name +'</li>');

		}
	});
}

function createFavorites(id){

	$.post("assets/php/dl.php?file=http://localhost/api/companies?id="+ id, function(data) {

		console.log("assets/php/dl.php?file=http://localhost/api/companies?id="+ id)
		var company_data = jQuery.parseJSON(data);

		console.log(company_data);
		
		var favorite_li = '<li style="background-image: url(assets/img/default.png)"><img src="assets/img/favorite.png" data-id="'+ id +'"><h2 data-id="'+ id +'">'+ company_data.name +'</h2></li>';

		$("#favorites ul").append(favorite_li);
	});


}

function createMap(){
	var location;

	var mapOptions = {
	    	zoom: 13,
	    	streetViewControl: false,
	    	mapTypeControl: false,
	   		center: new google.maps.LatLng(52.354900 , 4.911934),
	    	mapTypeId: google.maps.MapTypeId.ROADMAP
	  	};

	map = new google.maps.Map(document.getElementById('city-map'), mapOptions);

	$.post("assets/php/dl.php?file=http://localhost/api/companies?fields=true", function(data) {

		var company_data = jQuery.parseJSON(data);

		for (var i = 0; i < company_data.length; i++) {

			console.log(company_data[i]);
			location = new google.maps.LatLng(company_data[i].lat, company_data[i].lng);
			
			company_marker = new google.maps.Marker({
			  position: location,
			  map: map
		 	});

		 	company_marker.company_id = company_data[i].id;
	        
	        (function(company_marker, i) {

			  	google.maps.event.addListener(company_marker, 'click', function(data) {
		  			showPage(2, company_marker.company_id);
		  			console.log(company_marker.company_id)
			  	});

	        })(company_marker, i);

		}

	});

 	if(navigator.geolocation) {
 		
        GeoMarker = new GeolocationMarker();
        GeoMarker.setCircleOptions({fillColor: '#ff7f00'});

        google.maps.event.addListenerOnce(GeoMarker, 'position_changed', function() {
        });

        google.maps.event.addListener(GeoMarker, 'geolocation_error', function(e) {
          console.log('There was an error obtaining your position. Message: ' + e.message);
        });

        GeoMarker.setMap(map);
  	}



}
