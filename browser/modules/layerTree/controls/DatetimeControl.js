/*
 * @author     Alexander Shumilov
 * @copyright  2013-2019 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Datetime control component
 */
class DatetimeControl extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div style={{ display: 'inline-table', maxWidth: '140px' }}>
            <input
                id={this.props.id}
                className="form-control"
                type="datetime-local"
                placeholder=""
                value={this.props.value}
                onChange={(event) => { this.props.onChange(event.target.value) }}/>
        </div>);
    }
}

DatetimeControl.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export { DatetimeControl };