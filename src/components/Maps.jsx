import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import * as actions from './../reducer/actions';

import { MapBox } from './../Page'
import '../lib/events.js';
import { toggle } from './../lib/helper';
import { SettingsLayer } from '../lib/leaflet-settingslayer.js';

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

export const Maps = React.createClass({
    mixins: [PureRenderMixin, ReactFireMixin],
    getInitialState() {
        this._map = new Object();
        return {
            mapHeight: window.innerHeight,
            tabs: [],
            tabContent: [],
            geopositions: [],
            selectedItem: 0
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
            var newGeoPosition = [e.latlng.lat, e.latlng.lng];
            geoFire.push(newGeoPosition).then(function(location) {
                //alert("GeoPosition added: " + newGeoPosition);
                //console.log(location);

            });
        });



        // Get time
        var offsetRef = new Firebase("https://safaridigital.firebaseio.com/.info/serverTimeOffset");
        offsetRef.on("value", function(snap) {
            // console.log("TIME");
            var offset = snap.val();
            // console.log(snap);
            // console.log(offset);
            var estimatedServerTimeMs = new Date().getTime() + offset;
            console.log(estimatedServerTimeMs);
            var minute = estimatedServerTimeMs - 1000 * 60 * 60 * 24 * 7;
            // console.log(minute);
            FireBaseRef.orderByChild("timestamp").startAt(minute).on("child_added", function(snapshot) {
                //console.log("Added to map: " + snapshot.val().timestamp);
                var date = new Date(snapshot.val().timestamp / 100);
                var timestamp = snapshot.val().timestamp;
                // var date = timestamp + 1000 * 60 * 60 * 24 *7;
                var content = `<p>Timestamp ${timestamp}</p>
                <p>Date: ${new Date(timestamp)}</p>`;

                animalgroup.addLayer(L.marker(snapshot.val().l).bindPopup(content));

            // console.log(animalgroup)
            });



        });
    },
    handleResize(e) {
        // this.headerHeight = document.getElementById('header2').offsetHeight;
        this.setState({
            mapHeight: window.innerHeight
        });
        if (window.innerWidth > 768) {
            L.DomUtil.removeClass(this.refs.sidebar, 'sidebar-visible');
            L.DomUtil.removeClass(this.refs.maprow, 'sidebar-visible');
        }
    },
    handleSidebar(e) {
        // click on this link will cause ONLY child alert to fire
        e.stopPropagation();
        // stop default action of link
        e.preventDefault();

        this.refs.sidebar.scrollTop = 0;
        toggle(this.refs.sidebar, 'sidebar-visible');
        toggle(this.refs.maprow, 'sidebar-visible');
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
    render() {
        let mapHeight = {
            height: this.state.mapHeight
        }
        return (
            <div className="block block-inverse block-fill-height app-header">
              <button onClick={ this.handleSidebar } type="button" className="navbar-toggle" data-target="#stage" data-toggle="stage" data-distance="-250">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="">
                <strong style={ {    background: '#fff',    padding: 12,    borderRadius: 4,    color: '#28669F'} }>
                                                                                                        safari
                                                                                                        </strong>
              </a>
              <div className="block-xs-middle p-b-lg map-block">
                <div className="row rtl map-row" ref="maprow">
                  <div ref="sidebar" className="visible-width-sm visible-width-md visible-width-lg col-fixed-250 map-column stage-shelf stage-shelf-right" id="map-sidebar">
                    <div className="map-nav-container">
                      <ul className="map-nav-list nav nav-bordered nav-stacked clearfix" id="mapsettings">
                        <li className="nav-header">Settings</li>
                        <li className={ this.state.selectedItem == 1 ? "active" : null }>
                          <a href="#" data-id="1" onClick={ this.toggleSettingsPanel }>Maps</a>
                        </li>
                        <li className={ this.state.selectedItem == 2 ? "active" : null }>
                          <a href="#" data-id="2" onClick={ this.toggleSettingsPanel }>Animals</a>
                        </li>
                        <ul ref="mapsettings" className={ this.state.selectedItem == 1 ? "nav nav-bordered nav-stacked show" : "nav nav-bordered nav-stacked hidden" }>
                        </ul>
                        <ul ref="animalsettings" className={ this.state.selectedItem == 2 ? "nav nav-bordered nav-stacked show" : "nav nav-bordered nav-stacked hidden" }>
                        </ul>
                      </ul>
                    </div>
                    <ul id="live" ref="live" className="map-live nav nav-bordered nav-stacked">
                      <li className="nav-divider"></li>
                      <li className="nav-header">Live @Addo</li>
                      <ul className="nav nav-bordered nav-stacked">
                        { this.state.geopositions.map((result) => {
                              return <ListItemWrapper key={ result.g } data={ result } />;
                          }) }
                      </ul>
                    </ul>
                  </div>
                  <div className="col-xs-12 col-offset-250 map-column" style={ mapHeight } ref="map" id="maplayer">
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
)(Maps);

var ListItemWrapper = React.createClass({

    setMapCenter(e) {
        e.preventDefault();
        console.log(this.props.data);
        map.panTo(new L.LatLng(this.props.data.l[0], this.props.data.l[1]));
    },
    render: function() {
        return <li>
                 <a href="#" onClick={ this.setMapCenter }>
                   { this.props.data.l }
                 </a>
               </li>;
    }
});