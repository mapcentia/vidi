
/**
 * Generates HTML chunks that are later used in layerTree module, no logic or any interaction
 * should be implemented here, only raw markup.
 * 
 * @todo Rewrite layerTree using React or Angular
 */

const regularButtonStyle = `padding: 2px 10px 2px 10px; color: black; border-radius: 4px; height: 22px; margin: 0px;`;

class MarkupGenerator {
    constructor() {}

    getAddButton(layerKeyWithGeom) {
        return (`<button type="button" data-gc2-key="${layerKeyWithGeom}" style="${regularButtonStyle}" 
            data-toggle="tooltip" data-placement="left" title="Add new feature to layer" data-layer-type="tile" class="btn gc2-add-feature gc2-edit-tools">
            <i class="fa fa-plus"></i>
        </button>`);
    }

    getGroupPanel(base64GroupName, name) {
        return (`<div class="panel panel-default panel-layertree" id="layer-panel-${base64GroupName}">
            <div class="panel-heading" role="tab">
                <h4 class="panel-title">
                    <div class="layer-count badge">
                        <span>0</span> / <span></span>
                    </div>
                    <a style="display: block" class="accordion-toggle" data-toggle="collapse" data-parent="#layers" href="#collapse${base64GroupName}">${name}</a>
                </h4>
            </div>
            <ul class="list-group" id="group-${base64GroupName}" role="tabpanel"></ul>
        </div>`);
    }

    getToggleOfflineModeSelectorEnabled() {
        return (`<div class="togglebutton">
                    <label>
                        <input class="js-toggle-offline-mode" type="checkbox"> ${__('Force offline mode')}
                        <span class="badge js-app-is-pending-badge" style="background-color: #C0C0C0;"><i class="fa fa-ellipsis-h"></i> ${__('Pending')}</span>
                        <span class="badge js-app-is-online-badge hidden" style="background-color: #28a745;"><i class="fa fa-signal"></i> Online</span>
                        <span class="badge js-app-is-offline-badge hidden" style="background-color: #dc3545;"><i class="fa fa-times"></i> Offline</span>
                    </label>
                 </div>`);
    }

    getToggleOfflineModeSelectorDisabled() {
        return (`<div class="alert alert-dismissible alert-warning" role="alert">
            <button type="button" class="close" data-dismiss="alert">×</button>
            ${__('This browser does not support Service Workers, some features may be unavailable')}
        </div>`);
    }

    getSubgroupControlRecord(base64SubgroupName, name) {
        return (`<li
        class="layer-item list-group-item"
        data-gc2-subgroup-id="${name}"
        style="min-height: 40px; margin-top: 10px; background-color: white;">
            <div class="js-subgroup-id" style="padding-left: 14px;"></div>
            <div class="js-subgroup-children" id="${base64SubgroupName}" style="padding-left: 20px;"></div>
        </li>`);
    }

    getLayerControlRecord(layerKeyWithGeom, layerKey, layerIsActive, layer, layerType, layerTypeSelector, text, lockedLayer, addButton, displayInfo) {
        let queueFailedButtonStyle = regularButtonStyle + ` background-color: orange; padding-left: 4px; padding-right: 4px;`;
        let queueRejectedByServerButtonStyle = regularButtonStyle + ` background-color: red; padding-left: 4px; padding-right: 4px;`;
        let tooltip = layer.f_table_abstract || ``;

        return (`<li
            class="layer-item list-group-item"
            data-gc2-layer-key="${layerKeyWithGeom}"
            style="min-height: 40px; margin-top: 10px; border-bottom: 1px solid #CCC; background-color: white;">
            <div>
                <div style="display: inline-block;">
                    <div class="checkbox" style="width: 34px;">
                        <label>
                            <input type="checkbox"
                                ${(layerIsActive ? `checked="checked"` : ``)}
                                class="js-show-layer-control"
                                id="${layer.f_table_name}"
                                data-gc2-id="${layer.f_table_schema}.${layer.f_table_name}"
                                data-gc2-layer-type="${layerType}">
                        </label>
                    </div>
                </div>

                <div style="display: inline-block;">${layerTypeSelector}</div>

                <div style="display: inline-block;">
                    <span>${text}${lockedLayer}</span>
                    <button type="button" class="hidden btn btn-sm btn-secondary js-statistics-field js-failed-add" style="${queueFailedButtonStyle}" disabled>
                        <i class="fa fa-plus"></i> <span class="js-value"></span>
                    </button>
                    <button type="button" class="hidden btn btn-sm btn-secondary js-statistics-field js-failed-update" style="${queueFailedButtonStyle}" disabled>
                        <i class="fa fa-edit"></i> <span class="js-value"></span>
                    </button>
                    <button type="button" class="hidden btn btn-sm btn-secondary js-statistics-field js-failed-delete" style="${queueFailedButtonStyle}" disabled>
                        <i class="fa fa-minus-circle"></i> <span class="js-value"></span>
                    </button>
                    <button type="button" class="hidden btn btn-sm btn-secondary js-statistics-field js-rejectedByServer-add" style="${queueRejectedByServerButtonStyle}" disabled>
                        <i class="fa fa-plus"></i> <span class="js-value"></span>
                    </button>
                    <button type="button" class="hidden btn btn-sm btn-secondary js-statistics-field js-rejectedByServer-update" style="${queueRejectedByServerButtonStyle}" disabled>
                        <i class="fa fa-edit"></i> <span class="js-value"></span>
                    </button>
                    <button type="button" class="hidden btn btn-sm btn-secondary js-statistics-field js-rejectedByServer-delete" style="${queueRejectedByServerButtonStyle}" disabled>
                        <i class="fa fa-minus-circle"></i> <span class="js-value"></span>
                    </button>
                    <button type="button" data-gc2-id="${layerKey}" class="hidden btn btn-sm btn-secondary js-clear" style="${regularButtonStyle}">
                        <i class="fa fa-undo"></i>
                    </button>
                </div>

                <div style="display: inline-block;">
                    ${addButton}
                    <span data-toggle="tooltip" data-placement="left" title="${tooltip}"
                        style="visibility: ${displayInfo}" class="info-label label label-primary" data-gc2-id="${layerKey}">Info</span>
                </div>
                
                <div style="display: inline-block;">
                    <a href="javascript:void(0);" class="js-toggle-filters">${__(`Filters`)} (<span class="js-toggle-filters-number-of-filters">0</span>)</a>
                    <a href="javascript:void(0);" class="js-toggle-table-view">${__(`Table view`)}</a>
                </div>

                <div class="js-rejectedByServerItems hidden" style="width: 100%; padding-left: 15px; padding-right: 10px; padding-bottom: 10px;"></div>
            </div>
            <div class="js-layer-settings"></div>
        </li>`);
    }

    getEditingButtons() {
        return `<div class="btn-group btn-group-justified">
            <div class="btn-group">
                <button class="btn btn-primary btn-xs ge-start-edit">
                    <i class="fa fa-pencil-alt" aria-hidden="true"></i>
                </button>
            </div>
            <div class="btn-group">
                <button class="btn btn-primary btn-xs ge-delete">
                    <i class="fa fa-trash" aria-hidden="true"></i>
                </button>
            </div>
        </div>`;
    }

    getLayerTypeSelector(selectorLabel, tileLayerIcon, vectorLayerIcon) {
        return (`<div class="dropdown">
            <button style="padding: 2px; margin: 0px;" class="btn btn-default dropdown-toggle" type="button"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                <span class="js-dropdown-label">${selectorLabel}</span>
                <span class="caret"></span>
            </button>
            <ul class="dropdown-menu">
                <li>
                    <a class="js-layer-type-selector-tile" href="javascript:void(0)">${tileLayerIcon} ${__('Tile')}</a>
                </li>
                <li>
                    <a class="js-layer-type-selector-vector" href="javascript:void(0)">${vectorLayerIcon} ${__('Vector')}</a>
                </li>
            </ul>
        </div>`);
    }
}

module.exports = MarkupGenerator;