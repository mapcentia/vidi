# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [CalVer](https://calver.org/).

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
- Some smaller issues were fixed.

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

