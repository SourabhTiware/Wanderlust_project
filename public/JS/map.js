     mapboxgl.accessToken = mapToken;

    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v9', // Choose from mapbox core style, or make your own style wiht mapbox studio. 
        projection: 'globe', // Display the map as a globe, since satellite-v9 defaults to Mercator
        zoom: 9,
        center: listing.geometry.coordinates // starting postion [lan, lat]
        // center: [-74.5, 40],
    });


    const marker = new mapboxgl.Marker({color: "red"})
    .setLngLat(listing.geometry.coordinates)  // listing.geometry.coordinates
    .setPopup(
        new mapboxgl.Popup({offset: 25}).setHTML(
            `<h4> ${listing.title} </h4> <p>Exact location will be provied after booking complted </P>`)
        )
    .addTo(map);