/*
 * @author     Martin Høgh
 * @copyright  2013-2025 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React, {StrictMode, useState} from 'react';
import Multiselect from "react-widgets/Multiselect";


/**
 * Title field
 */
function TagComponent({onAdd, tags = [], allTags}) {
    const [tagList, setTagList] = useState(tags);
    function onAddTag(e) {
        const t = e;
        if (!t || t === '' || tagList.includes(t)) {
            return
        }
        const newTags = [...tagList, t];
        setTagList(newTags)
        onAdd(newTags);
    }

    function onRemoveTag(e) {
        setTagList(e)
        onAdd(e)
    }

    return (<div className="d-flex flex-column gap-2">
        <Multiselect
            messages={{emptyList: __('There is no tags in the list'), emptyFilter: __('The filter returned no results'), createOption: (_value, searchTerm) => [__('Create tag'), searchTerm && ' ', searchTerm && React.createElement("strong", {
                    key: "_"
                }, `"${searchTerm}"`)]}}
            data={tagList ? allTags.filter((o) => tagList?.indexOf(o) === -1).concat(tagList.filter((o) => allTags.indexOf(o) === -1)) : allTags}
            value={tagList}
            textField="fullName"
            allowCreate="onFilter"
            onCreate={onAddTag}
            onChange={onRemoveTag}
        />
    </div>);
}

export default TagComponent;
