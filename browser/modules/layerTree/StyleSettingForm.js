/*
 * @author     Martin Høgh
 * @copyright  2013-2022 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';
import PropTypes from 'prop-types';

class StyleSettingForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = props.initialValues;
        this.handleFnChange = this.handleFnChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleFnChange(event) {
        this.setState({styleFn: event.target.value});
    }

    handleSubmit() {
        this.props.onChange({
            layerKey: this.props.layerKey,
            obj: this.state
        });
    }

    render() {
        return (<div>
            <p><b>Style function</b></p>
            <textarea style={{backgroundColor: '#f5f5f5'}} className="form-control" rows="3" value={this.state.styleFn} onChange={this.handleFnChange}></textarea>
            <button className="btn btn-sm" onClick={this.handleSubmit}>Set</button>
        </div>)
    }
}

StyleSettingForm.propTypes = {
    layerKey: PropTypes.string.isRequired,
    initialValues: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default StyleSettingForm;
