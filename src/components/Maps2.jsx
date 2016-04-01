import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import * as actions from './../reducer/actions';

import { MapBox } from './../Page'
import '../lib/events.js';
import { toggle } from './../lib/helper';
import { SettingsLayer } from '../lib/leaflet-settingslayer.js';

var Carousel = require('nuka-carousel');

var update = require('react-addons-update');

const position = [51.505, -0.09];

const FireBaseRef = new Firebase("https://safaridigital.firebaseio.com/maps/addo");
const geoFire = new GeoFire(FireBaseRef);

const minInMs = 60000;
const hourInMs = 3600000;
const dayInMs = 86400000;
const weekInMs = dayInMs * 7;
const monthInMs = weekInMs * 30;

// Provide your access token
L.mapbox.accessToken = 'pk.eyJ1IjoibWJlY2tlciIsImEiOiJjaWt2MDZxbDkwMDFzd3ptNXF3djVhYW42In0.9Lavn2fn_0tg-QVrPhwEzA';
var map = new Object();

export const Maps2 = React.createClass({
    mixins: [PureRenderMixin, ReactFireMixin],
    getInitialState() {
        this._map = new Object();
        return {
            mapHeight: window.innerHeight,
            tabs: [],
            tabContent: [],
            geopositions: [],
            selectedItem: 1,
            markertext: 'Spot an animal'
        };
    },
    componentWillMount: function() {
        const guessedServerTimeMs = new Date().getTime() - hourInMs;
        FireBaseRef.orderByChild("timestamp").startAt(guessedServerTimeMs).on("child_added", (snapshot) => {
            var date = new Date(snapshot.val().timestamp / 1000);
            var timestamp = new Date(snapshot.val().timestamp / 1000);
            // var date = timestamp + 1000 * 60 * 60 * 24 *7;
            var content = '<h2>A ferry ride!<\/h2>' +
                '<p>Start at: ' + date + '<br \/>' +
                'Time:  ' + timestamp + '<\/p>';

            // Object snapshot.val()
                // g:"kd4359x9xc"
                // l:Array[2]
                //     0:-33.56571442090888
                //     1:25.828514099121094
                // timestamp:1458745309708    

            var newArray = update(this.state.geopositions, {
                $unshift: [snapshot.val()]
            })
            this.setState({
                geopositions: newArray
            });
        });
    },
    componentWillUnmount() {
        window.removeEventListener('optimizedResize', this.handleResize);
    },
    componentDidMount: function() {
        window.addEventListener("optimizedResize", this.handleResize);
        setTimeout(() => {
            // this.headerHeight = document.getElementById('header2').offsetHeight;
            this.setState({
                mapHeight: window.innerHeight
            });
        });

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
        map = L.mapbox.map('maplayer', '', {
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
                    },

                    {
                        name: "Addo Park",
                        layer: L.mapbox.styleLayer('mapbox://styles/mbecker/cim9m5qa2007jadlzighrier4'),
                        map: true,
                        visible: false,
                        active: false
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

        // var panelLayers = new L.Control.PanelLayers(baseLayers, overLayers, {
        //     collapsed: true
        // });


        // map.addControl(panelLayers);

        new SettingsLayer(map, this.refs.mapsettings, this.refs.animalsettings, baseLayers, overLayers);

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


        // Center map
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

        // Set marker on map
        // endAt: Begin wit time x
        // startAt: End with time x+time
        var offsetRef = new Firebase("https://safaridigital.firebaseio.com/.info/serverTimeOffset");
        offsetRef.on("value", function(snap) {
            var offset = snap.val();
            var estimatedServerTimeMs = new Date().getTime() + offset;
            FireBaseRef.orderByChild("timestamp").startAt(estimatedServerTimeMs - (24 * hourInMs)).endAt(estimatedServerTimeMs - (1 * minInMs)).on("child_added", function(snapshot) {
                var date = new Date(snapshot.val().timestamp / 100);
                var timestamp = snapshot.val().timestamp;
                var content = `<h1>Timestamp ${timestamp}</h1>
                <p>Date: ${new Date(timestamp)}</p>`;
                animalgroup.addLayer(L.marker(snapshot.val().l).bindPopup(content));
            });


            FireBaseRef.orderByChild("timestamp").startAt(estimatedServerTimeMs).on("child_added", function(snapshot) {
                var date = new Date(snapshot.val().timestamp / 100);
                var timestamp = snapshot.val().timestamp;
                var content = `<h2>A ferry ride!</h2>
                <p>Date: ${new Date(timestamp)}</p>
                <p>Timestamp ${timestamp}</p>`;
                animalgroup.addLayer(L.marker(snapshot.val().l).bindPopup(content));
            });
        });


    },
    handleResize(e) {
        this.setState({
            mapHeight: window.innerHeight
        });
    },
    handleSidebar(e) {
        // click on this link will cause ONLY child alert to fire
        e.stopPropagation();
        // stop default action of link
        e.preventDefault();
        toggle(this.refs.btnleft, 'stage-toggle-active');
        this.refs.sidebar.scrollTop = 0;
        toggle(this.refs.sidebar, 'hidden');
        toggle(this.refs.stage, 'stage-open');
        toggle(this.refs.stage, 'stage-open-left');
    },
    handleRightSidebar(e) {
        // click on this link will cause ONLY child alert to fire
        e.stopPropagation();
        // stop default action of link
        e.preventDefault();
        toggle(this.refs.btnright, 'stage-toggle-active');
        this.refs.rightsidebar.scrollTop = 0;
        toggle(this.refs.rightsidebar, 'hidden');
        toggle(this.refs.stage, 'stage-open');
        toggle(this.refs.stage, 'stage-open-right');
    },
    toggleSettingsPanel(e) {
        // click on this link will cause ONLY child alert to fire
        e.stopPropagation();
        // stop default action of link
        e.preventDefault();

        this.setState({
            selectedItem: e.currentTarget.dataset.id
        });
    },
    closeBlock(e) {
        // click on this link will cause ONLY child alert to fire
        e.stopPropagation();
        // stop default action of link
        e.preventDefault();

        this.refs.block.style.display = "none";
    },
    handleMarker(e) {
        // click on this link will cause ONLY child alert to fire
        e.stopPropagation();
        // stop default action of link
        e.preventDefault();
        if (L.DomUtil.hasClass(this.refs.marker, 'map-pointer-active')) {
            L.DomUtil.removeClass(this.refs.marker, 'map-pointer-active');
            this.setState({
                markertext: 'Spot an animal'
            });

            map.off('click', this.handleMapClick);
        } else {
            L.DomUtil.addClass(this.refs.marker, 'map-pointer-active');
            this.setState({
                markertext: 'Click on map'
            });
            map.on('click', this.handleMapClick);
        }
    },
    handleMapClick(e) {
        var newGeoPosition = [e.latlng.lat, e.latlng.lng];
        geoFire.push(newGeoPosition).then(function(location) {});
        map.off('click', this.handleMapClick);

        L.DomUtil.removeClass(this.refs.marker, 'map-pointer-active');
        this.setState({
            markertext: 'Spot an animal'
        });
    },
    render() {
        let mapHeight = {
            height: this.state.mapHeight,
            cursor: this.state.markertext == "Click on map" ? "crosshair" : ""
        };
        return (
            <div>
              <div className="stage-shelf hidden" id="sidebar" ref="sidebar">
                <ul className="nav nav-bordered nav-stacked">
                  <li className="nav-header">Examples</li>
                  <li>
                    <a href="../index.html">Startup</a>
                  </li>
                  <li>
                    <a href="../minimal/index.html">Minimal</a>
                  </li>
                  <li>
                    <a href="../bold/index.html">Bold</a>
                  </li>
                  <li className="nav-divider"></li>
                  <li className="nav-header">Docs</li>
                  <li className="active">
                    <a href="../docs/index.html">Toolkit</a>
                  </li>
                  <li>
                    <a href="http://getbootstrap.com">Bootstrap</a>
                  </li>
                </ul>
              </div>
              <div className="stage-shelf stage-shelf-right hidden" id="rightsidebar" ref="rightsidebar">
                <div className="map-nav-container ">
                  <ul className="map-nav-list nav nav-tabs clearfix" id="mapsettings">
                    <li className={ this.state.selectedItem == 1 ? "active" : null }>
                      <a href="#" data-id="1" onClick={ this.toggleSettingsPanel }>Maps</a>
                    </li>
                    <li className={ this.state.selectedItem == 2 ? "active" : null }>
                      <a href="#" data-id="2" onClick={ this.toggleSettingsPanel }>Animals</a>
                    </li>
                  </ul>
                  <ul ref="mapsettings" className={ this.state.selectedItem == 1 ? "nav nav-bordered nav-stacked show" : "nav nav-bordered nav-stacked hidden" }>
                  </ul>
                  <ul ref="animalsettings" className={ this.state.selectedItem == 2 ? "nav nav-bordered nav-stacked show" : "nav nav-bordered nav-stacked hidden" }>
                  </ul>
                </div>
              </div>
              <div className="stage" id="app-stage" ref="stage">
                <button ref="btnleft" className="btn btn-link stage-toggle" data-target="#app-stage" data-toggle="stage" onClick={ this.handleSidebar }>
                  <span className="icon icon-menu stage-toggle-icon"></span> Menu
                </button>
                <button ref="btnright" className="btn btn-link stage-toggle stage-toggle-right" data-target="#app-stage" data-toggle="stage" onClick={ this.handleRightSidebar }>
                  <span className="icon icon-menu stage-toggle-icon"></span> Map
                </button>
                <button ref="marker" className="btn btn-link stage-toggle stage-toggle-left-bottom map-pointer" data-target="#app-stage" data-toggle="stage" onClick={ this.handleMarker }>
                  <span className="icon icon-location-pin stage-toggle-icon"></span>
                  { this.state.markertext }
                </button>
                <div className="row livespots">
                  <div className="col-md-12">
                    <div className="panel panel-bold panel-info">
                      <Carousel className="panel-body">
                        { this.state.geopositions.map((result) => {
                              return <ListItemWrapper key={ result.g } data={ result } />;
                          }) }
                      </Carousel>
                    </div>
                  </div>
                </div>
                <div className="container docs-content block block-inverse text-center" id="maplayer" style={ mapHeight }>
                  <div className="block-foreground" ref="block">
                    <h1 className="block-title">Login or Register</h1>
                    <h4 className="text-muted">Use block-background to integrate interactive backgrounds.</h4>
                    <button className="btn btn-default btn-outline m-t" onClick={ this.closeBlock }>Login / Register</button>
                  </div>
                </div>
              </div>
            </div>



        )
    }
})

function mapStateToProps(state, ownProps) {
    return {
    };
}
export default connect(
    mapStateToProps,
    actions
)(Maps2);

var ListItemWrapper = React.createClass({

    setMapCenter(e) {
        // click on this link will cause ONLY child alert to fire
        e.stopPropagation();
        // stop default action of link
        e.preventDefault();
        map.panTo(new L.LatLng(this.props.data.l[0], this.props.data.l[1]));
    },
    render: function() {
        return <div className="livespots-item" style={{background: 'url(http://media1.santabanta.com/full1/Animals/Elephants/elephants-9a.jpg)', backgroundSize: 'cover' }} onClick={ this.setMapCenter }>
                 
                                   <h1 style={{margin: 0}}>{this.props.data.l[0]}</h1>
                                </div>;
    }
});