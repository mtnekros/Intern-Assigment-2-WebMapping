// creating map
const map = L.map( 'mapid' ).setView( [28.238586, 84.281383], 7 );

// organizing basemaps in an object
const basemaps = {
    stamenToner: new L.StamenTileLayer("toner").addTo(map),
    openStreetMap: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
};

// base style for all layers
const darkStyle = {color: "#001123", weight: 1, fillOpacity: 0.7, opacity: 0.9};
const lightStyle = {fillOpacity: 0.25, opacity: 0.25};

// organizing overlayLayers in an object
const overlayLayers = {
    provinces: new L.GeoJSON.AJAX("data/Province.geojson",
        {
        style: feature => darkStyle,
        onEachFeature: (feature, layer) =>
            {
                layer.bindTooltip(feature.properties.PROV_NAME, {permanent: true, direction: 'center', opacity: 1, className: "staticLabel"});
            }
        }).addTo(map),
    districts: new L.GeoJSON.AJAX("data/District.geojson",
        {
        style: feature => darkStyle,
        onEachFeature: (feature, layer) =>
            {
                layer.bindPopup(feature.properties.Name);
            }
        })
};

// adding layer control to map box
L.control.layers(basemaps, overlayLayers).addTo(map);

// function to toggle layers and basemaps
const toggleLayerWithCheckBox = function()
{
    // console.log(this.value);
    let currentLayer = overlayLayers[ this.value ];
    if ( this.checked )
    {
        if ( !map.hasLayer( currentLayer ) )
        {
            map.addLayer( currentLayer );
        }
    }
    else
    {
        map.removeLayer( currentLayer );
    }
}

const toggleBaseMap = function()
{
    // console.log(this.value);
    if (this.checked)
    {
        basemaps[this.value].bringToFront();
    }
}

// adding layer control for "OVERLAY LAYERS" in an outside div with html checkboxes
const layerCheckboxes = document.querySelectorAll(".layerCheckBox");
for (let i = 0; i < layerCheckboxes.length; i++)
{
	layerCheckboxes[i].addEventListener("click", toggleLayerWithCheckBox);
}

// adding layer control for "BASEMAPS" in an outside div with html checkboxes
const basemapRadios = document.querySelectorAll("input[name='baseRadioButton']");
// console.log(basemapRadios);
for (let i = 0; i < basemapRadios.length; i++)
{
    // console.log(basemapRadios[i]);
    basemapRadios[i].addEventListener("click", toggleBaseMap);
}

// function set layer styling for each in sth._layers
const changeLayersStyleTo = (layers, style) =>
{
    for (let key in layers)
    {
        layers[key].setStyle( style );
    }
};

// adding onAdd event to zoom the map to layer's bound // works when overlay layers toggled on with layer control checkbox
for (let key in overlayLayers)
{ 
    const currentLayer = overlayLayers[ key ];
    currentLayer.on("add", () =>
        {
            map.fitBounds( currentLayer.getBounds() );
            changeLayersStyleTo( currentLayer._layers, darkStyle ); // darkening the layers after zooming to that layer
        });
}

// function to set visibility of province's static labels
setStaticLabelVisibility = ( layers, toVisible ) =>
{
    layers.eachLayer( layer => 
        {
            if ( toVisible )
            {
                setTimeout( ()=> { layer.openTooltip(); }, 800 );
            }
            else 
            {
                layer.closeTooltip();
            }
        });
};

// for removing and adding province's static labels on zoom
map.on("zoomend", () => 
    {
        const labelVisibility = map._zoom <= 8 && map._zoom > 6;
        setStaticLabelVisibility( overlayLayers.provinces, labelVisibility ); // set visibility of province layer off
    });