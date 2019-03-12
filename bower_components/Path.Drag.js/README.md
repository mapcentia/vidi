# Path.Drag.js

Add dragging capability to Leaflet path (Polygon, Polyline, Rectangle, Circle, CircleMarker…).


## Example

- [simple example](http://Leaflet.github.io/Path.Drag.js/example/index.html)
- [huge polygon example](http://Leaflet.github.io/Path.Drag.js/example/russia.html)
- [canvas example](http://Leaflet.github.io/Path.Drag.js/example/canvas.html)


## Installation

**This library requires Leaflet version 1.0 or above**

Include `Path.Drag.js` in your javascript files (after including Leaflet itself).

It's available via NPM:

    npm install leaflet.path.drag


## Usage

A `dragging` handler will be attached to the paths instance of your map.
To enable dragging, just do:

    layer.dragging.enable()

To disable:

    layer.dragging.disable()


If you want a path to be draggable as soon as it's added to map, add
`draggable: true` to its options:

    const layer = L.polygon([…], {draggable: true})


## Alternatives:

- https://github.com/w8r/Leaflet.Path.Drag: use it if you want to drag very big path
  with many vertices.
