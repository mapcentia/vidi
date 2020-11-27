/*
 * @author     Alexander Shumilov
 * @copyright  2013-2019 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';
import PropTypes from 'prop-types';
import Datetime from 'react-datetime';
import dayjs from 'dayjs';

const FORMAT = `YYYY-MM-DD HH:mm:ss`;

/**
 * Datetime control component
 */
class DatetimeControl extends React.Component {
    constructor(props) {
        super(props);
        dayjs.locale(navigator.language.indexOf(`da_`) === 0 ? "da" : "en");
    }

    render() {
        return (<div style={{ display: 'inline-table', maxWidth: '160px' }}>
            <Datetime
                dateFormat="YYYY-MM-DD"
                timeFormat="HH:mm:ss"
                onChange={(value) => {
                    if (typeof value === `string`) {
                        if (dayjs(value, FORMAT).isValid()) {
                            this.props.onChange(value);
                        } else {
                            this.props.onChange(false);
                        }
                    } else {
                        this.props.onChange(value.format(FORMAT))
                    }
                }}
                value={this.props.value}/>
        </div>);
    }
}

DatetimeControl.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export { DatetimeControl };
