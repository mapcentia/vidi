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
        this.setState({ title: event.target.value });
    }

    onSave() {
        this.props.onAdd(this.state.title);
        this.setState({ title: '' });
    }

    handleKeyPress(event) {
        if (event.key === `Enter` && this.state.title) {
            this.props.onAdd(this.state.title);
            this.setState({ title: '' });
        }
    }

    render() {
        let buttonStyle = {
            padding: `4px`,
            margin: `0px`
        };

        let cancelControl = false;
        if (this.props.onCancel) {
            cancelControl = (<button
                title={__(`Cancel`)}
                className="btn btn-xs btn-primary"
                onClick={this.props.onCancel}
                style={buttonStyle}>
                <i className="material-icons">cancel</i>
            </button>);
        }

        let containerStyle = { width: '50%', display: 'inline-table', paddingLeft: '8px' };
        if (`customStyle` in this.props && this.props.customStyle) {
            for (let key in this.props.customStyle) {
                containerStyle[key] = this.props.customStyle[key];
            }
        }

        let inputStyle = {};
        if (this.props.layout === `dense`) {
            inputStyle.marginBottom = `0px`;
        }

        return (<div className="input-group" style={containerStyle}>
            <input
                id={(this.props.id ? this.props.id : ``)}
                value={this.state.title}
                disabled={this.props.disabled}
                type="text"
                className="form-control"
                placeholder={__("New title")}
                onChange={this.onChange.bind(this)}
                onKeyPress={this.handleKeyPress.bind(this)}
                style={inputStyle}/>
            <span className="input-group-btn" style={{ padding: '6px', verticalAlign: 'top' }}>
                <button
                    title={__(`Save`)}
                    className="btn btn-xs btn-primary"
                    onClick={this.onSave.bind(this)}
                    disabled={this.props.disabled || !this.state.title}
                    style={buttonStyle}>
                    <i className="material-icons">save</i>{(this.props.saveButtonText ? ` ` + this.props.saveButtonText : ``)}
                </button>
                {cancelControl}
            </span>
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
    layout: 'regular'
};

export default TitleFieldComponent;