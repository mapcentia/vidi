/*
 * @author     Martin Høgh
 * @copyright  2013-2020 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';
import PropTypes from 'prop-types';

class StyleSettingForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {fn: props.initialValue};

        this.handleFnChange = this.handleFnChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleFnChange(event) {
        console.log(event)
        this.setState({fn: event.target.value});
    }

    handleSubmit() {

        this.props.onChange({
            layerKey: this.props.layerKey,
            fn: this.state.fn
        });
    }

    render() {
        return (<div>
            <textarea value={this.state.fn} onChange={this.handleFnChange}></textarea>
            <button onClick={this.handleSubmit}>Set</button>
        </div>)
    }
}

LabelSettingToggle.propTypes = {
    layerKey: PropTypes.string.isRequired,
    initialValue: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default StyleSettingForm;
