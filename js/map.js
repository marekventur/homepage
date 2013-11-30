(function() {
    var map = new OpenLayers.Map("map");
    var watercolor = new OpenLayers.Layer.Stamen("watercolor");
    var labels = new OpenLayers.Layer.Stamen("toner-labels", { isBaseLayer: false });
    map.addLayer(watercolor);
    map.addLayer(labels);

    map.setCenter(new OpenLayers.LonLat(-7345.1870133094, 6714533.2850014), 15);
    m = map;
})();