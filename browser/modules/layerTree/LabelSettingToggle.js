/*
 * @author     Martin Høgh
 * @copyright  2013-2022 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';
import PropTypes from 'prop-types';

class LabelSettingToggle extends React.Component {
    constructor(props) {
        super(props);
        this.state = { checked: props.initialValue };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({ checked: event.target.checked });
        this.props.onChange({
            layerKey: this.props.layerKey,
            labelsAreEnabled: event.target.checked
        });
    }

    render() {
        return (<div>
            <div className="form-check">
                <input className="form-check-input" id="label-setting-switch" checked={this.state.checked} onChange={this.handleChange} type="checkbox"/>
                <label className="form-check-label" htmlFor="label-setting-switch">{__(`Show labels`)}</label>
            </div>
        </div>)
    }
}

LabelSettingToggle.propTypes = {
    layerKey: PropTypes.string.isRequired,
    initialValue: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default LabelSettingToggle;
