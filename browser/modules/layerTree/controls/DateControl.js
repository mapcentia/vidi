/*
 * @author     Alexander Shumilov
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Boolean control component
 */
class DateControl extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div style={{ display: 'inline-table', maxWidth: '140px' }}>
            <input
                id={this.props.id}
                className="form-control"
                type="date"
                placeholder=""
                value={this.props.value}
                onChange={(event) => { this.props.onChange(event.target.value) }}/>
        </div>);
    }
}

DateControl.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export { DateControl };