/**
 * Tools for sorting layers
 * 
 * @todo Rewrite layerTree using React or Angular
 */

class LayerSorting {
    constructor() {}

    /**
     * Sorts groups according to defined order (not all groups
     * can be present in order definition).
     * 
     * @returns {Array}
     */
    sortGroups(order, notSortedGroupsArray) {
        let result = [];
        for (let key in order) {
            let item = order[key];
            let sortedElement = false;
            for (let i = (notSortedGroupsArray.length - 1); i >= 0; i--) {
                if (item.id === notSortedGroupsArray[i]) {
                    sortedElement = notSortedGroupsArray.splice(i, 1);
                    break;
                }
            }

            if (sortedElement) {
                result.push(item.id);
            }
        }

        if (notSortedGroupsArray.length > 0) {
            for (let j = 0; j < notSortedGroupsArray.length; j++) {
                result.push(notSortedGroupsArray[j]);
            }
        }

        return result;
    }

    /**
     * Sorts layers and their subgroups
     * 
     * @returns {Array}
     */
    sortLayers(order, notSortedLayersForCurrentGroup, groupName) {
        let sortedLayers = [];
        if (order) {
            let currentGroupLayersOrder = false;
            for (let key in order) {
                if (order[key].id === groupName && 'layers' in order[key]) {
                    currentGroupLayersOrder = order[key].layers;
                }
            }

            if (currentGroupLayersOrder) {
                for (let key in currentGroupLayersOrder) {
                    let item = currentGroupLayersOrder[key];
                    let sortedElement = false;
                    for (let i = (notSortedLayersForCurrentGroup.length - 1); i >= 0; i--) {
                        let layerId = notSortedLayersForCurrentGroup[i].f_table_schema + '.' + notSortedLayersForCurrentGroup[i].f_table_name;
                        if (item.id === layerId) {
                            sortedElement = notSortedLayersForCurrentGroup.splice(i, 1);
                            break;
                        }
                    }

                    if (sortedElement) {
                        sortedLayers.push(sortedElement.pop());
                    }
                }

                if (notSortedLayersForCurrentGroup.length > 0) {
                    for (let j = 0; j < notSortedLayersForCurrentGroup.length; j++) {
                        sortedLayers.push(notSortedLayersForCurrentGroup[j]);
                    }
                }
            }
        }

        /*
            There is a list of layers, some of them belong to subgroups, some of them do not
            First go to order object and find what subgroups are there, remember theirs order and order of underlying layers
            After that get all subgroups from existing layers, and match the, to the ordered ones - those that are not in order, put them afterwards
            Match meta layers of every subgroup and the order in subgroup - the meta data is more important in terms of belonging than the order

            1. Order and complete subgroups
            2. Order and complete layers inside subgroups
            3. Store as three-level hierarchy
        */

        return ((sortedLayers.length > 0) ? sortedLayers : notSortedLayersForCurrentGroup);
    }
};

module.exports = LayerSorting;