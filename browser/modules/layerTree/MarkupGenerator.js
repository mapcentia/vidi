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
        return (`<button type="button" data-gc2-key="${layerKeyWithGeom}" style="display: none;" 
            data-toggle="tooltip" data-placement="left" title="Add new feature to layer" data-layer-type="tile" class="btn btn-light btn-sm gc2-add-feature gc2-edit-tools">
            <i class="bi bi-plus-square"></i>
        </button>`);
    }

    getGroupPanel(base64GroupName, name, addGroupCheckbox = false) {
        return (`<div class="card panel-layertree" id="layer-panel-${base64GroupName}" xmlns="http://www.w3.org/1999/html">
                <div class="card-body p-0">
                    <div class="d-flex align-items-center p-3">
                        <span style="display: ${addGroupCheckbox ? "flex" : "none"}" class="form-check align-items-center" id="group-check-box-${base64GroupName}">
                            <input class="form-check-input" type="checkbox" data-gc2-group-name="${name}">
                        </span>
                        <div class="position-relative flex-fill">
                            <a class="text-uppercase link-dark stretched-link accordion-toggle js-toggle-layer-panel collapsed" data-bs-toggle="collapse" data-parent="#layers" href="#collapse${base64GroupName}">${name}</a>
                        </div>
                        <div class="layer-count badge bg-secondary">
                            <span>0</span> / <span></span>
                        </div>
                        <i class="bi-grip-vertical layer-move-vert"></i>
                    </div>
                    <ul class="list-group clearfix" id="group-${base64GroupName}" role="tabpanel"></ul>
                </div>
        </div>`);
    }

    getToggleOfflineModeSelectorEnabled() {
        return (`
            <div class="d-flex mb-3 gap-2">
                ${__('Network status')}
                <span class="badge text-bg-secondary js-app-is-pending-badge">
                    <i class="bi bi-three-dots"></i> ${__('Pending')}
                </span>
                <span class="badge text-bg-success js-app-is-online-badge hidden">
                    <i class="bi bi-signal"></i> Online
                </span>
                <span class="badge text-bg-danger js-app-is-offline-badge hidden">
                    Offline
                </span>
                <span class="js-set-all-layer-offline-mode-container">
                    ${__('Set all layers to be')}: <a href="javascript:void(0);" class="js-set-all-layer-to-be-online">${__('Online')}</a> | <a href="javascript:void(0);" class="js-set-all-layer-to-be-offline">${__('Offline')}</a>
                </span>
            </div>
        `);
    }

    getToggleOfflineModeSelectorDisabled() {
        return (`<div class="alert alert-dismissible alert-warning" role="alert">
            <button type="button" class="close" data-dismiss="alert">×</button>
            ${__('This browser does not support Service Workers, some features may be unavailable')}
        </div>`);
    }

    getSubgroupControlRecord(base64SubgroupName, name, level, addGroupCheckbox = false) {
        return (`<li
        class="layer-item list-group-item list-subgroup-item d-flex flex-column"
        data-gc2-subgroup-id="${name}">
            <div class="d-flex align-items-center gap-1">
                <span style="display: ${addGroupCheckbox ? "inline" : "none"};" class="togglebutton">
                    <label>
                        <input type="checkbox" data-gc2-subgroup-name="${name}" data-gc2-subgroup-level="${level}">
                    </label>
                </span>
                <button type="button" class="btn btn-light btn-sm js-subgroup-toggle-button">
                    <i class="bi bi-arrow-down"></i>
                </button>
                <div class="js-subgroup-id d-flex align-items-center flex-grow-1"></div>
            </div>
            <div class="js-subgroup-children" id="${base64SubgroupName}"></div>
        </li>`);
    }

    getLayerControlRecord(layerKeyWithGeom, layerKey, layerIsActive, layer, layerType, layerTypeSelector, text, lockedLayer, addButton, displayInfo, isSubLayer, moduleState, disableCheckBox, parentLayerKeys, childLayerKeys) {
        let queueFailedButtonStyle = regularButtonStyle + ` color: orange;`;
        let queueRejectedByServerButtonStyle = regularButtonStyle + ` color: red;`;
        let tooltip = layer.f_table_abstract || ``;
        const toolBtnClass = `btn btn-light btn-sm`

        return (`
        <li class="layer-item list-group-item" data-gc2-layer-key="${layerKeyWithGeom}">
            <div class="d-flex align-items-center">
                <div class="d-flex w-100 align-items-center flex-wrap gap-1">
                    <!-- switch and title-->
                    <div class="d-flex align-items-center flex-grow-1 gap-1 mb-2" style="min-height: 31px">
                                                                       <div class="form-check form-switch d-flex align-items-center">
                                                                       <label>
                                                                       <input type="checkbox"
                                                                       ${(layerIsActive ? `checked="checked"` : ``)}
                                                                       ${(disableCheckBox ? `disabled` : ``)}
                                                                       class="js-show-layer-control form-check-input"
                                                                       id="${layer.f_table_name}"
                                                                       data-gc2-id="${layer.f_table_schema}.${layer.f_table_name}"
                                                                       data-gc2-layer-type="${layerType}">
                                                                       ${text}
                                                                       </label>
                                                                       </div>
                                                                       
                                                                       <div id="layer-information">
                                                                       <div class="d-flex align-items-center gap-1">
                                                                       ${lockedLayer}
                                                                       <span class="js-tiles-contain-data" style="display: ${moduleState.tileContentCache[layerKey] ? "inline" : "none"};" data-toggle="tooltip" data-placement="right"
                                                                       title="${__("Layer is visible")}"><i class="bi bi-eye info-icon text-success"></i></span>
                                                                       <span class="js-layer-is-disabled" style="display: ${disableCheckBox ? "inline" : "none"};" data-toggle="tooltip" data-placement="right"
                                                                       title="${__("Locked")}"><i class="bi bi-lock text-danger"></i></span>
                                                                       <span class="js-layer-has-parents info-icon" style="display: ${parentLayerKeys.length > 0 ? "inline" : "none"};" data-toggle="tooltip" data-placement="right"
                                                                       title="${__("Parents")}: ${parentLayerKeys.length > 0 ? parentLayerKeys.join(", ") : ""}"><i class="bi bi-arrow-up"></i></span>
                                                                       <span class="js-layer-has-children info-icon" style="display: ${childLayerKeys.length > 0 ? "inline" : "none"};" data-toggle="tooltip" data-placement="right"
                                                                       title="${__("Children")}: ${childLayerKeys.length > 0 ? childLayerKeys.join(", ") : ""}"><i class="bi bi-arrow-down"></i></span>
                                                                       <span style="display: none" class="_gc2_layer_sort_id">(${layer.sort_id})</span>
                                                                       </div>
                                                                       </div>
                                                                       </div>
                    <!-- tools -->
                    <div class="d-flex align-items-center gap-1 mb-2"> 
                                                                        <div>${layerTypeSelector}</div>
                                                                        ${addButton}
                                                                        <button data-toggle="tooltip" data-placement="left" title="${tooltip}" style="display: ${displayInfo};" class="btn btn-light btn-sm info-label" data-gc2-id="${layerKey}"><i class="bi bi-info-square"></i></a></button>
                                                    </div>
     
                </div>
                <div class="d-flex align-items-center align-self-baseline ms-1">
                    <button data-bs-animation="0" disabled class="btn btn-light btn-sm js-settings-panel-btn" role="button" data-bs-toggle="collapse" id="settings-${layer.f_table_schema}-${layer.f_table_name}-btn" data-bs-target="#settings-${layer.f_table_schema}-${layer.f_table_name}" aria-expanded="false" aria-controls="collapseExample"><i class="bi bi-three-dots"></i></button>
                    <i class="bi-grip-vertical ms-auto layer-move-vert"></i>
                </div>
            </div>  
            <!-- queue -->
                                           <div class="d-flex align-items-center gap-1">
                                           <button type="button" class="hidden btn btn-sm btn-light js-statistics-field js-failed-add mb-2" style="${queueFailedButtonStyle}" disabled>
                                           <i class="bi bi-plus-square"></i> <span class="js-value"></span>
                                           </button>
                                           <button type="button" class="hidden btn btn-sm btn-light js-statistics-field js-failed-update mb-2" style="${queueFailedButtonStyle}" disabled>
                                           <i class="bi bi-pencil"></i> <span class="js-value"></span>
                                           </button>
                                           <button type="button" class="hidden btn btn-sm btn-light js-statistics-field js-failed-delete mb-2" style="${queueFailedButtonStyle}" disabled>
                                           <i class="fa bi-dash-square"></i> <span class="js-value"></span>
                                           </button>
                                           <button type="button" class="hidden btn btn-sm btn-light js-statistics-field js-rejectedByServer-add mb-2" style="${queueRejectedByServerButtonStyle}" disabled>
                                           <i class="bi bi-plus-square"></i> <span class="js-value"></span>
                                           </button>
                                           <button type="button" class="hidden btn btn-sm btn-light js-statistics-field js-rejectedByServer-update mb-2" style="${queueRejectedByServerButtonStyle}" disabled>
                                           <i class="bi bi-pencil"></i> <span class="js-value"></span>
                                           </button>
                                           <button type="button" class="hidden btn btn-sm btn-light js-statistics-field js-rejectedByServer-delete mb-2" style="${queueRejectedByServerButtonStyle}" disabled>
                                           <i class="bi bi-dash-square"></i> <span class="js-value"></span>
                                           </button>
                                           <button type="button" data-gc2-id="${layerKey}" class="hidden btn btn-sm btn-light js-clear mb-2" style="${regularButtonStyle}">
                                           <i class="bi bi-arrow-counterclockwise"></i>
                                           </button>
                                           </div>
            <div class="collapse" id="settings-${layer.f_table_schema}-${layer.f_table_name}" style="transition-duration: 0s">
                                                                                                  <div class="d-flex align-items-center gap-3">
                                                                                                  <div class="js-toggles-container" style="display: none;">
                                                                                                  <div style="display: flex; align-items: center;" class="gap-1">
                                                                                                  <span id="layer-tools-search">
                                                                                                  <button href="javascript:void(0);" class="${toolBtnClass} js-toggle-search js-toggle-btn" >
                                                                                                  <i data-container="body" data-toggle="tooltip" data-placement="right" title="${__(`Search`)}" class="bi bi-search"></i>
                                                                                                  </button>
                                                                                                  </span>
                                                                                                  <span id="layer-tools-opacity">
                                                                                                  <button href="javascript:void(0);" class="${toolBtnClass} js-toggle-opacity js-toggle-btn">
                                                                                                  <i data-container="body" data-toggle="tooltip" data-placement="right" title="${__(`Opacity`)}" class="bi bi-droplet"></i>
                                                                                                  </button>
                                                                                                  </span>
                                                                                                  <span id="layer-tools-labels">
                                                                                                  <button href="javascript:void(0);" class="${toolBtnClass} js-toggle-labels js-toggle-btn">
                                                                                                  <i data-container="body" data-toggle="tooltip" data-placement="right" title="${__(`Labels`)}" class="bi bi-tag"></i>
                                                                                                  </button>
                                                                                                  </span>
                                                                                                  <span id="layer-tools-table">
                                                                                                  <button href="javascript:void(0);" class="${toolBtnClass} js-toggle-table js-toggle-btn">
                                                                                                  <i data-container="body" data-toggle="tooltip" data-placement="right" title="${__(`Table view`)}" class="bi bi-table"></i>
                                                                                                  </button>
                                                                                                  </span>
                                                                                                  <span id="layer-tools-style">
                                                                                                  <button href="javascript:void(0);" class="${toolBtnClass} js-toggle-style js-toggle-btn">
                                                                                                  <i data-container="body" data-toggle="tooltip" data-placement="right" title="${__(`Style function`)}" class="bi bi-palette"></i>
                                                                                                  </button>
                                                                                                  </span>
                                                                                                  <span id="layer-tools-load">
                                                                                                  <button href="javascript:void(0);" class="${toolBtnClass} js-toggle-load-strategy js-toggle-btn">
                                                                                                  <i data-container="body" data-toggle="tooltip" data-placement="right" title="${__(`Load strategy`)}" class="bi bi-cloud"></i>
                                                                                                  </button>
                                                                                                  </span>
                                                                                                  <span id="layer-tools-filters">
                                                                                                  <button href="javascript:void(0);" class="${toolBtnClass} js-toggle-filters position-relative js-toggle-btn">
                                                                                                  <i data-container="body" data-toggle="tooltip" data-placement="right" title="${__(`Filters`)}" class="bi bi-filter"></i>
                                                                                                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger d-none">
                                                                                                  <span class="js-toggle-filters-number-of-filters">!</span>
                                                                                                                    </span>
                                                                                                  </button>
                                                                                                  </span>
                                                                                                  <span id="layer-tools-download">
                                                                                                  <button href="javascript:void(0);" class="${toolBtnClass} js-toggle-download js-toggle-btn">
                                                                                                  <i data-container="body" data-toggle="tooltip" data-placement="right" title="${__(`Download`)}" class="bi bi-download"></i>
                                                                                                  </button>
                                                                                                  </span>
                                                                                                  </div>
                                                                                                  </div>
                                                                                                  <div class="js-toggle-layer-offline-mode-container" style="display: none;">
                                                                                                  <div class="d-flex align-items-center" role="group" id="layer-tools-offline">
                                                                                                  <button type="button" data-layer-key="${layerKey}" class="btn btn-light btn-sm js-set-online" title="${__(`Fetch layer data from server`)}" disabled>
                                                                                                  <i class="bi bi-wifi"></i>
                                                                                                  </button>
                                                                                                  <button type="button" data-layer-key="${layerKey}" class="btn btn-light btn-sm js-set-offline" title="${__(`Fetch layer data from cache`)}" disabled>
                                                                                                  <i class="bi bi-database"></i>
                                                                                                  </button>
                                                                                                  <button type="button" data-layer-key="${layerKey}" class="btn btn-light btn-sm js-refresh" title="${__(`Refresh existing cache for layer`)}" disabled>
                                                                                                  <i class="bi bi-arrow-clockwise"></i>
                                                                                                  </button>
                                                                                                  <button type="button" data-layer-key="${layerKey}" class="btn btn-light btn-sm js-bbox" title="${__(`Dynamic layer is cached only within the last requested bounding box`)}" style="padding: 4px; display: none;">
                                                                                                  <i class="bi bi-exclamation"></i>
                                                                                                  </button>
                                                                                                  </div>
                                                                                                  </div>
                                                                                                  </div>
                                                                                                  <div class="js-rejectedByServerItems hidden" style="width: 100%; padding-left: 15px; padding-right: 10px; padding-bottom: 10px;"></div>
                                                                                                  <div class="js-layer-settings js-layer-settings-filters" style="display: none;"></div>
                                                                                                  <div class="js-layer-settings js-layer-settings-load-strategy" style="display: none;"></div>
                                                                                                  <div class="js-layer-settings js-layer-settings-opacity" style="display: none;"></div>
                                                                                                  <div class="js-layer-settings js-layer-settings-labels" style="display: none;"></div>
                                                                                                  <div class="js-layer-settings js-layer-settings-search" style="display: none;"></div>
                                                                                                  <div class="js-layer-settings js-layer-settings-style" style="display: none;"></div>
                                                                                                  <div class="js-layer-settings js-layer-settings-download" style="display: none;"></div>
                                                                                                  <div class="js-layer-settings js-layer-settings-table" id="table_view-${layerKey.replace(".", "_")}" style="display: none;"></div>
        </li>`);
    }

    getLayerTypeSelector(selectorLabel, allowedTypes) {
        let selectors = [];
        if (allowedTypes.indexOf(LAYER.VECTOR) > -1) {
            selectors.push(`<li><a class="js-layer-type-selector dropdown-item" data-layer-type="vector" href="javascript:void(0)">${ICONS[LAYER.VECTOR]} ${__('Vector')}</a></li>`);
        }

        if (allowedTypes.indexOf(LAYER.RASTER_TILE) > -1) {
            selectors.push(`<li><a class="js-layer-type-selector dropdown-item" data-layer-type="tile" href="javascript:void(0)">${ICONS[LAYER.RASTER_TILE]} ${__('Raster tile')}</a></li>`);
        }

        if (allowedTypes.indexOf(LAYER.VECTOR_TILE) > -1) {
            selectors.push(`<li><a class="js-layer-type-selector dropdown-item" data-layer-type="vector-tile" href="javascript:void(0)">${ICONS[LAYER.VECTOR_TILE]} ${__('Vector tile')}</a></li>`);
        }

        if (allowedTypes.indexOf(LAYER.WEBGL) > -1) {
            selectors.push(`<li><a class="js-layer-type-selector dropdown-item" data-layer-type="webgl" href="javascript:void(0)">${ICONS[LAYER.WEBGL]} ${__('WebGL')}</a></li>`);
        }

        return (`<div class="dropdown">
            <button class="btn btn-light btn-sm dropdown-toggle" type="button"
                data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                <span class="js-dropdown-label">${selectorLabel}</span>
            </button>
            <ul class="dropdown-menu">${selectors.join(``)}</ul>
        </div>`);
    }
}

module.exports = MarkupGenerator;
