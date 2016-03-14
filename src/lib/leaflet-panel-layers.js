/* 
 * Leaflet Panel Layers v0.1.5 - 2016-03-10 
 * 
 * Copyright 2016 Stefano Cudini 
 * stefano.cudini@gmail.com 
 * http://labs.easyblog.it/ 
 * 
 * Licensed under the MIT license. 
 * 
 * Demos: 
 * http://labs.easyblog.it/maps/leaflet-panel-layers/ 
 * 
 * Source: 
 * git@github.com:stefanocudini/leaflet-panel-layers.git 
 * 
 */
(function() {

    L.Control.PanelLayers = L.Control.Layers.extend({
        options: {
            button: false,
            collapsed: false,
            autoZIndex: true,
            position: 'topright',
            collapsibleGroups: false
        },
        //TODO add support for json layers defintions
        //fields:
        //  layerType: "tileLayer",
        //  layerUrl: "http://..."
        //  layerAdd: true

        initialize: function(baseLayers, overlays, options) {
            L.setOptions(this, options);
            this._layers = {};
            this._groups = {};
            this._layersActives = [];
            this._lastZIndex = 0;
            this._handlingClick = false;

            var i, n;

            for (i in baseLayers)
                if (baseLayers[i].group && baseLayers[i].layers)
                    for (n in baseLayers[i].layers)
                        this._addLayer(baseLayers[i].layers[n], false, baseLayers[i].group);
                else
                    this._addLayer(baseLayers[i], false);

            for (i in overlays)
                if (overlays[i].group && overlays[i].layers)
                    for (n in overlays[i].layers)
                        this._addLayer(overlays[i].layers[n], true, overlays[i].group);
                else
                    this._addLayer(overlays[i], true);
        },

        onAdd: function(map) {
            for (var i in this._layersActives)
                map.addLayer(this._layersActives[i]);

            L.Control.Layers.prototype.onAdd.call(this, map);

            return this._container;
        },

        addBaseLayer: function(layer, name, group) {
            layer.name = name || layer.name || '';
            this._addLayer(layer, false, group);
            this._update();
            return this;
        },

        addOverlay: function(layer, name, group) {
            layer.name = name || layer.name || '';
            this._addLayer(layer, true, group);
            this._update();
            return this;
        },

        _update: function() {
            this._groups = [];
            L.Control.Layers.prototype._update.call(this);
        },

        _instanceLayer: function(layerDef) {
            if (layerDef instanceof L.Class)
                return layerDef;
            else if (layerDef.type && layerDef.args)
                return this._getPath(L, layerDef.type).apply(window, layerDef.args);
        },

        _addLayer: function(layer, overlay, group) {

            var layerLayer = this._instanceLayer(layer.layer),
                id = L.stamp(layerLayer);

            if (layer.active)
                this._layersActives.push(layerLayer);

            this._layers[id] = {
                layer: layerLayer,
                name: layer.name,
                icon: layer.icon,
                map: layer.map,
                visible: layer.visible,
                overlay: overlay,
                group: group
            };

            if (this.options.autoZIndex && layerLayer.setZIndex) {
                this._lastZIndex++;
                layerLayer.setZIndex(this._lastZIndex);
            }
        },

        _createItem: function(obj) {
            var className = 'leaflet-panel-layers',
                label, input, checked;

            var classNameNotVisible = 'map-item-visible';
            if (obj.hasOwnProperty('visible') && obj.visible === false) {
                classNameNotVisible = 'map-item-notvisible';
            }

            label = L.DomUtil.create('label', className + '-item ' + classNameNotVisible);
            checked = this._map.hasLayer(obj.layer);
            if (obj.overlay) {
                input = document.createElement('input');
                input.type = 'checkbox';
                input.className = 'leaflet-control-layers-selector';
                input.defaultChecked = checked;
                input.name = 'map-input-' + obj.group['name'];
            } else {
                input = this._createRadioElement('leaflet-base-layers', checked);
            }

            if (obj.hasOwnProperty('visible') && obj.visible === false) {
                input.disabled = true;
            }

            input.layerId = L.stamp(obj.layer);

            L.DomEvent.on(input, 'click', this._onInputClick, this);

            label.appendChild(input);

            if (obj.icon) {
                var icon = L.DomUtil.create('i', className + '-icon');
                icon.innerHTML = obj.icon || '';
                label.appendChild(icon);
            }
            var name = document.createElement('span');
            name.innerHTML = obj.name || '';
            label.appendChild(name);

            return label;
        },

        _addItem: function(obj) {
            var className = 'leaflet-panel-layers',
                label, input, icon, checked;

            var container = obj.overlay ? this._overlaysList : this._baseLayersList;

            if (obj.group) {
                if (!obj.group.hasOwnProperty('name'))
                    obj.group = { name: obj.group };

                if (!this._groups[obj.group.name]) {
                    this._groups[obj.group.name] = this._createGroup(obj.group, obj.map);
                }


                // If all items of one grups are not visible thene hide the complete group
                // Is at least one item of the group visible show group and disable the item
                if (obj.hasOwnProperty('visible') && obj.visible === false) {
                    L.DomUtil.addClass(this._groups[obj.group.name], 'map-group-notvisible')
                    for (var i = 0; i < this._groups[obj.group.name].getElementsByTagName("input").length; i++) {
                        if (!this._groups[obj.group.name].getElementsByTagName("input")[i].disabled) {
                            L.DomUtil.removeClass(this._groups[obj.group.name], 'map-group-notvisible');
                        }
                    }
                    // this._groups[obj.group.name].getElementsByTagName("span")[0].textContent = "Nope";
                }

                container.appendChild(this._groups[obj.group.name]);
                container = this._groups[obj.group.name];

            }

            label = this._createItem(obj);

            container.appendChild(label);

            return label;
        },

        _createGroup: function(groupdata, ismap) {
            var className = 'leaflet-panel-layers',
                groupname, grouplabel_text, grouplabel_plus,
                group = L.DomUtil.create('div', className + '-group'),
                grouplabel = L.DomUtil.create('label', className + '-grouplabel', group);

            group.dataset.checked = false;
            group.name = 'map-group-' + groupdata.name;

            if (this.options.collapsibleGroups) {

                grouplabel_plus = L.DomUtil.create('span', className + '-groupplus', grouplabel);
                grouplabel_plus.innerHTML = ' - ';


                L.DomEvent.on(grouplabel, 'click', function() {
                    if (L.DomUtil.hasClass(group, 'expanded')) {
                        L.DomUtil.removeClass(group, 'expanded');
                        grouplabel_plus.innerHTML = ' + ';
                    } else {
                        L.DomUtil.addClass(group, 'expanded');
                        grouplabel_plus.innerHTML = ' - ';
                    }
                });
            }

            grouplabel_text = L.DomUtil.create('span', '', grouplabel);
            grouplabel_text.innerHTML = groupdata.name;
            L.DomUtil.addClass(group, 'expanded');

            return group;
        },

        _onInputClick: function() {
            var i, input, obj,
                inputs = this._form.getElementsByTagName('input'),
                inputsLen = inputs.length;

            this._handlingClick = true;

            for (i = 0; i < inputsLen; i++) {
                input = inputs[i];
                obj = this._layers[input.layerId];

                if (input.checked && !this._map.hasLayer(obj.layer)) {
                    this._map.addLayer(obj.layer);

                } else if (!input.checked && this._map.hasLayer(obj.layer)) {
                    this._map.removeLayer(obj.layer);
                }
            }

            this._handlingClick = false;

            this._refocusOnMap();
        },


        _initLayout: function() {
            var className = 'leaflet-panel-layers',
                layerControlClassName = 'leaflet-control-layers',
                container = this._container = L.DomUtil.create('div', className);

            //Makes this work on IE10 Touch devices by stopping it from firing a mouseout event when the touch is released
            container.setAttribute('aria-haspopup', true);

            if (!L.Browser.touch) {
                L.DomEvent
                    .disableClickPropagation(container)
                    .disableScrollPropagation(container);
            } else
                L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation);

            var form = this._form = L.DomUtil.create('form', className + '-list');

            // Form should have auto height
            //       this._map.on('resize', function(e) {
            //           form.style.height = e.newSize.y+'px';
            //       });

            // form.style.height = this._map.getSize().y+'px';

            if (this.options.button) {
                this.options.collapsed = true;
                L.DomUtil.addClass(container, className + '-button-collapse');
            }

            if (this.options.collapsed) {

                // var link = this._layersLink = L.DomUtil.create('a', layerControlClassName+'-toggle', container);
                // link.href = '#';
                // link.title = 'Layers';
                // link.text = "Show Maps";

                var optionsContainer = this._layersLink = L.DomUtil.create('div', 'map-toggle', container);
                var optionsLink = L.DomUtil.create('a', 'mapbox-improve-map', optionsContainer);
                optionsLink.href = '#';
                optionsLink.title = 'Layers';
                optionsLink.text = "Maps";

                var showAllMaps = this._showAllMapsLink = L.DomUtil.create('a', 'map-link-showallmaps', optionsContainer);
                //showAllMaps.href = '#';
                showAllMaps.title = 'Layers';
                showAllMaps.text = "Hide all maps";

                L.DomEvent
                    .on(showAllMaps, 'click', L.DomEvent.stop)
                    .on(showAllMaps, 'click', this._showAllMaps, this);

                L.DomEvent
                    .on(optionsContainer, 'click', L.DomEvent.stop)
                    .on(optionsContainer, 'click', this._expand, this);

                if (L.Browser.touch) {
                    L.DomEvent
                        .on(optionsContainer, 'click', L.DomEvent.stop)
                        .on(optionsContainer, 'click', this._expand, this);
                } else {
                    L.DomEvent.on(optionsContainer, 'focus', this._expand, this);
                }

                this._map.on('click', this._collapse, this);
                // TODO keyboard accessibility
            } else {
                this._expand();
            }




            this._baseLayersList = L.DomUtil.create('div', className + '-base', form);
            this._separator = L.DomUtil.create('div', className + '-separator', form);

            this._overlaysList = L.DomUtil.create('div', className + '-overlays', form);
            L.DomUtil.create('div', className + '-margin', form); // No need to store it

            container.appendChild(form);
        },

        _showAllMaps: function() {
            var groups = document.querySelectorAll('.map-group-notvisible');
            var block = 0;
            var visible = 0;
            for (var i = 0; i < groups.length; i++) {
                if (groups[i].style.display == "block") {
                    visible = visible + 1;
                    groups[i].style.display = "none";
                    this._showAllMapsLink.textContent = "Show all maps";
                } else {
                    block = block + 1;
                    groups[i].style.display = "block";
                    this._showAllMapsLink.textContent = "Hide all maps";
                }
            }
            if (!(visible == groups.length) || !(block == groups.length)) {
                // Something went wrong: Not all elements have the same display stle (either block or none)
                var stlyeDisplay;
                var showAllMapsText;
                if (visible >= block) {
                    stlyeDisplay = 'none';
                    showAllMapsText = 'Show all maps';
                } else {
                    stlyeDisplay = 'block';
                    showAllMapsText = 'Hide all maps';
                }
                for (var i = 0; i < groups.length; i++) {
                    groups[i].style.display = stlyeDisplay;
                    this._showAllMapsLink.textContent = showAllMapsText;
                }
            }
        },

        _expand: function() {
            if (L.DomUtil.hasClass(this._container, 'leaflet-panel-layers-expanded')) {
                return this._container.className = this._container.className.replace(' leaflet-panel-layers-expanded', '');
            } else {
                L.DomUtil.addClass(this._container, 'leaflet-panel-layers-expanded');
            }

        },

        _collapse: function() {
            this._container.className = this._container.className.replace(' leaflet-panel-layers-expanded', '');
        },

        _getPath: function(obj, prop) {
            var parts = prop.split('.'),
                last = parts.pop(),
                len = parts.length,
                cur = parts[0],
                i = 1;

            if (len > 0)
                while ((obj = obj[cur]) && i < len)
                    cur = parts[i++];

            if (obj)
                return obj[last];
        }
    });

    L.control.panelLayers = function(baseLayers, overlays, options) {
        return new L.Control.PanelLayers(baseLayers, overlays, options);
    };

}).call(this);
