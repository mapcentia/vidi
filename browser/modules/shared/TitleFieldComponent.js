/*
 * @author     Alexander Shumilov
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Title field
 */
class TitleFieldComponent extends React.Component {
    constructor(props) {
        super(props);
        if (props.type !== `userOwned` && props.type !== `browserOwned`) {
            throw new Error(`Invalid type options`);
        }

        this.state = {
            title: (props.value ? props.value : ``)
        }
    }

    onChange(event) {
        this.setState({title: event.target.value});
    }

    onSave() {
        this.props.onAdd(this.state.title);
        this.setState({title: ''});
    }

    handleKeyPress(event) {
        if (event.key === `Enter` && this.state.title) {
            this.props.onAdd(this.state.title);
            this.setState({title: ''});
        }
    }

    render() {
        let cancelControl = false;
        if (this.props.onCancel) {
            cancelControl = (<button
                title={__(`Cancel`)}
                className="btn btn-sm btn-outline-danger"
                onClick={this.props.onCancel}>
                <i className="bi bi-x-lg"></i>
            </button>);
        }

        let containerStyle = {width: '50%', display: 'inline-table', paddingLeft: '8px'};
        if (`customStyle` in this.props && this.props.customStyle) {
            for (let key in this.props.customStyle) {
                containerStyle[key] = this.props.customStyle[key];
            }
        }

        let inputStyle = {};
        if (this.props.layout === `dense`) {
            inputStyle.marginBottom = `0px`;
        }

        return (<div className="d-flex align-items-center gap-2">
            <input
                value={this.state.title}
                disabled={this.props.disabled}
                type="text"
                className="form-control form-control-sm"
                placeholder={this.props.inputPlaceholder ? this.props.inputPlaceholder : __("New title")}
                onChange={this.onChange.bind(this)}
                onKeyPress={this.handleKeyPress.bind(this)}
                />
            <button
                title={__(`Save`)}
                className="btn btn-primary btn-sm"
                onClick={this.onSave.bind(this)}
                disabled={this.props.disabled || !this.state.title}>
                {this.props.showIcon ? ((this.props.saveIcon ? this.props.saveIcon : (
                    <i className="bi bi-save"></i>))) : false} {(this.props.saveButtonText ? ` ` + this.props.saveButtonText : ``)}
            </button>
            {cancelControl}
        </div>);
    }
}

TitleFieldComponent.propTypes = {
    value: PropTypes.string,
    onAdd: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    layout: PropTypes.string
};

TitleFieldComponent.defaultProps = {
    showIcon: true,
    layout: 'regular'
};

export default TitleFieldComponent;
