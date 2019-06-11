/*
 * @author     Alexander Shumilov
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';
import PropTypes from 'prop-types';

class LoadStrategyToggle extends React.Component {
    constructor(props) {
        super(props);
        this.state = { checked: props.initialValue };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({ checked: event.target.checked });
        this.props.onChange({
            layerKey: this.props.layerKey,
            dynamicLoadIsEnabled: event.target.checked
        });
    }

    render() {
        return (<div>
            <div className="togglebutton">
                <label style={{ textIndent: `0px`, paddingLeft: `0px` }}>
                    <input checked={this.state.checked} onChange={this.handleChange} type="checkbox"/> {__(`Dynamic load`)}
                </label>
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