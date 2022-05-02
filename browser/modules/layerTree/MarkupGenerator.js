/*
 * @author     Alexander Shumilov
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

/**
 * Generates HTML chunks that are later used in layerTree module, no logic or any interaction
 * should be implemented here, only raw markup.
 *
 * @todo Rewrite layerTree using React
 */

import {LAYER, ICONS} from './constants';

const regularButtonStyle = ``;

class MarkupGenerator {
    constructor() {
    }

    getAddButton(layerKeyWithGeom) {
        let addButtonStyle = regularButtonStyle.replace(`padding: 2px 10px 2px 10px;`, `padding: 6px 10px 6px 10px;`);
        return (`<button type="button" data-gc2-key="${layerKeyWithGeom}" style="${regularButtonStyle} visibility: hidden;"
            data-toggle="tooltip" data-placement="left" title="Add new feature to layer" data-layer-type="tile" class="btn btn-sm btn-outline-success btn-floating gc2-add-feature gc2-edit-tools">
            <i class="fa fa-plus"></i>
        </button>`);
    }

    getGroupPanel(base64GroupName, name, addGroupCheckbox = false) {
        return (`<div class="accordion-item panel-layertree" id="layer-panel-${base64GroupName}" xmlns="http://www.w3.org/1999/html">
                <h2 class="accordion-header" style="display: flex; align-items: center">
                    <button class="accordion-button collapsed js-toggle-layer-panel" data-mdb-toggle="collapse" data-parent="#layers" data-mdb-target="#group-${base64GroupName}" aria-expanded="false" aria-control="collapseExample">${name}
                    
                    </button>
                    <div class="layer-count badge bg-primary" style="font-size: 12px">
                        <span>0</span> / <span></span>
                    </div>
                    <div style="align-items: center; padding-left: 0.2em; margin-bottom: 0; display: ${addGroupCheckbox ? "flex" : "flex"}" class="form-check" id="group-check-box-${base64GroupName}">
                        <label class="form-check-label">
                            <input class="form-check-input" type="checkbox" data-gc2-group-name="${name}" />
                        </label>
                    </div>
                    <i class="material-icons layer-move-vert">more_vert</i>
                </h2>
            <div class="list-group accordion-collapse collapse" id="group-${base64GroupName}" role="tabpanel"></div>
        </div>`);
    }

    getToggleOfflineModeSelectorEnabled() {
        return (`<div class="panel panel-default">
            <div class="panel-body">
                ${__('Network status')}
                <span class="badge js-app-is-pending-badge" style="background-color: #C0C0C0;">
                    <i class="fa fa-ellipsis-h"></i> ${__('Pending')}
                </span>
                <span class="badge js-app-is-online-badge hidden" style="background-color: #28a745;">
                    <i class="fa fa-signal"></i> Online
                </span>
                <span class="badge js-app-is-offline-badge hidden" style="background-color: #dc3545;">
                    <i class="fa fa-times"></i> Offline
                </span>
                <span class="js-set-all-layer-offline-mode-container">
                    ${__('Set all layers to be')}: <a href="javascript:void(0);" class="js-set-all-layer-to-be-online">${__('Online')}</a> | <a href="javascript:void(0);" class="js-set-all-layer-to-be-offline">${__('Offline')}</a>
                </span>
            </div>
        </div>`);
    }

    getToggleOfflineModeSelectorDisabled() {
        return (`<div class="alert alert-dismissible alert-warning" role="alert">
            <button type="button" class="close" data-dismiss="alert">×</button>
            ${__('This browser does not support Service Workers, some features may be unavailable')}
        </div>`);
    }

    getSubgroupControlRecord(base64SubgroupName, name, level, addGroupCheckbox = false ) {
        return (`<li
        class="layer-item list-group-item list-subgroup-item"
        data-gc2-subgroup-id="${name}"
        style="min-height: 36px; margin-top: 1px; background-color: white; border-bottom: 1px solid #CCC;">
            <span style="display: ${addGroupCheckbox ? "inline" : "none"}; margin-left: -2px" class="checkbox">
                <label class="form-check-label">
                    <input class="form-check-input" type="checkbox" data-gc2-subgroup-name="${name}" data-gc2-subgroup-level="${level}">
                </label>
            </span>
            <button style="margin-left: ${addGroupCheckbox ? "-18px" : "0"}" type="button" class="btn btn-outline-primary btn-floating btn-sm js-subgroup-toggle-button">
                <i class="fa fa-arrow-down"></i>
            </button>
            <div class="js-subgroup-id" style="display: inline; margin-left: 0"></div>
            <div class="js-subgroup-children" id="${base64SubgroupName}" style="padding-left: 30px;"></div>
        </li>`);
    }

    getLayerControlRecord(layerKeyWithGeom, layerKey, layerIsActive, layer, layerType, layerTypeSelector, text, lockedLayer, addButton, displayInfo, isSubLayer, moduleState, disableCheckBox, parentLayerKeys, childLayerKeys) {
        let queueFailedButtonStyle = regularButtonStyle + ` background-color: orange; padding-left: 4px; padding-right: 4px;`;
        let queueRejectedByServerButtonStyle = regularButtonStyle + ` background-color: red; padding-left: 4px; padding-right: 4px;`;
        let tooltip = layer.f_table_abstract || ``;

        return (`
        <li class="layer-item list-group-item" data-gc2-layer-key="${layerKeyWithGeom}">
                <div style="display: flex; justify-content: space-between;flex-wrap: nowrap; padding: 7px 0">
                    <div style="display: flex; width: 100%; justify-content: space-between; align-items: center">
                
                    <div style="display: flex; align-items: center">
                            <div class="checkbox">
                                <label class="form-check-label" style="align-items: center; display: flex">
                                    <input class="form-check-input js-show-layer-control" type="checkbox"
                                        ${(layerIsActive ? `checked="checked"` : ``)}
                                        ${(disableCheckBox ? `disabled` : ``)}
                                        id="${layer.f_table_name}"
                                        data-gc2-id="${layer.f_table_schema}.${layer.f_table_name}"
                                        data-gc2-layer-type="${layerType}">
                                </label>
                            </div>

                        <div style="">${layerTypeSelector}</div>

                       
                        <div style="display: flex; flex-wrap: nowrap" id="layer-information">
                            <div>
                                ${text}${lockedLayer}
                            </div>
                            <div class="js-tiles-contain-data" style="visibility: ${moduleState.tileContentCache[layerKey] ? "inline" : "hidden"};" data-toggle="tooltip" data-placement="right"
                                    title="${__("Layer is visible")}"><i class="fa fa-eye info-icon" style="color: green;"></i></div>
                        </div>
                        
                        <div style="display: flex; flex-wrap: nowrap">
                                <div class="js-layer-is-disabled" style="display: ${disableCheckBox ? "inline" : "none"};" data-toggle="tooltip" data-placement="right"
                                    title="${__("Locked")}"><span class="material-icons" style="font-size: 13px; color: red">lock</span></div>
                                <div class="js-layer-has-parents info-icon" style="display: ${parentLayerKeys.length > 0 ? "inline" : "none"};" data-toggle="tooltip" data-placement="right"
                                    title="${__("Parents")}: ${parentLayerKeys.length > 0 ? parentLayerKeys.join(", ") : ""}"><span class="material-icons" style="font-size: 13px">arrow_upward</span></div>
                                <div class="js-layer-has-children info-icon" style="display: ${childLayerKeys.length > 0 ? "inline" : "none"};" data-toggle="tooltip" data-placement="right"
                                    title="${__("Children")}: ${childLayerKeys.length > 0 ? childLayerKeys.join(", ") : ""}"><span class="material-icons" style="font-size: 13px">arrow_downward</span></div>
                                <div style="display: none" class="_gc2_layer_sort_id">(${layer.sort_id})</div>
                        </div>
                        
                       </div>

                       <div style="display: inline-block">
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


                        <div class="js-toggle-layer-offline-mode-container" style="display: none;">
                            <div class="btn-group btn-group-sm" role="group" id="layer-tools-offline">
                                <button type="button" data-layer-key="${layerKey}" class="btn btn-light js-set-online" title="${__(`Fetch layer data from server`)}" style="padding: 4px" disabled>
                                    <i class="fa fa-signal"></i>
                                </button>
                                <button type="button" data-layer-key="${layerKey}" class="btn btn-light js-set-offline" title="${__(`Fetch layer data from cache`)}" style="padding: 4px" disabled>
                                    <i class="fas fa-database"></i>
                                </button>
                                <button type="button" data-layer-key="${layerKey}" class="btn btn-light-secondary js-refresh" title="${__(`Refresh existing cache for layer`)}" style="padding: 4px" disabled>
                                    <i class="fa fa-refresh"></i>
                                </button>
                                <button type="button" data-layer-key="${layerKey}" class="btn btn-light js-bbox" title="${__(`Dynamic layer is cached only within the last requested bounding box`)}" style="padding: 4px; display: none;">
                                    <i class="fa fa-exclamation"></i>
                                </button>
                            </div>
                        </div>

                        <div class="js-toggles-container" style="display: none; flex-wrap: wrap;">
                            <div id="layer-tools-search">
                                <button class="js-toggle-search btn btn-sm btn-floating" data-toggle="tooltip" data-mdb-trigger="hover" data-placement="left" title="${__(`Search`)}" >
                                    <i class="fa fa-search"></i>
                                </button>
                            </div>
                            <div id="layer-tools-opacity">
                                <button class="js-toggle-opacity btn btn-sm btn-floating" data-toggle="tooltip" data-mdb-trigger="hover" data-placement="left" title="${__(`Opacity`)}">
                                    <i class="fa fa-tint"></i>
                                </button>
                            </div>
                            <div id="layer-tools-labels">
                                <button class="js-toggle-labels btn btn-sm btn-floating" data-toggle="tooltip" data-mdb-trigger="hover" data-placement="left" title="${__(`Labels`)}">
                                    <i class="fa fa-tag"></i>
                                </button>
                            </div>
                            <div id="layer-tools-table">
                                <button class="js-toggle-table btn btn-sm btn-floating" data-toggle="tooltip" data-mdb-trigger="hover" data-placement="left" title="${__(`Table view`)}">
                                    <i class="fa fa-table"></i>
                                </button>
                            </div>
                            <div id="layer-tools-load">
                                <button class="js-toggle-load-strategy btn btn-sm btn-floating" data-toggle="tooltip" data-mdb-trigger="hover" data-placement="left" title="${__(`Load strategy`)}">
                                    <i class="fa fa-th"></i>
                                </button>
                            </div>
                            <div id="layer-tools-filters">
                                <button class="js-toggle-filters btn btn-sm btn-floating" data-toggle="tooltip" data-mdb-trigger="hover" data-placement="left" title="${__(`Filters`)}" >
                                    <i class="fa fa-filter"></i>
                                </button>
<!--                            <span class="js-toggle-filters-number-of-filters">0</span>-->
                            </div>
                            <div>
                            
                                ${addButton}
                            </div>
                        </div>
                            <div>
                                <a href="javascript:void(0);" data-toggle="tooltip" data-placement="left" title="${tooltip}" style="visibility: ${displayInfo};" class="info-label" data-gc2-id="${layerKey}">${__(`Info`)}</a>
                            </div>
                    </div>
                    <div style="justify-items: flex-end; display: flex; align-items: center"><i style="font-size: 24px;" class="material-icons layer-move-vert">more_vert</i></div>
</div>
                </div>
            <div class="js-rejectedByServerItems hidden" style="width: 100%; padding-left: 15px; padding-right: 10px; padding-bottom: 10px;"></div>
            <div class="js-layer-settings-filters" style="display: none;"></div>
            <div class="js-layer-settings-load-strategy" style="display: none;"></div>
            <div class="js-layer-settings-opacity" style="display: none;"></div>
            <div class="js-layer-settings-labels" style="display: none;"></div>
            <div class="js-layer-settings-search" style="display: none;"></div>
            <div class="js-layer-settings-table" id="table_view-${layerKey.replace(".", "_")}" style="display: none;"></div>
            </div>
        </li>`);
    }

    getEditingButtons() {
        return `<div class="vidi-popup-content">
                    <button class="btn btn-primary btn-xs ge-start-edit">
                        <i class="fa fa-pencil-alt" aria-hidden="true" ></i>
                    </button>
                    <button class="btn btn-danger btn-xs ge-delete">
                        <i class="fa fa-trash" aria-hidden="true"></i>
                    </button>
                </div>`;
    }

    getLayerTypeSelector(selectorLabel, allowedTypes) {
        let selectors = [];
        if (allowedTypes.indexOf(LAYER.VECTOR) > -1) {
            selectors.push(`<li><a class="js-layer-type-selector-vector" href="javascript:void(0)">${ICONS[LAYER.VECTOR]} ${__('Vector')}</a></li>`);
        }

        if (allowedTypes.indexOf(LAYER.RASTER_TILE) > -1) {
            selectors.push(`<li><a class="js-layer-type-selector-tile" href="javascript:void(0)">${ICONS[LAYER.RASTER_TILE]} ${__('Raster tile')}</a></li>`);
        }

        if (allowedTypes.indexOf(LAYER.VECTOR_TILE) > -1) {
            selectors.push(`<li><a class="js-layer-type-selector-vector-tile" href="javascript:void(0)">${ICONS[LAYER.VECTOR_TILE]} ${__('Vector tile')}</a></li>`);
        }

        if (allowedTypes.indexOf(LAYER.WEBGL) > -1) {
            selectors.push(`<li><a class="js-layer-type-selector-webgl" href="javascript:void(0)">${ICONS[LAYER.WEBGL]} ${__('WebGL')}</a></li>`);
        }

        return (`<div class="btn-group">
            <button style="" class="btn btn-default dropdown-toggle btn-sm"  data-mdb-toggle="dropdown" type="button"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                <span class="js-dropdown-label" style="">${selectorLabel}</span>
            </button>
            <ul class="dropdown-menu">${selectors.join(``)}</ul>
        </div>`);
    }
}

module.exports = MarkupGenerator;
