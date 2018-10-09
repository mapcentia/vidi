# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [CalVer](https://calver.org/).

## [Unreleased]
- Specific vector layers can be cached in browser including applied filters. 


## [2018.1.0.RC1] - 2018-10-9
### Added
- Drag'n'drop sorting of layers in layer tree. Sorting can be done between layers in a group and groups between groups. Sorting sticks after refresh of browser.
- Third level in layer tree. The third sub-group is set with the `vidi_sub_group` property in GC2.
- Vector layers are now treated equally with tile layers. With the `vidi_layer_type` property set GC2 a layer can be displayed as either tile or vector. Its also possible to switch between tile and vector directly in the layer tree.
- Vector layers can be filtered. An arbitrary number of filter expressions can be applied. 
- Table view of vector layers.
- Service Worker. Vidi is becoming a Progressive Web App (PWA).
    - Vidi starts without network.
    - Vector layers are cached, so they can be used without network.
    - A change in source code will generated a new version hash, which will trig the Service Worker to re-install the application.
    - Offline base layers. Base layers can be partial caches in browser for use without network.
    - Editor. Both tile and vector layers can be edited. Edits can be done without network.
- Side-by-side base layers. Swipe between two base layers.
- Save, restore and share projects. A project comprises the extent of the map, which background map is visible and which layers are turned on, which filters are applied as well as your drawings. You can share a project by sharing a URL. If you are not logged in, projects will be linked to the browser you are using. Otherwise, they will be stored under your user login. It is possible to transfer projects from browser to login.  
- New Kepler.gl module. Select layers in Vidi and start Kepler.gl with them. Kepler.gl is embedded in Vidi.

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
- A lot of modules are updated.

