/*
 * @author     Alexander Shumilov
 * @copyright  2013-2023 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';
import PropTypes from 'prop-types';

class LoadStrategyToggle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {checked: props.initialValue};

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({checked: event.target.checked});
        this.props.onChange({
            layerKey: this.props.layerKey,
            dynamicLoadIsEnabled: event.target.checked
        });
    }

    render() {
        return (<div>
            <div className="form-check">
                <input id="load-strategy-switch" className="form-check-input" checked={this.state.checked} onChange={this.handleChange} type="checkbox"/>
                <label htmlFor="load-strategy-switch" className="form-check-label">{__(`Dynamic load`)}</label>
            </div>
        </div>)
    }
}

LoadStrategyToggle.propTypes = {
    layerKey: PropTypes.string.isRequired,
    initialValue: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default LoadStrategyToggle;
