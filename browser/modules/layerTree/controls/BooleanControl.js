import React from 'react';
import PropTypes from 'prop-types';

/**
 * Boolean control component
 */
class BooleanControl extends React.Component {
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

BooleanControl.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export { BooleanControl };