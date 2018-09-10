/**
 * Tools for sorting layers
 * 
 * @todo Rewrite layerTree using React or Angular
 */

const GROUP_CHILD_TYPE_LAYER = 1;
const GROUP_CHILD_TYPE_GROUP = 2;

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
    sortLayers(order, notSortedLayersAndSubgroupsForCurrentGroup, groupName) {


        


        if (order === false) {
            return notSortedLayersAndSubgroupsForCurrentGroup;
        } else if (this.validateOrderObject(order) === false) {
            console.error(`Invalid order object`, order);
            return notSortedLayersAndSubgroupsForCurrentGroup;
        }

        let sortedLayersAndSubgroups = [];
        let groupOrder = false;
        for (let key in order) {
            if (order[key].id === groupName && 'children' in order[key]) {
                groupOrder = order[key].children;
            }
        }

        if (order && groupOrder) {
            for (let key in groupOrder) {
                let groupOrderItem = groupOrder[key];
                if (groupOrderItem.type === GROUP_CHILD_TYPE_LAYER) {
                    for (let i = (notSortedLayersAndSubgroupsForCurrentGroup.length - 1); i >= 0; i--) {
                        let layerId = notSortedLayersAndSubgroupsForCurrentGroup[i].layer.f_table_schema + '.' + notSortedLayersAndSubgroupsForCurrentGroup[i].layer.f_table_name;
                        if (groupOrderItem.id === layerId) {
                            sortedLayersAndSubgroups.push(notSortedLayersAndSubgroupsForCurrentGroup.splice(i, 1).pop());
                            break;
                        }
                    }
                } else if (groupOrderItem.type === GROUP_CHILD_TYPE_GROUP) {
                    for (let i = (notSortedLayersAndSubgroupsForCurrentGroup.length - 1); i >= 0; i--) {
                        if (groupOrderItem.id === notSortedLayersAndSubgroupsForCurrentGroup[i].id) {
                            sortedLayersAndSubgroups.push(notSortedLayersAndSubgroupsForCurrentGroup.splice(i, 1).pop());
                            break;
                        }
                    }
                } else {
                    throw new Error(`Invalid sorting group order item type`);
                }
            }

            if (notSortedLayersAndSubgroupsForCurrentGroup.length > 0) {
                for (let j = 0; j < notSortedLayersAndSubgroupsForCurrentGroup.length; j++) {
                    sortedLayersAndSubgroups.push(notSortedLayersAndSubgroupsForCurrentGroup[j]);
                }
            }

            // Ordering layers in subgroups
            for (let orderKey in groupOrder) {
                for (let key in sortedLayersAndSubgroups) {
                    if (sortedLayersAndSubgroups[key].type === GROUP_CHILD_TYPE_GROUP && sortedLayersAndSubgroups[key].id === groupOrder[orderKey].id) {
                        let alreadyOrderedCopy = JSON.parse(JSON.stringify(groupOrder[orderKey].children));
                        let sortedCopy = JSON.parse(JSON.stringify(sortedLayersAndSubgroups[key].children));
                        let resultingSortedLayers = [];

                        for (let alreadyOrderedKey in alreadyOrderedCopy) {
                            for (let i = (sortedCopy.length - 1); i >= 0; i--) {
                                let layerId = sortedCopy[i].f_table_schema + '.' + sortedCopy[i].f_table_name;
                                if (alreadyOrderedCopy[alreadyOrderedKey].id === layerId) {
                                    resultingSortedLayers.push(sortedCopy.splice(i, 1).pop());
                                    break;
                                }
                            }
                        }

                        if (sortedCopy.length > 0) {
                            for (let j = 0; j < sortedCopy.length; j++) {
                                resultingSortedLayers.push(sortedCopy[j]);
                            }
                        }

                        sortedLayersAndSubgroups[orderKey].children = resultingSortedLayers;
                    }
                }
            }
        }

        return ((sortedLayersAndSubgroups.length > 0) ? sortedLayersAndSubgroups : notSortedLayersAndSubgroupsForCurrentGroup);
    }

    /**
     * Checking the order object structure
     * 
     * [{
     *   id: "Group name",
     *   children: [{
     *     id: "public.test",
     *     type: "layer"
     *   }, {
     *     id: "Subgroup name",
     *     type: "group",
     *     children: [{ id: "public.test_line" }, { .. }]
     *   }]
     * }]
     * 
     * @returns {Boolean}
     */
    validateOrderObject(order) {
        let errorMessage = false;
        order.map(group => {
            if (`id` in group === false || !group.id) {
                errorMessage = `Invalid group id`;
                return false;
            }

            if (`children` in group === false || !Array.isArray(group.children) || group.children.length === 0) {
                errorMessage = `No group children`;
                return false;
            }

            group.children.map(groupChild => {
                if (`id` in groupChild === false || !groupChild.id) {
                    errorMessage = `Invalid group child id`;
                    return false;
                }

                if (`type` in groupChild === false || !groupChild.type || [GROUP_CHILD_TYPE_LAYER, GROUP_CHILD_TYPE_GROUP].indexOf(groupChild.type) === -1) {
                    errorMessage = `Invalid group child type`;
                    return false;
                }

                if (groupChild.type === GROUP_CHILD_TYPE_GROUP) {
                    if (`children` in groupChild === false || !Array.isArray(groupChild.children) || groupChild.children.length === 0) {
                        errorMessage = `No subgroup children`;
                        return false;
                    }

                    groupChild.children.map(subGroupChild => {
                        if (`id` in subGroupChild === false || !subGroupChild.id) {
                            errorMessage = `Invalid subgroup child id`;
                            return false;
                        }
                    });
                }
            });
        });

        if (errorMessage) {
            console.warn(errorMessage);
            return false;
        } else {
            return true;
        }
    }
};

export { GROUP_CHILD_TYPE_LAYER, GROUP_CHILD_TYPE_GROUP, LayerSorting };