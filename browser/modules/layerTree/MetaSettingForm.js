/*
 * @author     Martin Høgh
 * @copyright  2013-2022 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';
import PropTypes from 'prop-types';

class MetaSettingForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.initialValues;
        this.handleStyleFnChange = this.handleStyleFnChange.bind(this);
        this.handlePointToLayerChange = this.handlePointToLayerChange.bind(this);
        this.handleTooltipChange = this.handleTooltipChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleStyleFnChange(event) {
        this.setState({styleFn: event.target.value});
    }

    handlePointToLayerChange(event) {
        this.setState({pointToLayerFn: event.target.value});
    }

    handleTooltipChange(event) {
        this.setState({tooltipTmpl: event.target.value});
    }
    handleSubmit() {
        this.props.onChange({
            layerKey: this.props.layerKey,
            obj: this.state
        });
    }

    render() {
        return (<div style={{display: 'flex', flexDirection: 'column'}}>
            <label>Style function
                <textarea style={{backgroundColor: '#f5f5f5'}} className="form-control" rows="3"
                          value={this.state.styleFn} onChange={this.handleStyleFnChange}></textarea>
            </label>
            <label>Point-to-layer function
                <textarea style={{backgroundColor: '#f5f5f5'}} className="form-control" rows="3"
                          value={this.state.pointToLayerFn} onChange={this.handlePointToLayerChange}></textarea>
            </label>
            <label>Tooltip template
                <textarea style={{backgroundColor: '#f5f5f5'}} className="form-control" rows="3"
                          value={this.state.tooltipTmpl} onChange={this.handleTooltipChange}></textarea>
            </label>
            <button className="btn btn-sm" onClick={this.handleSubmit}>Set</button>
        </div>)
    }
}

MetaSettingForm.propTypes = {
    layerKey: PropTypes.string.isRequired,
    initialValues: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default MetaSettingForm;
