/*
 * @author     Alexander Shumilov
 * @copyright  2013-2021 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

/**
 * Tools for sorting layers
 * 
 * @todo Rewrite layerTree using React or Angular
 */

const GROUP_CHILD_TYPE_LAYER = `layer`;
const GROUP_CHILD_TYPE_GROUP = `group`;

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
        if (!order) {
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
                if (groupOrderItem.type === GROUP_CHILD_TYPE_LAYER || groupOrderItem.type === GROUP_CHILD_TYPE_GROUP) {
                    for (let i = (notSortedLayersAndSubgroupsForCurrentGroup.length - 1); i >= 0; i--) {
                        let groupChildId = false;
                        if (notSortedLayersAndSubgroupsForCurrentGroup[i].type === GROUP_CHILD_TYPE_LAYER) {
                            groupChildId = notSortedLayersAndSubgroupsForCurrentGroup[i].layer.f_table_schema + '.' + notSortedLayersAndSubgroupsForCurrentGroup[i].layer.f_table_name;
                        } else if (notSortedLayersAndSubgroupsForCurrentGroup[i].type === GROUP_CHILD_TYPE_GROUP) {
                            groupChildId = notSortedLayersAndSubgroupsForCurrentGroup[i].id;
                        } else {
                            throw new Error(`Undetectable not sorted group child type`);
                        }

                        if (groupOrderItem.id === groupChildId) {
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

            /**
             * Ordering layers in subgroup
             * 
             * @param {Object} alreadyOrdered Already ordered layers and subgroups
             * @param {Object} beingOrdered   Layers and subgroups that need to be ordered
             * 
             * @returns {Array}
             */
            const orderLayersInSubgroup = (alreadyOrdered, beingOrdered) => {
                if (!alreadyOrdered.children || !beingOrdered.children) {
                    console.log(alreadyOrdered, beingOrdered);
                    throw new Error(`Invalid order data or ordered objects`);
                }
    
                let alreadyOrderedCopy = JSON.parse(JSON.stringify(alreadyOrdered.children));
                let sortedCopy = JSON.parse(JSON.stringify(beingOrdered.children));

                let resultingSortedLayers = [];
                for (let alreadyOrderedKey in alreadyOrderedCopy) {
                    for (let i = (sortedCopy.length - 1); i >= 0; i--) {
                        if (sortedCopy[i].type === GROUP_CHILD_TYPE_GROUP) {
                            if (alreadyOrderedCopy[alreadyOrderedKey].id === (sortedCopy[i].id)) {
                                // sort subgroup
                                let subgroupSortResult = orderLayersInSubgroup(alreadyOrderedCopy[alreadyOrderedKey], sortedCopy[i]);
                                let takenCopy = sortedCopy.splice(i, 1).pop();
                                takenCopy.children = subgroupSortResult;
                                resultingSortedLayers.push(takenCopy);

                                break;
                            }
                        } else {
                            if (alreadyOrderedCopy[alreadyOrderedKey].id === (sortedCopy[i].layer.f_table_schema + '.' + sortedCopy[i].layer.f_table_name)) {
                                resultingSortedLayers.push(sortedCopy.splice(i, 1).pop());
                                break;
                            }
                        }
                    }
                }

                if (sortedCopy.length > 0) {
                    for (let j = 0; j < sortedCopy.length; j++) {
                        resultingSortedLayers.push(sortedCopy[j]);
                    }
                }

                return resultingSortedLayers;
            };

            // Ordering layers in subgroups
            for (let orderKey in groupOrder) {
                for (let key in sortedLayersAndSubgroups) {
                    if (sortedLayersAndSubgroups[key].type === GROUP_CHILD_TYPE_GROUP && sortedLayersAndSubgroups[key].id === groupOrder[orderKey].id) {
                        sortedLayersAndSubgroups[orderKey].children = orderLayersInSubgroup(groupOrder[orderKey], sortedLayersAndSubgroups[key]);
                    }
                }
            }
        }

        let result = ((sortedLayersAndSubgroups.length > 0) ? sortedLayersAndSubgroups : notSortedLayersAndSubgroupsForCurrentGroup);
        return result;
    }

    /**
     * Checking the order object structure
     * 
     * [{
     *   id: "Group with children",
     *   panelWasInitialized: true,
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
     * [{
     *   id: "Group without children",
     *   panelWasInitialized: false,
     *   children: []
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

            group.children.map(groupChild => {
                if ((`id` in groupChild === false || !groupChild.id) &&
                    (!groupChild.layer || !groupChild.layer.f_table_schema || !groupChild.layer.f_table_name)) {
                    errorMessage = `Invalid group child id`;
                    return false;
                }

                if (`type` in groupChild === false || !groupChild.type || [GROUP_CHILD_TYPE_LAYER, GROUP_CHILD_TYPE_GROUP].indexOf(groupChild.type) === -1) {
                    errorMessage = `Invalid group child type`;
                    return false;
                }

                if (groupChild.type === GROUP_CHILD_TYPE_GROUP) {
                    groupChild.children.map(subGroupChild => {
                        if ((`id` in subGroupChild === false || !subGroupChild.id) &&
                        (!subGroupChild.layer || !subGroupChild.layer.f_table_schema || !subGroupChild.layer.f_table_name)){
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
}

export { GROUP_CHILD_TYPE_LAYER, GROUP_CHILD_TYPE_GROUP, LayerSorting };
