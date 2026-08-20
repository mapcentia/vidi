/*
 * @author     Alexander Shumilov
 * @copyright  2013-2023 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';
import PropTypes from 'prop-types';
import {SelectControl} from './SelectControl';

/**
 * String control component
 */
class StringControl extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.restriction) {
            return (<SelectControl {...this.props}/>);
        } else {
            return (<input
                id={this.props.id}
                className="form-control form-control-sm"
                type="text"
                placeholder="abc123"
                value={this.props.value}
                onChange={(event) => {
                    this.props.onChange(event.target.value)
                }}/>);
        }
    }
}

StringControl.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export { StringControl };
