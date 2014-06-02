<!doctype html>
<html lang="en">
<head>
	
	<!-- correct mobile tags -->
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, user-scalable=no">
	<meta name="apple-mobile-web-app-capable" content="yes">

	<title>Fairtrade Amsterdam</title>

	<link href="assets/css/style.css" rel="stylesheet" >

	<!-- including libraries -->
	<script src="https://maps.googleapis.com/maps/api/js?v=3.exp&amp;sensor=false"></script>
	<script src="http://google-maps-utility-library-v3.googlecode.com/svn/trunk/geolocationmarker/src/geolocationmarker-compiled.js"></script>
	
	<script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>
	
	<!-- main functions script-->
	<script src="assets/js/main.js"></script>

</head>
<body id="main">

	<!-- main container -->
	<section id="app">

		<section id="main">

			<!-- sliding pane for transitions -->
			<section id="pane">
				
				<!-- mappage -->
				<article id="map">

					<header>
						<h1>Fairtrade Amsterdam</h1>

						<div class="menu">
							<div class="favorite"><img src="assets/img/favorite.png"></div>
							<input type="text" placeholder="Zoek Fairtrade..." id="fairtrade_search">
							<div class="search"><img src="assets/img/search.png"></div>
						</div>
							
					</header>

					<ul id="search_results">
					</ul>

					<section id="city-map"></section>

					<footer>

						<ul id="company_category">
							<li>Laden...</li>
						</ul>

						<div id="company_category_button">
							<span>Soort winkel</span>
						</div>

					</footer>

				</article>

				<!-- dynamic page -->
				<article id="page">

					<header>
						<h1>Fairtrade Amsterdam</h1>

						<div class="menu">
							<div class="back"><img src="assets/img/back.png"></div>
							<div class="favorite"><img src="assets/img/favorite_half.png"></div>
						</div>
							
					</header>

					<section id="company">
						<div id="company_title" style="background-image: url('assets/img/default.png')">
							<h2>Laden...</h2>
						</div>

						<div id="company_decription">
							<p>Pagina wordt geladen.</p>
						</div>

						<div id="company_minimap" style="background-image: ; background-position: center;height: 75px;"></div>

						<p id="company_adress"><strong></strong></p>

					</section>

					<section id="favorites">
						<ul></ul>
					</section>

				</article>

			</section>

		</section>
	</section>
</body>
</html>