/*
 * @author     Alexander Shumilov
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Number control component
 */
class NumberControl extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<input
            id={this.props.id}
            className="form-control"
            type="number"
            placeholder="123"
            value={this.props.value}
            onChange={(event) => { this.props.onChange(event.target.value) }}/>);
    }
}

NumberControl.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export { NumberControl };