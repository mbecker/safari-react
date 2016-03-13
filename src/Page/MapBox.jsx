import React from "react";
import '../lib/events.js';
import '../lib/leaflet-panel-layers.js';

var Firebase = require('firebase');
const FireBaseRef = new Firebase("https://safaridigital.firebaseio.com/maps/addo");
var geoFire = new GeoFire(FireBaseRef);



export class MapBox extends React.Component {
    constructor() {
        super();
        this.handleResize = this.handleResize.bind(this);
        this.headerHeight;
        this.footerHeight;
        this.state = {
            mapHeight: window.innerHeight - 60
        };
    };

    componentDidMount() {
        window.addEventListener("optimizedResize", this.handleResize);
        setTimeout(() => {
            // this.headerHeight = document.getElementById('header2').offsetHeight;
            this.setState({
                mapHeight: window.innerHeight - 60
            });
        });

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
        var overlayMaps = {
            "Lions": lions,
            "Bisons": bisons,
            'Addo Elephant Park': L.mapbox.tileLayer('mbecker.pb4jgb7h')
        };


        // Create a map in the div #map
        var map = L.mapbox.map('map', '', {
            zoomControl: false
        }).setView(geoLocation, 12);

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
    }

    componentWillUnmount() {
        window.removeEventListener('optimizedResize', this.handleResize);
    }

    handleResize(e) {
        // this.headerHeight = document.getElementById('header2').offsetHeight;
        this.setState({
            mapHeight: window.innerHeight - 60
        });
    }

    render() {
        const styleA = {

            background: 'red',
            marginTop: 0,
            padding: '0px!important',
            height: this.state.mapHeight,
            height: 200

        }
        let classMap = {
            height: this.state.mapHeight,
            textDecoration: 'none'
        }
        return (
            <div ref="map" id="map" style={ classMap }>
            </div>
            );
    }
}