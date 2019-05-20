let districts_provinceWise = {}
let palikas_districtWise = {}
let currentProvince = null;
let currentDistrict = null;

// function to remove layers from map after checking
const safelyRemoveLayerFromMap = layer => 
    {
        if (map.hasLayer(layer))
        {
            map.removeLayer(layer);
        }
    };

// function to remove gapa/napa or palika layers when clicked
const addPalikaRemoveOnClickFunctionalityTo = palikaLayer =>
{
    palikaLayer.on("click", function()
        {
            safelyRemoveLayerFromMap(palikaLayer);
            currentDistrict = null; // currentDistrict's palika is none after palikas layer is removed
            // changeLayersStyleTo(currentProvince._layers, darkStyle); // to redarken the current distrticts_provinceWise layer
            map.fitBounds( currentProvince.getBounds() ); // zooming back to province level
        }
    );
}

// loading the files into an object literal
for (let i = 1; i < 8; i++)
{
    path = "Data/Province District Geojson/" + i + ".geojson";

    districts_provinceWise[i] = new L.GeoJSON.AJAX(path,
	{
    style: feature => darkStyle,
    onEachFeature: (feature, layer) =>
        {
            //console.log(feature, layer);
            // adding click event to show palikas on each loaded district of provinceWiseDistricts
            layer.on("click", () =>
                {
                    const districtName = feature.properties.FIRST_DIST;
                    if ( currentDistrict!==palikas_districtWise[ districtName ] )    
                    {
                        safelyRemoveLayerFromMap( currentDistrict );
                        palikas_districtWise[districtName] = new L.GeoJSON.AJAX("Data/District GaPaNaPa Geojson/"+districtName+".geojson",
                        {
                            style: feature => darkStyle
                        }).addTo(map);
                        const newLayer = palikas_districtWise[districtName]; // just for a shorter reference name
                        addPalikaRemoveOnClickFunctionalityTo(newLayer); // to current palika layer if cicked again
                        map.fitBounds( layer.getBounds() ); // zoom in to palika layer
                        changeLayersStyleTo( currentProvince._layers, lightStyle ); // to dim out the current district_ProvinceWise layer
                        currentDistrict = newLayer;
                    }
                });
        }
    });
}

// adding click event to display sub-district maps only when province is Clicked
overlayLayers.provinces.on('click', function(event) 
    {
        const provinceNo = event.layer.feature.properties.id;
        const newLayer = districts_provinceWise[provinceNo];
        if (currentProvince !== newLayer)
        {
            safelyRemoveLayerFromMap( currentProvince ); // removing old districts_ProvinceWise layer from map
            safelyRemoveLayerFromMap( currentDistrict ); // removing old palikas_DistrictsWise la
            if ( !map.hasLayer( newLayer ) )
            {
                map.addLayer( newLayer );
                // console.log( newLayer );
                map.fitBounds( newLayer.getBounds() );
                changeLayersStyleTo( overlayLayers.provinces._layers, lightStyle ); // changing the whole nepal province map to lightsytle
                changeLayersStyleTo( newLayer._layers, darkStyle ); // changing the new districts_ProvinceWise layer to darkSytle
                currentProvince = newLayer;
            }
        }
    }
);