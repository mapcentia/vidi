/*
 * @author     Martin Høgh
 * @copyright  2013-2023 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

const FORMAT = `YYYY-MM-DD`;

/**
 * Time control component
 */
class TimeControl extends React.Component {
    constructor(props) {
        super(props);
        dayjs().locale(navigator.language.indexOf(`da_`) === 0 ? "da" : "en");
    }

    render() {
        return (<input
            id={this.props.id}
            className="form-control form-control-sm"
            type="time"
            placeholder=""
            value={this.props.value}
            onChange={(event) => {
                this.props.onChange(event.target.value)
            }}/>);
    }
}

TimeControl.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export {TimeControl};
