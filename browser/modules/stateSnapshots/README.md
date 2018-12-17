### State API

The `state` is the Vidi module, which manages global state of the Vidi application. State of the application is the list of settings that are active now, like map extent, zoom level, list of displayed layers etc. `stateSnapshots` module allows creating state snapshots  and sharing them with collaborators (using the user interface of sharing it via link).

### Usage in modules

Any module can benefit in following ways from using the `state` module API:

1. Restoring module state after page refresh;
2. Storing and sharing module state via state snapshots.

`state` module listens to specific events that modules emit. If the specific event is emitted, then the state of the listened module is requested by `state` module and the global state is updated and automatically stored in browser memory. Module that integrates with state snapshots API, has to implement `getState()` and `applyState()` methods.

### Integration of modules

For example, there is a module `demo` that controls the map base layer. Module sets the base layer using its string identifier and it can return the identifier of the current base layer. In order to set the previously selected base layer after page refresh and keep the base layer setting in state snapshots following modification were made to module:

```
'use strict';
const MODULE_NAME = `demo`;
let _self = false;

module.exports = module.exports = {
    set: function (o) { ... },
    init: () => {
        // ### ! ###
        // state.listenTo() is called in init() method and
        // prepares demo module to be used with the state snapshots API 
        state.listenTo(MODULE_NAME, _self);

        // ### ! ###
        // state.listen() makes state module to listen for base-layer-was-set
        // event of the demo module
        state.listen(MODULE_NAME, `base-layer-was-set`);
        
        $(`.set-base-layer`).change((event) => {
            // ### ! ###
            // Using backboneEvents to announce that base-layer-was-set event
            // happened, so the state of the demo module has to be queried using getState()
            backboneEvents.get().trigger(`${MODULE_NAME}:base-layer-was-set`);
        });

        // ### ! ###
        // state.getModuleState() returns the latest available state of
        // the demo module, for example, after page refresh
        state.getModuleState(MODULE_NAME).then(({ baseLayer }) => {
            _self.setBaseLayer(baseLayer);
        });
    },

    setBaseLayer: (baseLayerId) => { ... }
    getBaseLayer: () => { ... }

    /**
     * ### ! ###
     * Returns current module state
     */
    getState: () => { return { baseLayer: _self.getBaseLayer() }; },

    /**
     * ### ! ###
     * Applies provided module state
     */
    applyState: ({ baseLayer }) => { _self.setBaseLayer(baseLayer); },
};
```
