/*
 * @author     Alexander Shumilov
 * @copyright  2013-2019 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Select control component
 */
class SelectControl extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let options = [];
        options.push(<option key={`option_null`} value="">{__(`Select`)}</option>)
        this.props.restriction.map((option, index) => {
            options.push(<option key={`option_${index}`} value={option.value}>{option.alias}</option>)
        });

        return (<select id={this.props.id} value={this.props.value} className="form-control form-select-sm" onChange={(event) => { this.props.onChange(event.target.value) }}>
            {options}
        </select>);
    }
}

SelectControl.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    restriction: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
};

export { SelectControl };
