/*
 * @author     Martin Høgh
 * @copyright  2013-2024 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React, {StrictMode} from 'react';
import Multiselect from "react-widgets/Multiselect";


/**
 * Title field
 */
function TagComponent({onAdd, tags = [], allTags}) {

    function onAddTag(e) {
        const t = e;
        if (!t || t === '' || tags.includes(t)) {
            return
        }
        tags.push(t)
        onAdd(tags);
    }

    function onRemoveTag(e) {
        onAdd(e)
    }

    return (<div className="d-flex flex-column gap-2">
        <Multiselect
            messages={{emptyList: __('There is no tags in the list'), emptyFilter: __('The filter returned no results'), createOption: (_value, searchTerm) => [__('Create tag'), searchTerm && ' ', searchTerm && React.createElement("strong", {
                    key: "_"
                }, `"${searchTerm}"`)]}}
            data={tags ? allTags.filter((o) => tags?.indexOf(o) === -1).concat(tags.filter((o) => allTags.indexOf(o) === -1)) : allTags}
            value={tags}
            textField="fullName"
            allowCreate="onFilter"
            onCreate={onAddTag}
            onChange={onRemoveTag}
        />
    </div>);
}

export default TagComponent;
