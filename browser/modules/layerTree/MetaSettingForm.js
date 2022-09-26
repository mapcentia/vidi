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
        this.handleClusteringChange = this.handleClusteringChange.bind(this);
        this.handleZoomChange = this.handleZoomChange.bind(this);
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

    handleClusteringChange(event) {
        this.setState({clustering: !this.state.clustering});
    }
    handleZoomChange(event) {
        const int = parseInt(event.target.value) || '';
        switch (event.target.id) {
            case 'min-zoom':
                this.setState({minZoom: int});
                break;
            case 'max-zoom':
                this.setState({maxZoom: int});
                break;
        }
    }

    handleSubmit() {
        this.props.onChange({
            layerKey: this.props.layerKey,
            obj: this.state
        });
    }

    render() {
        return (<div style={{display: 'flex', flexDirection: 'column'}}>
            <div className="form-group" style={{display: 'contents'}}>
                <label>Style function
                    <textarea style={{backgroundColor: '#f5f5f5'}} className="form-control" rows="3"
                              value={this.state.styleFn} onChange={this.handleStyleFnChange}></textarea>
                </label>
            </div>
            <div className="form-group" style={{display: 'contents'}}>
                <label>Point-to-layer function
                    <textarea style={{backgroundColor: '#f5f5f5'}} className="form-control" rows="3"
                              value={this.state.pointToLayerFn} onChange={this.handlePointToLayerChange}></textarea>
                </label>
            </div>
            <div className="form-group" style={{display: 'contents'}}>
                <label>Tooltip template
                    <textarea style={{backgroundColor: '#f5f5f5'}} className="form-control" rows="3"
                              value={this.state.tooltipTmpl} onChange={this.handleTooltipChange}></textarea>
                </label>
            </div>
            <div className="form-group" style={{display: 'contents'}}>
                <div className="togglebutton">
                    <label>
                        <input type="checkbox" defaultChecked={this.state.clustering}
                               onChange={this.handleClusteringChange}/> Clustering
                    </label>
                </div>
            </div>
            <div className="form-group" style={{display: 'contents'}}>
                <label>Min zoom
                    <input type="number" id="min-zoom" style={{backgroundColor: '#f5f5f5'}} className="form-control"
                              value={this.state.minZoom} onChange={this.handleZoomChange}></input>
                </label>
            </div>
            <div className="form-group" style={{display: 'contents'}}>
                <label>Max zoom
                    <input type="number" id="max-zoom" style={{backgroundColor: '#f5f5f5'}} className="form-control"
                           value={this.state.maxZoom} onChange={this.handleZoomChange}></input>
                </label>
            </div>
            <div className="form-group" style={{display: 'contents'}}>
                <button className="btn btn-sm btn-primary" onClick={this.handleSubmit}>Set</button>
            </div>
        </div>)
    }
}

MetaSettingForm.propTypes = {
    layerKey: PropTypes.string.isRequired,
    initialValues: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default MetaSettingForm;
