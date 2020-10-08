/*
 * @author     René Giovanni Borella
 * @copyright  2020 Geopartner A/S
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';

class DAWASearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchTerm: '',
            placeholder: this.buildPlaceholder(),
            triggerAtChar: (props.triggerAtChar === undefined ) ? 4 : parseInt(props.triggerAtChar)
        };

    }

    buildPlaceholder() {
        return 'Adresse, matr.nr, ESR nr. eller SFE nr.';
    }

    _handleResult = (id) => {
        this.props._handleResult(id);
    }

    editSearchTerm = (e) => {
        var _self = this;
        _self.setState({
            searchTerm: e.target.value
        });
    }

    dynamicSearch = () => {
        var _self = this;
        var s = _self.state;

        // If not at triggerChar, do nothing
        if (s.searchTerm.length < s.triggerAtChar) {
            return [];
        } else {
            // run promises here to return stuff from somewhere

            return [
                {resultText: "test"},
                {resultText: "test2"},
                {resultText: "test3"}
            ];
        }
    }

    render() {
        var _self = this;
        var p = this.props;
        var s = this.state;

        return (
            <div>
                <input type='text' value={ s.searchTerm } onChange={ _self.editSearchTerm } placeholder={ s.placeholder } />
                <ResultsList
                    results= { _self.dynamicSearch() }
                    _handleResult={ _self._handleResult }
                />
            </div>
        );
    }
};

class ResultsList extends React.Component {
    constructor(props) {
        super(props);
    }

    _handleResult = (id) => {
        this.props._handleResult(id);
    }
    
    render() {
        var _self = this;

        var ResultListStyle = {
            display: "block"
        }
        var ResultStyle = {
            display: "block",
            backgroundColor: 'red'
        }

        if (this.props.results.length > 0) {
            return (
                <div style={ResultListStyle}>
                    {this.props.results.map(r => <div style={ResultStyle} onClick={_self._handleResult.bind(this, r)} key={r.resultText}>{r.resultText}</div>)}
                </div> 
            );
        } else {
            return '';
        }
    }
}

module.exports = DAWASearch;