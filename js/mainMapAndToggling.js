// creating map
let map = L.map('mapid').setView([28.238586, 84.281383], 7);

// organizing basemaps in an object
let basemaps = {
    stamenToner: new L.StamenTileLayer("toner").addTo(map),
    openStreetMap: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
        {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map)
};

// organizing overlayLayers in an object
let overlayLayers = {
    provinces: new L.GeoJSON.AJAX("data/Province.geojson",
        {
        style: feature => 
            { 
                return {color: "#00aaaa", weight: 1, opacity: 0.8};
            },
        onEachFeature: (feature, layer) =>
            {
                layer.bindTooltip(feature.properties.PROV_NAME, {permanent: true, direction: 'center', opacity: 1, className: "staticLabel"});
            }
        }).addTo(map),
    districts: new L.GeoJSON.AJAX("data/District.geojson",
        {
        style: feature =>
            {
                return {weight: 1};
            },
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
        console.log(this.value);
        let currentLayer = overlayLayers[ this.value ];
        if ( this.checked )
        {
            if ( !map.hasLayer( currentLayer ))
            {
                map.addLayer(currentLayer);
            }
        }
        else
        {
            map.removeLayer(currentLayer);
        }
    };

const toggleBaseMap = function()
    {
        console.log(this.value);
        if (this.checked)
        {
            basemaps[this.value].bringToFront();
        }
    };

// adding layer control for OVERLAY LAYERS in an outside div with html checkboxes
let layerCheckboxes = document.querySelectorAll(".layerCheckBox");
for (let i = 0; i < layerCheckboxes.length; i++)
{
	layerCheckboxes[i].addEventListener("click", toggleLayerWithCheckBox);
}

// adding layer control for BASEMAPS in an outside div with html checkboxes
let basemapRadios = document.querySelectorAll("input[name='baseRadioButton']");
console.log(basemapRadios);
for (let i = 0; i < basemapRadios.length; i++)
{
    console.log(basemapRadios[i]);
    basemapRadios[i].addEventListener("click", toggleBaseMap);
}