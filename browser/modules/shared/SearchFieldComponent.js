/*
 * @author     Alexander Shumilov
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Title field for
 */
class SearchFieldComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchTerm: ``
        }
    }

    onChange(event) {
        this.setState({ searchTerm: event.target.value });
    }

    onSearch() {
        this.props.onSearch(this.state.searchTerm);
    }

    handleKeyPress(event) {
        if (event.key === `Enter` && this.state.searchTerm) {
            this.props.onSearch(this.state.searchTerm);
        }
    }

    onClear() {
        this.setState({ searchTerm: `` });
        this.props.onSearch(``);
    }

    render() {
        let buttonStyle = {
            padding: `4px`,
            margin: `0px`
        };

        return (<div className="input-group" style={{ display: 'inline-table' }} key="aaa">
            <input
                id={(this.props.id ? this.props.id : ``)}
                value={this.state.searchTerm}
                type="text" className="form-control"
                placeholder={__("Search")}
                onChange={this.onChange.bind(this)}
                onKeyPress={this.handleKeyPress.bind(this)}/>
            <span className="input-group-btn" style={{ padding: '6px', verticalAlign: 'top' }}>
                <button
                    className="btn btn-xs btn-primary"
                    onClick={this.onSearch.bind(this)}
                    style={buttonStyle}>
                    <i className="material-icons">search</i>
                </button>
                <button
                    className="btn btn-xs btn-primary"
                    onClick={this.onClear.bind(this)}
                    disabled={!this.state.searchTerm}
                    style={buttonStyle}>
                    <i className="material-icons">clear</i>
                </button>
            </span>
        </div>);
    }
}

SearchFieldComponent.propTypes = {
    onSearch: PropTypes.func.isRequired
};

export default SearchFieldComponent;