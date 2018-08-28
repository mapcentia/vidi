import React from 'react';
import PropTypes from 'prop-types';

/**
 * String control component
 */
class StringControl extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<input
            id={this.props.id}
            className="form-control"
            type="text"
            placeholder="abc123"
            value={this.props.value}
            onChange={(event) => { this.props.onChange(event.target.value) }}/>);
    }
}

StringControl.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export { StringControl };