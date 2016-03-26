import React from "react";

import '../lib/leaflet-panel-layers.js';

export class MapBox extends React.Component {
    constructor() {
        super();
    };

    componentDidMount() {


        // Provide your access token
        L.mapbox.accessToken = 'pk.eyJ1IjoibWJlY2tlciIsImEiOiJjaWt2MDZxbDkwMDFzd3ptNXF3djVhYW42In0.9Lavn2fn_0tg-QVrPhwEzA';
        // mapbox: //styles/mbecker/cilfmavza004qcykv7rasi2w3


        // Markers
        var geoLocation = [-33.443899, 25.745934];
        var lion1 = L.marker([-33.46128, 25.75002]).bindPopup('Lion 1'),
            lion2 = L.marker([-33.46980, 25.43577]).bindPopup('Lion 2'),
            lion3 = L.marker([-33.47818, 25.74221]).bindPopup('Lion 3'),
            lion4 = L.marker([-33.48632, 25.36254]).bindPopup('Lion 4');

        var bisons = L.circle([-33.49176, 25.77504], 500, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5
        }).bindPopup('Bison Group');

        var lions1 = L.layerGroup([lion1, lion2, lion3, lion4]);
        var bisons1 = L.circle([-33.49176, 25.77504], 500, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5
        }).bindPopup('Bison Group');

        var lions = L.layerGroup([lion1, lion2, lion3, lion4]);
        let animals = [];
        let animalgroup = new L.layerGroup();

        var overlayMaps = {
            "Lions": lions,
            "Bisons": bisons,
            'Addo Elephant Park': L.mapbox.tileLayer('mbecker.pb4jgb7h')
        };


        // Create a map in the div #maplayer
        var map = L.mapbox.map('maplayer', '', {
            zoomControl: false
        });

        new L.Control.Zoom({
            position: 'bottomleft'
        }).addTo(map);

        // L.control.layers({
        //     'Mapbox Streets': L.mapbox.tileLayer('mapbox.streets').addTo(map),
        //     'Mapbox Light': L.mapbox.tileLayer('mapbox.light'),
        //     'Satelitte': L.mapbox.tileLayer('mapbox.streets-satellite')

        // }, overlayMaps).addTo(map);


        var baseLayers = [
            {
                group: "Free Maps",
                layers: [
                    {
                        active: true,
                        name: "Mapbox Streets",
                        layer: L.mapbox.tileLayer('mapbox.streets'),
                        map: true
                    }
                ]
            },
            {
                group: "Paid Maps",
                layers: [
                    {
                        name: "Mapbox Light",
                        layer: L.mapbox.tileLayer('mapbox.light'),
                        map: true,
                        visible: false
                    }
                ]
            }
        ];


        var overLayers = [
            {
                group: "All Animals",
                layers: [
                    {
                        active: true,
                        name: "Animals",
                        layer: animalgroup,
                        map: false
                    },
                    {
                        active: true,
                        name: "Lions",
                        layer: lions1,
                        map: false
                    },
                    {
                        name: "Bisons",
                        layer: bisons1,
                        map: false,
                        visible: false
                    }
                ]
            },
            {
                group: "Lions",
                layers: [
                    {
                        name: "Lions",
                        layer: lions,
                        map: false,
                        visible: false
                    }
                ]
            },
            {
                group: "Bisons",
                layers: [
                    {
                        name: "Bisons",
                        layer: bisons,
                        map: false,
                        visible: false
                    }
                ]
            }


        ];

        var panelLayers = new L.Control.PanelLayers(baseLayers, overLayers, {
            collapsed: true
        });


        map.addControl(panelLayers);

        L.mapbox.featureLayer(
            {
                "type": "FeatureCollection",
                "features": [
                    {
                        "type": "Feature",
                        "properties": {
                            title: 'Peregrine Espresso',
                            description: '1718 14th St NW, Washington, DC',
                            // one can customize markers by adding simplestyle properties
                            // https://www.mapbox.com/guides/an-open-platform/#simplestyle
                            'marker-size': 'large',
                            'marker-color': '#42a2e1',
                            'marker-symbol': 'star'
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                25.763626098632812,
                                -33.44003646532444
                            ]
                        }
                    }
                ]
            }).addTo(map);

        // GeoFire
        const FireBaseRef = new Firebase("https://safaridigital.firebaseio.com/maps/addo");
        var geoFire = new GeoFire(FireBaseRef);

        geoFire.get("center").then(function(location) {
            if (location === null) {
                console.log("Provided key is not in GeoFire");
                geoFire.set("center", [-33.551696, 25.806198]).then(function(location) {
                    console.log("Provided key has been added to GeoFire:" + location);
                }, function(error) {
                    console.log("Error: " + error);
                });
            } else {
                console.log("Provided key has a location of " + location);
                map.setView(location, 12);
            }
        }, function(error) {
            console.log("Error: " + error);
        });


        // console.log("Generated key from push: " + newPostRef.key());

        map.on('click', function(e) {
            // Add new position to database
            // var newGeoPosition = [e.latlng.lat, e.latlng.lng];
            // geoFire.push(newGeoPosition).then(function(location) {
            //     alert("GeoPosition added: " + newGeoPosition);
            // });
        });

        // Get time
        var offsetRef = new Firebase("https://safaridigital.firebaseio.com/.info/serverTimeOffset");
        offsetRef.on("value", function(snap) {
            console.log("TIME");
            var offset = snap.val();
            console.log(snap);
            console.log(offset);
            var estimatedServerTimeMs = new Date().getTime() + offset;
            console.log(estimatedServerTimeMs);
            var minute = estimatedServerTimeMs - 1000 * 60 * 60 * 24 * 7;
            console.log(minute);

            FireBaseRef.orderByChild("timestamp").startAt(minute).on("child_added", function(snapshot) {
                console.log("Added to map: " + snapshot.val().timestamp);
                var date = new Date(snapshot.val().timestamp * 1000);
                var timestamp = new Date(snapshot.val().timestamp * 1000);
                // var date = timestamp + 1000 * 60 * 60 * 24 *7;
                var content = '<h2>A ferry ride!<\/h2>' +
                    '<p>Start at: ' + date + '<br \/>' +
                    'Time:  ' + timestamp + '<\/p>';

                animalgroup.addLayer(L.marker(snapshot.val().l).bindPopup(content));

                console.log(animalgroup)
            });

        });
    }

    componentWillUnmount() {
    }



    render() {
        let classMap = {
            height: '100%',
            textDecoration: 'none'
        }
        return (
            <div>
              <div className="visible-sm visible-md visible-lg col-fixed-250 map-column stage-shelf stage-shelf-right hidden">
                <ul className="nav nav-bordered nav-stacked">
                  <li className="nav-header">Examples</li>
                  <li className="active">
                    <a href="index.html">Startup</a>
                  </li>
                  <li>
                    <a href="minimal/index.html">Minimal</a>
                  </li>
                  <li>
                    <a href="bold/index.html">Bold</a>
                  </li>
                  <li className="nav-divider"></li>
                  <li className="nav-header">Docs</li>
                  <li>
                    <a href="docs/index.html">Toolkit</a>
                  </li>
                  <li>
                    <a href="http://getbootstrap.com">Bootstrap</a>
                  </li>
                  <li className="nav-divider"></li>
                  <li className="nav-header">Live @Addo</li>
                  <li>
                    <a href="docs/index.html">Toolkit</a>
                  </li>
                  <li>
                    <a href="http://getbootstrap.com">Bootstrap</a>
                  </li>
                </ul>
              </div>
              <div className="col-xs-12 col-offset-250 map-column" ref="map" id="maplayer" style={ classMap }>
              </div>
            </div>
            );
    }
}