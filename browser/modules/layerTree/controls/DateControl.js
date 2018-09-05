import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-bootstrap-date-picker';

/**
 * Boolean control component
 */
class DateControl extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        /*
        // Using the third-party date picker
        return (<div style={{ display: 'inline-table', maxWidth: '140px' }}>
            <DatePicker
                id={this.props.id}
                value={this.props.value}
                onChange={(value) => { this.props.onChange(value) }}/>
        </div>);
        */

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

DateControl.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export { DateControl };