# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [CalVer](https://calver.org/).

## [UNRELEASED] - 2022-20-4
### Changed
- In conflictSearch requests to the GC2 SQL API now happens concurrently. This is done by implementing a promise pool. The default size of the pool is 30, but this can be set in the runtime config. Note that this setting can't be changed in a run-time config. 
```json
{
  "extensionConfig": {
    "conflictSearch": {
      "poolSize": 40
    }
  }
}
```
### Fixed
- Tile layer opacity state now is kept betweens freshes. 

## [2022.4.0] - 2022-8-4
### Fixed
- Now uses sfe_ejendomsnummer instead of esr_ejendomsnummer in search of 'adresser' and 'matrikel'.

## [2022.3.3] - 2022-24-3
### Fixed
- Regression bug, which kept the right side-panel closed after load of app.
- The Leaflet method `toGeoJSON` rounds of coordinates with 6 decimals by default. But this may result in up to 10 cm on the map (tested at about 57 degrees north). This makes the editor and snapping very unprecise. So all `toGeoJSON` calls are now done with a precision argument of 14 through out the app. 

## [2022.3.2] - 2022-18-3
### Fixed
- Bug in sqlQuery.js, which rendered feature-info inoperable.
- Added `geolocation` to the `allow` attribut on the created iframe in embed.js. 

## [2022.3.1] - 2022-15-3
### Added
- Added GC2 Meta option for tiled raster layer: `tiled`. If set to `true` the layer will be fetched in tiles instead of
  one big single tile, which is default. The layer visibility detection still works, but will be more inaccurate because
  of the natur of tile loading. But it will always be false visible.
- A new option in embed.js: `data-vidi-no-tracking`, which will disable the Vidi tracking cookie used for advanced
  functions like state-snapshots and printing.

### Changed
- Tracking cookie will now be set as `secure=true` and `sameSite=none` if env var NODE_ENV is set to 'production'. This
  will fix issues with embeding Vidi and setting the cookie.
- Vector feature table can now be placed to the right or at the bottom of the screen. The table is removed when layer is
  switched off. Only one table can be displayed at a time. New config for setting position and width/height. `width`
  only has effect then postion is `right` and `height` only when position is `bottom`. `width` can be both relative `%`
  and absolute `px. `height` can only be absolute:
```json
{
  "vectorTable": {
    "position": "right",
    "width": "30%",
    "height": "250px"
  }
}
```

### Fixed
- Some bugs regarding vector feature table and dynamic load.

## [2022.3.0] - 2022-4-3
### Added
- Added config setting for auto panning the map when pop-up's opens, so they don't stay outside the map: `autoPanPopup: false|true`

### Changed
- Pop-ups on vector layers will use simple pop-ups when `crossMultiSelect` is `false` instead of the accordion template. This make pop-up behaviours similar on tile and vector layers.

### Fixed
- Some issues regarding pop-up behaviours when `crossMultiSelect` is `true` and editor is enabled: `crossMultiSelect` will be set to `false` when editor is enabled.
- Config defaults are now handle one place in the source and all settings have defaults. No longer need for testing if a setting is undefined.

## [2022.2.2] - 2022-18-2
### Fixed
- Better support for special characters and upper case in layer names. Fixes a UTF8 error in WMS requests and quotes schema/relation names in feature info requests.
- In the editor the counting of vertices in LineString features failed with NaN and it was impossible to edit. This is fixed with implementing a proper counting rutine.

## [2022.2.1] - 2022-3-2
### Fixed
- Use UTM instead of web-mercator when projeting/unprojecting the print frame or the different will be to big.

## [2022.2.0] - 2022-3-2
### Fixed
- Fix for buggy print recreation from state. The print frame was re-calculated each time the state was applied making a small change in latitude coords. This made the frame drift south-east and rendered errors on big geographical frames. 

## [2021.12.1] - 2021-29-12
### Changed
- The `df` extension is changed, so it can use both Dataforsyningen and Datafordeler. New setup (token has precedence):
```json
{
  "df" : {
    "datafordeler" : {
      "username": "...",
      "password": "...",
      "token": "..."
    },
    "dataforsyningen" : {
      "username": "...",
      "password": "...",
      "token": "..."
    }
  },
  "baseLayers": [
    {
      "type": "wms",
      "url": "/api/datafordeler/GeoDanmarkOrto/orto_foraar/1.0.0/WMS",
      "layers": [
        "geodanmark_2020_12_5cm"
      ],
      "id": "geodanmark_2020_12_5cm",
      "name": "TEST geodanmark_2020_12_5cm",
      "description": "geodanmark_2020_12_5cm",
      "attribution": "Styrelsen for Dataforsyning og Effektivisering",
      "minZoom": 8,
      "maxZoom": 22,
      "maxNativeZoom": 22
    },
    {
      "type": "wms",
      "url": "/api/dataforsyningen/topo_skaermkort_DAF",
      "layers": [
        "dtk_skaermkort"
      ],
      "id": "dtk_skaermkort",
      "name": "Skærmkort",
      "description": "DTK/Skærmkort",
      "attribution": "Styrelsen for Dataforsyning og Effektivisering",
      "minZoom": 8,
      "maxZoom": 22,
      "maxNativeZoom": 22
    }
  ]
}
```

### Added
- Field ignore setting from GC2 will now exclude the field from being queried in sqlQuery module (feature info).

## [2021.12.0] - 2021-6-12
### Changed
- The location circle marker is now orange in follow-mode and blue when not following. Location now works the same in both embed and default templates.
- The legend toast dialog in embed template will now be pushed to the right when sliding out the layer tree. This way the elements will not be stacked.
- The search-result element in `conflict.tmpl` now has a dynamic height, so it will fit the parent window.

### Fixed
- `slideOutLayerTree` is now inwoked after vidi is ready making it more stable.

## [2021.11.2] - 2021-17-11
### Fixed
- `layerTree` state was not updated when Vidi was initiated with layers in URL anchor, resulting in no active layers in state until some changes was done by user afterward. 

## [2021.11.1] - 2021-16-11
### Changed
- Hit count added to the "Data fra konflikter" tab in `conflictSearch` module.
- Some changes in `conflict.tmpl`, so it's easier to customize it.

### Added
- API endpoint for proxify base layer requests to Datafordeler.dk. The API rewrites the URL and adds `username` and `password`. The base layer url follows this pattern: `/api/df/[Datafordeler URI]`. Example Setup in `config/config.js`:

```json
{
  "df" : {
    "userName" : "QMO.....",
    "password" : "3Ps....."
  },
  "baseLayers": [
    {
      "type": "wms",
      "url": "/api/df/GeoDanmarkOrto/orto_foraar/1.0.0/WMS",
      "layers": [
        "geodanmark_2020_12_5cm"
      ],
      "id": "geodanmark_2020_12_5cm",
      "name": "TEST geodanmark_2020_12_5cm",
      "description": "geodanmark_2020_12_5cm",
      "attribution": "Styrelsen for Dataforsyning og Effektivisering",
      "minZoom": 8,
      "maxZoom": 22,
      "maxNativeZoom": 22,
      "transparent": true
    }
  ]
}
```

## [2021.11.0] - 2021-3-11
### Changed
- Draw tool bar will now be positioned beside the main tools, if screen height is below 700px.

### Fixed
- Vector table now only shows in `embed.tmpl`.

## [2021.10.3] - 2021-11-10
### Changed
- Session cookie (connect.gc2) will now be set as `secure=true` and `sameSite=none` if enviromental variable NODE_ENV is set to 'production'. This will fix issues with embeding Vidi and protected layers. To set NODE_ENV in docker-compose file, use this:
  ```yaml
    environment:
      - NODE_ENV=production
  ```

## [2021.10.2] - 2021-7-10
### Fixed
- Intended code error removed from `conflict` module in excel function.

## [2021.10.1] - 2021-7-10
### Added
- A new config `initFunction`, which holds a JavaScript function as a string. When Vidi is fully loaded this function will be run:
  ```json
  {
      "initFunction": "function(){alert(\"Hello\")}"
  }
  ```
  
### Fixed
- The `reportRender` issue in `conflict` module regarding state resolving is fixed.
- The alternative `reportRenderAlt` module for `conflictSearch` can now be set in config:
  ```json
    {  
      "extensions": {
        "browser": [
            {"conflictSearch": ["index", "reportRenderAlt", "infoClick", "controller"]}
        ]
      }
    }
  ```

## [2021.10.0] - 2021-6-10
### Changed
- Legend added in blank.tmpl (which is used in static maps). Also the legend checkboxes are removed from legends in blank.tmpl and print.tmpl.
- Extensions are initiated before state resolves, so extensions work in state urls.
- Measurement tooltip will now show one decimal instead of none when showing meters.

### Fixed
- Serialization of line extremities was buggy when lines was recreated after applying state causing extremities not to be drawn.

## [2021.9.0] - 2021-22-9
### Changed
- Links in pop-ups now gets the primary color of the theme instead of the fixed cyan color.

### Fixed
- Serveral smaller fixes for the Editor extension.
- embed.js API: Only fire snapshotLayersCallback once.
- Excel write erors in conflict module is now handled, so Vidi doesn't crash.

## [2021.8.3] - 2021-30-8
### Fixed
- Regression bug regarding print. The metadata object was stripped from the payload in ealier release, but was necessary for recreation of layers. Now a slim downed version of meta are send.

## [2021.8.2] - 2021-30-8
### Added
- The layer-group-checkboxes now have id's, so it's easier to apply css rules. Ids follow this pattern: `group-check-box-[group-id]`. Use the dev tool inspector to get the id.

## [2021.8.1] - 2021-25-8
### Changed
- Docker base image update to debian:bullseye-slim.

### Added
- Callback functions in embed.js. Two functions kan be defined in the parent page like this (with ``data-vidi-frame-name="map1"``):
  - When Vidi is ready:
  ```JavaScript
    embedApi.vidiReady["map1"] = () => {
        console.log("Vidi is ready")
    }
  ```
  - When active layers from the snapshot is ready:
  ```JavaScript
    embedApi.activeLayersReady["map1"] = () => {
        console.log("Active layers are ready")
    }
  ```

### Fixed
- In conflictSearch module, the adding of sheets to excel is now in a try/catch so invalid sheet names won't crash the Node process. 

## [2021.8.0] - 2021-12-8
### Changed
- `select_function` is now called when opening a panel in a accordion pop-up.

### Fixed
- Print and Conflict modules will not longer keep unnecessary Meta data in state. This reduce the data volume. 
- Layer tree will now build with all valid layers. Before it would start building as soon an invalid layer was proccess leaving out the rest.

## [2021.7.1] - 2021-8-7
### Fixed
- Regression bug. Draw module labels are now again serialized as labels - not markers.

## [2021.7.0] - 2021-5-7
### Fixed
- Conflict Excel output: Two sheets can't have the same name, which will result in error. In case of same names, the last char is changed to a number.
- Conflict report will now default to "Compact" if none is choosen.

## [2021.6.0] - 2021-2-7
### Changed
- No MapCentia logo in default and conflict print template. Logo can be set with external css sheet. Some thing like this:
```css
#print-header-logo{
  background-image: url('https://.....');
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: 80%;
}
```
- embed.js: If host in token is http, then make it protocol relative, so tokens created on http still works when embedded on https sites.
- It's now possible to switch all layers on/off in a layer (sub)group. Enable the checkboxes with the `showLayerGroupCheckbox` conflig.
- Some visual improvements to the display of sub-groups in the layer tree.
- Editing of geometry is not possible when number of nodes exceed 1.000. But attribut data can still be edited. A high amount of nodes will hog down the browser and it can crash.
- The Snapshot module will now use base64url encoded body for getting, creating and updating snapshots. This way will a JSON value `ILIKE '%12'` not mess things up when decoded server side. This requires an update of GC2. 
- Snapshot list is now ordered by update date/time and this is also what's displayed instead of create date/time.
- Frame number on prints will not be shown when only one frame is printed. Custom print needs an update:
```
{{#showFrameNumber}}#{{printFrame}}{{/showFrameNumber}}
```
- Frame numbers starts with 1 instead of 0.
- New format for setting redis host. Now the database number can be set:
```JSON
{
  "redis": {
    "host": "127.0.0.1:6379",
    "db": 2
  }
}
```

### Added
- An API loaded with the `embed.js` script. Two methods are available: `embedApi.switchLayer` and `embedApi.allOff`. See docs for details.
- Mouse over on vector and raster tile layers. The latter using UTF Grid. These GC2 Meta properties are controling the mouse over:
 - `hover_active` Boolean. Should mouse over be switch on?
 - `info_template_hover` String. Handlebars template to use in label. If not set a default template will be used, which loops through fields with the `Show in mouse-over` property checked.
 - `cache_utf_grid` Boolean. Wether to cache UTF grid tiles. Only apply to raster tile layers.
- Excel report is now available in conflict module. Each layer with hits will have its own sheet. For for sheets to get populated with hits the "Show in conflict" option must be checked for a least one field in the Structur tab in GC2 Admin. 
- New config option `activeLayers`. This option is a array of schema qualified layers with any type prefix (:v, :mvt, :w), which should be switch on from the start. If a snapshot link is used for starting Vidi, this option will be ignored.
```json
{
  "activeLayers": [
    "schema.layer1",
    "v:schema.layer2"
  ]
}
```

### Fixed
- Feature info click wouldn't open the pop-up if multiple layers was switch on.
- Drawings are not longer dashed, when selected.
- Conflict search module will now search protected layers if user is signed in.
- On `zoomToExtentOfgeoJsonStore` in geocloud.js pan map one pixel to defeat a strange bug, which causes a browser freeze.
- Layer filter auto complete menu is now postioned absolute instead of fixed, so it will not hang in the same place when scrolling layer tree.
- Composit QGIS Layers now work. They are not longer bypassed by MapServer where the merge request is done.

## [2021.5.0] - 2021-4-5
### Changed
- Node >= 14 er required. 
- Docker files are added to the project.
- It's now possible to set `gc2.host` through the environment variable `GC2_HOST`. If set in `config/config.js` it will have precedence.
- ConflictSearch is now controlled by state module. It will keep state between on/off and browser refreshes. State in conflictSearch is also applied when running a state-snapshot. 
- Changes in Snapshot UI. The UI is now more clean.
- When the `session=[id]` URL key/value is used, it will now reset the `connect.gc2` session cookie, even if it's set through the sign-in UI. To do that the HttpOnly cookie flag is removed, which will aggravate the risk of client side script accessing the cookie. The cookie is also removed when sign-out is done through the UI.
- CSS and templates files can now be placed in a sub-folder on the `configUrl` host. Only one level deep like `styles/custom.css`.
- Layer tools in the layer tree now have parent span elements with theese ids, so it's easier to to set a css display rule on them:
  - `#layer-tools-offline`
  - `#layer-tools-search`
  - `#layer-tools-opacity`
  - `#layer-tools-labels`
  - `#layer-tools-tables`
  - `#layer-tools-load`
  - `#layer-tools-filters`
- `repeatMode` is set to `true` for tools in Draw, so tools stay active.
 
### Added
- It's possible to lock UTM zone in coordinate module, so it's possible to project to a specific zone outside the actual zone. Useful for e.g. Denmark, which are using zone 32 for the whole country but is located in both 32 and 33.
```JSON
{
    "coordinates": {
      "lockUtmZoneTo": 32
    }
}
```
- A new build configuration for setting widths for the left slide-out panel in default template.
  - ```json
    "leftSlideWidths": [300, 400, 550]
    ```
- Under filters in the layer tree it's now possible to download the layer as either: GeoJSON, Excel or CSV

### Fixed
- Base64url are now used to encode filters instead of base64, so + and / sign doesn't mess things up.
- Changes to Snapshot UI, which fixes an issue with wrong URLs in input fields.
- Drawing is stored in state, but was not recreated after refresh of browser. This could get "invisible" drawings stored in snapshots.
- If a layer in a state snapshot is for some reason not available (protected, deleted), the build of the layer tree was ever resolved. Now it'll resolve.  
- The queueStatisticsWatcher and Service Worker now uses 3. party module for base64 decoding, because windows.btoa fails on non-latin characters.
- COWI Gade foto named properly in Streetview module.
- A lot of fixes in the Editor module.

## [2020.12.0] - 2020-8-12
### Changed
- The standard template for feature info is changed, so empty fields are omitted. It's now:
```handlebars
<div class="vidi-popup-content">
    <h3 class="popup-title">{{_vidi_content.title}}</h3>
    {{#_vidi_content.fields}}
        {{#if value}}
            <h4>{{title}}</h4>
            <p {{#if type}}class="{{type}}"{{/if}}>{{{value}}}</p>
        {{/if}}
    {{/_vidi_content.fields}}
</div>
```  

### Added
- `searchConfig.placeholderText` added to config, so the search placeholder can be customized.
- A callback function can now be added to interval reload of vector layers. The callback will be fires when layer changes. Meta option is `reload_callback`:
```javascript
function(store, map) {
  var audio = new Audio('https://ccrma.stanford.edu/~jos/mp3/gtr-nylon22.mp3');
  audio.play();
  var latest;
  store.geoJsonLayer.eachLayer(function (layer) {
    latest = layer
  })
  map.setView(latest.getLatLng(), 18)
}
```
- The max zoom level when selecting a row in a layer table can be with `setmax_zoom_level_table_click`. If not set or is NaN the max zoom level will default to 17.

### Fixed
- MapCache layers now work. Both raster and vector tiles.
- Timeout (10.000ms) on sqlStore. Feature info will now handle errors or cancels (e.g. due to timeout) on SQL requests and a "toast" will inform the user. If timeout happens the request will be re-tried.
- `crossMultiSelect` will always show vector feature info if a simultaneous raster SQL request fails or timeouts.
- Memory leak fixed when reloading vector layers.
- Interval reload of vector layers are now done with the `load` method instead of switching the layer off and on.
- Update of interval reloaded vector layers happens only if data has changed.
- Use native URL API instead of uriJs module.
- Still resolve promise in `localforage.setItem`, to avoid a net:ERR_FAILED in the browser when e.g. getting feature info. The issue about error on setItem persist.
- Some fixes regarding Internet Explorer.

## [2020.11.0] - 2020-18-11
### Added
- The awesome Leaflet plugin Leaflet.markercluster is added, so by setting the meta property `use_clustering` to `true` clustering can be enabled on single point vector layers. No other setting for Leaflet.markercluster is available for now.
- With the `cssFiles` config it's possible to load external css file from the `configUrl`. E.g.:
```json
{
  "cssFiles": [
       "myStyles1.css",
       "myStyles2.css"
  ]
}
```
- Conflict is now using `sqlQuery.js` to show info-click result. So now are multiple results possible. The `sqlQuery.js` module now has a Simple mode, a prefix for DOM elements to render in and callback for when selecting a row.
- New config setting `dontUseAdvancedBaseLayerSwitcher` which will disable the 'Display two layers at once' option in the base layer switcher.
- New GC2 Meta properties `select_function` which adds an onSelect callback to the result list in click-for-info.
- It now possible to render an image carousel in popups from a click-for-info. Create a JSON field with a value like this and set Content to Image:
```json
[
  {
    "src": "https://image1.jpeg",
    "att": "It's an image!"
  },
  {
    "src": "https://image1.jpeg",
    "att": "It's another image!!"
  }
]
```
- URL's can now be ignored for caching in Service Worker by using the `urlsIgnoredForCaching` setting in `config/config.js`. This setting can only be set in build time. E.g.:
```json
{
    "urlsIgnoredForCaching": [
        {
            "regExp": true,
            "requested": "part_of_the_url"
        }
    ]
}
```
- Print setup can now be "sticky" (by using the state module), so it will not reset when re-activating the module. Stickiness can be toggled and off. Off is default.
- Print setup is now stored in state snapshots. After state snapshot is activated the print setup will use the stored settings. The sticky toggle must be set to on or else the default print settings will be used.
- New print API `/api/print/[database]/?state=[state id]` which will return the stored print from a snapshot as PNG (PDF is coming). The print will be created on the fly.
- `embed.js` has two new attributes: `data-vidi-use-config` and `data-vidi-use-schema`. These will trigger the use of schema and/or config from the token if present.
- New GC2 Meta property which automatically can open a layer tool when the layer is switched on:
    - *default_open_tools*: JSON array with tools to open. Available options: `["filters","opacity","load-strategy","search"]` ("table" are not supported)
- New GC2 Meta properties:
    - *disable_check_box*: boolean, disables the layer check box:
        - When filtering a layer all its child layers with this property set to true will have their check boxes enabled. And when the filters are disabled again all child layers will be turned off and have their check boxes disabled again.
        - This makes it possible to setup child layers, which can only be viewed when filtered by its parent layer.
    - *filter_immutable*: boolean, makes the filter setup immutable.
        - Then set, the arbitrary filter setup can't be changes. Only values can. Should be used together with `filter_config`.
    - *reload_interval* integer, set a reload interval for vector layers. Can be used to autoload fresh data from live data sources. Units are milliseconds. 
    - *show_table_on_side*: boolean, render the vector list of the layer in an injected element with id `vector-side-table`, so you get a map and list side-by-side.
    - *zoom_on_table_click*: boolean, whether the map should zoom to vector feature or not when clicked in table. Is set on both vector layer tables and feature info result tables.
- A Reset filter button is added, which will reset the filter to the original state.
- The `infoClickCursorStyle` setting will set cursor style when using feature info click. Can be set to `pointer` or `crosshair`. The setting can be set in `config/config.js` or in a runtime config.
- New Autocomplete control in filters. The control will fetch distinct values from PostgreSQL for use in the autocomplete field. All distinct values are fetch at once. 100.000 distinct values can be handle without problems. Only works on text fields and must be enabled in GC2 Structure tab.
- The attribute `data-vidi-host` is added to `embed.js`, so it's possible to override the host from the token. This makes it possible to generate tokens on one setup and use them on others. E.g. on mirrored internal/external setups.
- The Coordinate module now has a Pan To input field. The user can input a coordinate in the chosen system and the map will pan to the point.
- Modules now has title headings.
- Added boolean config `vectorMultiSelect` in `config/config.js`. This will enable multi select on vector layers. Works cross layer too. Can be set in runtime config.
- Added boolean config `featureInfoTableOnMap` in `config/config.js`. This is a shortcut to set `info_template`, `info_element_selector` and `info_function`, so the single feature info pops up on the map instead of the right slide panel. Great for the `embed.tmpl`
- New button "Fit bounds to filter" in layer filters, which will set the view extent to the bounds of the filtered layer.
- New "Labels" panel for raster tile layers with a checkbox for hiding/showing labels on the layer. Works for both MapServer and QGIS back-end (GC2 must support this).
- Added boolean config `crossMultiSelect` in `config/config.js`. This will enable cross multi select on both vector and raster tile layers. This will result in a unified feature info experience, which are well suited for informative maps using the `embed.tmpl` template. All feature info results will be displayed in an accordion widget. The accordion summary is default layer title, but can be set to an attribute value with the meta config `accordion_summery`. Can be set in runtime config. 
- WMS layers can now be added directly as base layers. A WMS base layer example:
```json
{
    "type": "wms",
    "url": "https://services.kortforsyningen.dk/service?SERVICENAME=forvaltning2&",
    "layers": ["Basis_kort","Navne_basis_kort","Husnummer"],
    "id": "Basis_kort",
    "name": "Basiskort",
    "description": "Basiskort fra kortforsyningen",
    "attribution": "Kortforsyningen",
    "minZoom": 4,
    "maxZoom": 22,
    "maxNativeZoom": 22
}
```
- XYZ layer can be added as base layer like this (old feature but was undocumented and buggy):
```json
{
    "type": "XYZ",
    "url": "https://m3.mapserver.mapy.cz/base-m/{z}-{x}-{y}?s=0.3&dm=Luminosity",
    "id": "mapy",
    "name": "Mapy",
    "description": "Map from Mapy",
    "attribution": "Mapy",
    "minZoom": 1,
    "maxZoom": 20,
    "maxNativeZoom": 19
}
```

### Changed
- `public\js\vidi.js`is now required instead of loaded in a script tag. This way it's transpiled and can contain new JavaScript syntax.
- A lot of improvements in the `conflictSearch` module:
    - Results are now alpha sorted within layers groups (which is also sorted). Both in web and PDF.
    - A short and long description can be added for each layer, which is shown the result list. Use GC2 Meta properties: `short_conflict_meta_desc and `long_conflict_meta_desc`. 
    - The styling of both web and PDF results is better. Tables can't overflow the PDF page.
    - Ellipsis is used both in web and PDF when fields names / results are too long.
    - Empty link fields will now just be blank.
    - Layers with only one report column will be printed as a `|` separated string and not a table with one column.
    - New button for setting the print extent before creating a PDF.
    - Mouse click when releasing a rectangle/circle drag is suppressed.
    - Multiple results from a Select-Object-To-Search-With is now possible. The standard `sqlQuery` is used to create list. 
    
- Indicator in layer tree showing if a tile layer (MapServer or QGIS Server) is visible in the view extent. The Leaflet layer canvas element is being checked for colored pixels. Be aware of the canvas being bigger than the view extent because of the buffer. A event is triggered when a layer changes visibility called `tileLayerVisibility:layers` with a payload like this:
```json
{
    "id": "schema.layer.geom",
    "dataIsVisible": true
}
```
- Handlebars are now use instead of Mustache for rendering click-for-info templates. Handlebars is more feature rich than Mustache.
- The load screen is now being dismissed on `ready:meta` instead of `allDoneLoading:layers`. This makes the application interactive sooner. 
- Predefined filters are now processes as one string. Instead of sending something like this `["foo=1","foo=2"]` to GC2, it is now `["(foo=1 OR foo=2)"]`. This is how arbitrary filters work and both kind of filters are now being processed together in one string like `"(foo=1 OR foo=2) AND (bar=1 OR bar=2)"`. Vidi can therefore now set the operator between the predefined and arbitrary filters. 
- The filters from the layer tree are now set on the Click-For-Info module, so you only get filtered hits.
- The applied filters will now be shown as a WHERE clause in an Ace editor under the filter widgets. It's possible to mutate the clause and apply the altered filters. When doing that, the filter widgets will be disabled until the editor is disabled. All filters settings are stored in state. 
- In arbitrary filters, the field alias is now being used if set.
- Limits for puppeteer processes can now be set with this in `config/config.js`:
```json
{
  "puppeteerProcesses": {
        "min": 1,
        "max": 5
    }
}
```
- The `Enable filtering` property of the Structure tab in GC2 is now called `Disable filtering` and will if check omit the field in Vidi filtering. The property was not used before.
- Babel bumped to version 7
- Local GC2 config files are now fetched through the server back-end.
- `embed.tmpl` will now show login button if session module is enabled.
- The WMS requests now has a `qgs` parameter for QGIS backed layers. The value is path to the qgs file for the layer (base64 encoded). In GC2 the path will be used to send the request directly to qgis_serv instead of cascading it through MapServer.
- Raster tile layers without pixels (invisible in the map) are now not queried by feature info.
- Turning on a vector layer will now load the legend of the raster tile representation of the layer

### Fixed
- Using `indexOf` instead of `includes`, because the latter is not transpiled in Babel. It's an Internet Explorer issue.
- `embed.js` now works in IE11.
- Accept 'da' locale in request headers. Only da-DK worked so far.
- If the Service Worker doesn't get registered when Vidi will now start anyways without the Service Worker. On a hard refresh (Ctrl-f5) the Service Worker will claim the clients, so a hard refresh will not unregister Service Worker, but the cache will be deleted. 
- Text in editor is now url encoded.
- Quotes are now escaped for text in the editor.
- All numeric Postgres types are now handled correct in the editor.
- Puppeteer processes are now destroyed, if an exception is thrown during print. This prevents leak of processes.
- Re-acquirement of a Puppeteer process is done if timeout, so the print will eventual be finished.
- Puppeteer processes will be destroyed after 60 seconds. This prevents hanging processes, which blocks further prints.

## [2020.2.0]
### Added
- Custom user data from GC2 is now added to session the object.
- Handling of invalid JSON configs.

### Changed
- CalVer is now used with month identifier like this: YYYY.MM.Minor.Modifier
- Custom searches can now be added to danish search module.
- `embed.js` will wait with loading Vidi until target element is visible in the DOM. This way, Vidi can be embedded in a element with `display:none`.
- Its now possible to add custom extra searches to `danish.js`. A search needs an Elasticsearch index, which must have an id and string property. The latter is the search string. Also a look-up table/view with geometries is required. An example of a setup:
```javascript
{
    searchConfig: {
        size: 4,
        komkode: "*",
        esrSearchActive: true,
        sfeSearchActive: true, // Example of config for danish search
        extraSearches: [,{
            name: "stednavne_search",
            db: "dk",
            host: "https://dk.gc2.io",
            heading: "Stednavne",
            index: {
                name: "stednavne/navne_samlet",
                field: "string",
                key: "gid",

            },
            relation: {
                name: "stednavne.navne_samlet_geom",
                key: "gid",
                geom: "the_geom"
            }
        }]
    }
}
``` 
- New GC2 Meta properties which controls the info pop-up and styling of vector layers:
    - *info_template*: Mustache template for use in pop-up.
    - *info_element_selector*: Which element to render info template in? Defaults to pop-up.
    - *info_function*: Function which is run when clicking on a vector feature. Takes five args: feature (Leaflet), layer (Leaflet), layer key (Vidi), SQL store (Vidi) and map (Leaflet).
    - *point_to_layer*: Leaflet pointToLayer function.
    - *vector_style*: Leaflet vector styling function.
    
- The help buttons now work like toggles, so a second click will close the help box.
    
### Fixed
- Handling of invalid JSON configs, so Node doesn't crash.


## [2019.1.0] - 2019-20-12
### Added
- Implemented a generic pool for puppeteer processes, so there is always a warm chromium browser ready for print.
- Node clustering implemented with default count of workers, which is the cpu core count.
- Sticky sessions implemented so Socket.io works with clustering.
- Redis added as storage for sessions. Just set `redisHost` in `config/config.js`. If not set then file storage will be used.

### Changed
- A lot of optimization of Javascript code. Code that can is lazy loaded.
- The server is now using gzip compression.
- Meets the requirements for a Progressive Web App (PWA) according to Google Lighthouse.

### Fixed
- The startup message set by `startUpModal` is ever shown in print.
- Images in pop-ups will now open in new tab when using Chrome.  

## [2019.1.0.rc3] - 2019-06-11
### Added
- Embed script for easy embedding of Vidi in web pages using a snap-shot token.
- A corresponding UTFGrid layer is now switch on when a raster tile layer is switch on. The UTFGrid layer is providing mouse over on features. Which fields are displayed in mouse over is set in GC2 field properties.
- Download drawings as GeoJSON.
- Comment with version in index.html
- Support of time, date and datetime fields in editor. Only time will be handled in a text field.
- Auto login. WARNING: Insecure and sets cookie with login creds. A build time setting `autoLoginPossible` must be set to `true` to make activation possible. Activation is done in:
    - `extensionConfig.session.autoLogin = true` and optional `extensionConfig.session.autoLoginMaxAge = 3600 * 1000`. The latter defaults to `null`
- Static Map API. Generate PNGs of state snapshot. URL to PNG is available from the Snapshot module.
- Possible to set a welcome message by using `startUpModal` in a config. The user can dismiss the message by either `Close` or `Close and do not show in future`. The latter choise is stored in a cookie.

### Changed
- Layers which have been switch off, will not be removed from legend (old behavior can be set in config)
- No re-load of legend if its not necessary.
- `embed.tmpl` is now a minimal template for embedding in web pages.
- Home button on `embed.tmpl` will set the map to the initial extent if a snapshot-state is invoked.
- Use file based sessions instead of memory based, so sessions can be shared between nodes in a cluster setup.
- Standard template for pop-up can now render videos from URLs in data. Can be set up in GC2.
- Infinity levels in layer tree. The levels are set with the `vidi_sub_group` Meta property in GC2 like: `sub-group 1|sub-group 2|sub-group 3`
- Smaller padding of dynamic loaded vector layers, so less features has to be handled. Padding is set to 0.3 from 1.

### Fixed
- Better wrapping of layer tools when side panel is narrow.
- Snapping bugs.
- SELECT statements like `SELECT * FROM foo WHERE bar LIKE '%foo'` will not longer give problems.
- All Postgres types are now recognized in editor. 

## [2019.1.0.rc2] - 2019-01-03
### Added
- Tentative support of WebGL layer type added.
- Support of MVT base layers.

### Changed
- Optimized rendering of layer tree. Implemented lazy rendering of layer groups and tools. 
- Hide login button if session module is disabled.

## [2019.1.0.rc1] - 2019-14-02
### Added
- Fall back mechanism for base layers. If the current base layer responses with error codes the next one is switched no.
- Touch drag enabled in layer tree.
- Config `activateMainTab` added, which tells Vidi to activate a tab on startup.
- Visual grouping of map tools in GUI.
- Tentative support of Mapbox Vector Tiles (MVT). Needs latest version of GC2 with MVT support. 
- Cross hair cursor when info click is on.
- When drawing or editing with the Editor module, snapping to other vector layers is added.
- Unify filter methods for vector and tile layers.
- After a query with the sqlQuery module is made, its now possible to store the query as a new "virtual" layer. The new layer is a vector layer, which acts like any other vector layer.

### Changed
- State shots are now stored in GC2 database using the new keyvalue API.
- Protected WMS layers requests result in `401` being routed through the WMS backend. A authentication is implemented in order to request protected WMS layers correctly.
- One click activation scheme where the module is activated when clicking the Tab. All others modules will be reset. A typical module should look like this:
- Google API files are no longer requested locally, because things break when Google makes updates. The files are requested remotely and are not cached in Service Workers due to CORS issues. The Google API doesn't work offline anyway. Google API must be set in GC2 config (App.php) with the kay ``
```javascript
module.exports = {
   set: function (o) {},
   init: function () {
     // Reset state and clear any effects of the module
     backboneEvents.get().on("reset:all", () => {});
 
     // Stop listening to any events, deactivate controls, but
     // keep effects of the module until they are deleted manually or reset:all is emitted
     backboneEvents.get().on("deactivate:all", () => {});
 
     // Activates module
     backboneEvents.get().on("on:myModule", () => {});
 
     // Deactivates module
     backboneEvents.get().on("off:myModule", () => {});
   }
 }
 ```

## [2018.2.0.rc1] - 2018-07-12
### Added
- New mode for double base-layers: Overlay base-layers, where the opacity of the top one can be changed
- Filters for WMS single tile layers. Predefine filters in GC2 Meta, which will be displayed as checkboxes in a layertree panel. For now only supports QGIS layers.

### Changed
- Vector filters can now be applied before switching a vector layer on.
- Table view are moved inside the layer tree, which makes it possible to see more than one table at a time.
- Table view clicks now pan to feature - not zooming.
- Popups for raster and vectors are now similar.

### Fixed
- When clicking in a table with points, panning now works.
- Workaround missing Service Workers features in Edge 17/18.
- Filters work in Edge 17/18.
- A lot of smaller issues were fixed.

## [2018.1] - 2018-07-12
### Added
- Specific vector layers can be set to offline. If offline the cached version of the vector layer is always used. Also if browser is reloaded.
- Control to switch all vector layers on and off. See above.
- Vector layers can now be set to two different load strategies: Static and Dynamic. The former is default and will load the entire layer at once. The latter will load only whats inside the view port (plus a buffer) and fetch new data when needed (when zoom/pan occurs). The load strategy is controlled by the GC2 `load_strategy` meta setting. Can be either `s` or `d`.  
- New map controls: Reset zoom, set previous/next extent and box-zoom. The latter now has a button, before this could only be achieved by holding shift down and drag the zoom box. 
- Opacity slider for all tile layers.

### Fixed
- Preset base layer in URL will not longer change to `undefined` when resizing browser during refresh.
- System field with prefix `gc2_` is no longer displayed in Editor attribute form.
- Stalling of print is fixed. 


## [2018.1.0.RC1] - 2018-10-9
### Added
- Drag'n'drop sorting of layers in layer tree. Sorting can be done between layers in a group and groups between groups. Sorting sticks after refresh of browser.
- Third level in layer tree. The third sub-group is set with the `vidi_sub_group` Meta property in GC2.
- Vector layers are now treated equally with tile layers. With the `vidi_layer_type` Meta property set GC2 a layer can be displayed as either tile or vector. Its also possible to switch between tile and vector directly in the layer tree.
- Vector layers can be filtered. An arbitrary number of filter expressions can be applied. 
- Table view of vector layers. See the attributes and link to the geometry on the map.
- Service Workers. Vidi is becoming a Progressive Web App (PWA).
    - Vidi starts without network. And always starts quick.
    - Vector layers are cached, so they can be used without network.
    - A change in source code will generated a new version hash, which will trigger the Service Workers to re-install the application.
    - Offline base layers. Base layers can be partial caches in browser for use without network.
    - Editor. Both tile and vector layers can be edited. Edits can be done without network.
- Side-by-side base layers. Swipe between two base layers.
- Save, restore and share projects. A project comprises the extent of the map, which background map is visible and which layers are turned on, which filters are applied as well as your drawings. You can share a project by sharing a URL. If you are not logged in, projects will be linked to the browser you are using. Otherwise, they will be stored under your user login. It is possible to transfer projects from browser to login.  
- New Kepler.gl module. Select layers in Vidi and start Kepler.gl with them. Kepler.gl is embedded in Vidi.
- Proper implementation of non-tiled layers, which is well suited for layer with live data and heat- and cluster maps. 

### Changed
- New user interface layout in default template. Where are now more space for the module dialogs.
- Leaflet.js updated to newest.
- Print now uses Puppeteer instead of Wkhtmltopdf. Puppeteer can be installed and updated with npm as any other module and its easier to debug.
- Is fully supported only in browsers with Service Workers.

### Deprecated

### Removed
- Layers Search module. This function is now moved to the contrib module vidiSearch.

### Fixed
- Calculation of area on drawing module now works.

### Security
- A lot of modules where updated.

