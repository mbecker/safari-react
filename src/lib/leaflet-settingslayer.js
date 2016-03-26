export class SettingsLayer {
    constructor(map, container, overlaysContainer, baseLayers, overlays) {
        this.map = map;
        this.container = container;
        this.overlaysContainer = overlaysContainer;
        this.baseLayers = baseLayers;
        this.overlays = overlays;

        this._link = {};
        this._listItem = {};
        this._layer = {};
        this._layers = {};
        this._layersActives = [];
        this._overlaysActives = [];
        this._lastZIndex = 0;

        // Options
        this.options = {
            autoZIndex: true
        };

        let i, n;

        for (i in baseLayers) {
            if (baseLayers[i].group && baseLayers[i].layers) {
                // baseLayer is group && has layer;
                this._addGroup(baseLayers[i].group, false, baseLayers[i].layers);
                for (n in baseLayers[i].layers) {
                    // push layers of baseLayer group to this._layer
                    this._addLayer(baseLayers[i].layers[n], false, baseLayers[i].group);
                }
            } else {
                // baseLayer is NO group; push baselayers to this._layer
                this._addLayer(baseLayers[i], false);
            }
        }

        for (i in overlays) {
            if (overlays[i].group && overlays[i].layers) {
                // overlays is group && has layers
                this._addGroup(overlays[i].group, true, overlays[i].layers);
                for (n in overlays[i].layers) {
                    // push layers of overlays group to this._layer
                    this._addLayer(overlays[i].layers[n], true, overlays[i].group);
                }
            } else {
                // overlays is NO group; push baselayers to this._layer
                this._addLayer(overlays[i], true);
            }
        }

    }

    _addGroup(name, isOverlays, layers) {
        let n;

        let list = isOverlays ? this.overlaysContainer : this.container;

        // let list = L.DomUtil.create('ul', 'nav nav-bordered nav-stacked', this.container);
        let divider = L.DomUtil.create('li', 'nav-divider', list);
        let listItem = L.DomUtil.create('li', 'nav-header', list);
        listItem.innerHTML = name;

        for (n in layers) {
            let layer = layers[n];
            let listItem = L.DomUtil.create('li', 'checkbox custom-control custom-checkbox', list);
            // let listItemDiv = L.DomUtil.create('div', 'checkbox custom-control custom-checkbox', listItem);
            let listItemLabel = L.DomUtil.create('label', '', listItem);
            listItemLabel.dataId =
            listItemLabel.innerHTML = layer.name;

            let input = L.DomUtil.create('input', '', listItemLabel);
            input.type = 'checkbox';
            input.checked = false;
            let span = L.DomUtil.create('span', 'custom-control-indicator', listItemLabel);
            

            layer.input = input;
            layer.listItem = listItem;
            layer.layer = this._instanceLayer(layer.layer);

            // Layer is per default / setting active; add to map
            if (layer.active) {
                input.checked = true;
                this.map.addLayer(layer.layer);
                layer.active = true;
                if (isOverlays) {
                    this._overlaysActives.push(layer);
                } else {
                    this._layersActives.push(layer);
                }

            }

            if (isOverlays) {

                listItemLabel.onclick = e => {
                    L.DomEvent.stopPropagation(e);
                    L.DomEvent.preventDefault(e);

                    // If isOverlay; jsut remove this layer from map (other overlays coul stay on map)
                    if (input.checked) {
                        // Remove  overlayer from map and remove it from _overlaysActives
                        input.checked = false;
                        
                        this.map.removeLayer(layer.layer);
                        this._overlaysActives.splice(this._overlaysActives.indexOf(layer), 1);
                    } else {
                        input.checked = true;
                        this.map.addLayer(layer.layer);
                        
                        this._overlaysActives.push(layer);
                    }

                }

            } else {
                listItemLabel.onclick = e => {
                    L.DomEvent.stopPropagation(e);
                    L.DomEvent.preventDefault(e);
                    if (!input.checked) {
                        for (let i in this._layersActives) {
                            // Remove active layers from map and remove it from _layersActive
                            this._layersActives[i].active = false;
                            this.map.removeLayer(this._layersActives[i].layer);
                            this._layersActives[i].input.checked = false;
                            this._layersActives.splice(this._layersActives.indexOf(this._layersActives[i]), 1);
                        }
                        this.map.addLayer(layer.layer);
                        input.checked = true;
                        
                        this._layersActives.push(layer);
                    }



                }
            }

            // L.DomEvent.on(link, 'click', this._onLinkClick, layers[n]);

        }
    }

    _instanceLayer(layerDef) {
        if (layerDef instanceof L.Class)
            return layerDef;
        else if (layerDef.type && layerDef.args)
            return this._getPath(L, layerDef.type).apply(window, layerDef.args);
    }

    _addLayer(layer, overlay, group) {

        var layerLayer = this._instanceLayer(layer.layer),
            id = L.stamp(layerLayer);

        // if (layer.active)
        //     this._layersActives.push(layerLayer);

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
    }

    _getPath(obj, prop) {
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
}