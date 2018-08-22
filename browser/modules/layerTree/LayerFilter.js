import React from 'react';
import PropTypes from 'prop-types';

/**
 * Layer filter component
 */

const MATCHES = [`any`, `all`];

const EXPRESSIONS = [`=`, `<>`, `<`, `>`, `<=`, `>=`, `like`];

const SELECT_WIDTH = `50px`;

const ALLOWED_TYPES_IN_FILTER = [`string`, `character varying`, `integer`];

class LayerFilter extends React.Component {
    constructor(props) {
        super(props);

        let filters = props.filters || {};

        if (`match` in filters === false) filters[`match`] = MATCHES[0];
        if (`columns` in filters === false) filters[`columns`] = new Array();
        if (filters.columns.length === 0) {
            filters.columns.push({
                id: '',
                expression: EXPRESSIONS[0],
                value: ''
            });
        }

        // Validating the filters structure
        if (MATCHES.indexOf(filters.match) === -1) throw new Error(`Invalid match`);
        if (Array.isArray(filters.columns) === false) throw new Error(`Invalid columns`);
        filters.columns.map(column => {
            if (`id` in column === false) throw new Error(`Column id does not exist`);
            if (`expression` in column === false || EXPRESSIONS.indexOf(column.expression) === -1) throw new Error(`Invalid column expression`);
            if (`value` in column === false) throw new Error(`Column value does not exist`);
        });
     
        this.state = {
            layer: props.layer,
            filters
        }
    }

    onRuleDelete(event) {
        alert(`DEVELOPMENT: Delete rule`);
    }

    onRuleAdd(event) {
        alert(`DEVELOPMENT: Add rule`);
    }

    onRulesApply(event) {
        alert(`DEVELOPMENT: Apply rules`);
    }

    render() {
        let allRulesAreValid = true;

        let matchSelectorOptions = [];
        MATCHES.map((match, index) => { matchSelectorOptions.push(<option key={`match_` + index} value={match}>{__(match)}</option>); });
        let matchSelector = (<select className="form-control" style={{
            display: `inline`,
            width: SELECT_WIDTH
        }}>{matchSelectorOptions}</select>);

        let layerKey = this.state.layer.f_table_name + '.' + this.state.layer.f_table_schema;
        let filterControls = [];
        this.state.filters.columns.map((column, index) => {
            let columnOptions = [];
            let columnIndex = 0;

            // @todo Null option

            for (let key in this.state.layer.fields) {
                let field = this.state.layer.fields[key];
                console.log(field.type);
                if (ALLOWED_TYPES_IN_FILTER.indexOf(field.type) !== -1) {

                    // @todo Selected option

                    columnOptions.push(<option key={`field_` + layerKey + `_` + columnIndex} value={key}>{key}</option>);
                    columnIndex++;
                }
            }

            // @todo Null option

            let expressionOptions = [];
            EXPRESSIONS.map((expression, index) => {

                // @todo Selected option

                expressionOptions.push(<option key={`expression_` + layerKey + `_` + index} value={expression}>{expression}</option>);
            });

            let divStyle = { display: `inline-block`, paddingRight: `10px` };

            filterControls.push(<div key={`column_` + index}>
                <div style={divStyle}>
                    <button className="btn btn-xs btn-warning" type="button" onClick={this.onRuleDelete.bind(this)}>
                        <i className="fa fa-minus"></i>
                    </button>
                </div>
                <div style={divStyle}>
                    <select id={ `column_select_` + layerKey + `_` + index } className="form-control" style={{ width: `100px` }}>{columnOptions}</select>
                </div>
                <div style={divStyle}>
                    <select id={ `expression_select_` + layerKey + `_` + index } className="form-control" style={{ width: SELECT_WIDTH }}>{expressionOptions}</select>
                </div>
                <div id={ `expression_input_` + layerKey + `_` + index } style={divStyle}>
                    <input className="form-control" type="text"/>
                </div>
            </div>);
        });

        return (<div>
            <div>
                <p>{__(`Match`)} {matchSelector} {__(`of the following`)}</p>
            </div>
            <div>{filterControls}</div>
            <div>
                <button className="btn btn-sm" type="button" onClick={this.onRuleAdd.bind(this)}>
                    <i className="fa fa-plus"></i> {__(`Add condition`)}
                </button>
                <button className="btn btn-sm btn-success" type="button" disabled={!allRulesAreValid} onClick={this.onRulesApply.bind(this)}>
                    <i className="fa fa-check"></i> {__(`Apply`)}
                </button>
            </div>
        </div>);
    }
}

LayerFilter.propTypes = {
    layer: PropTypes.object.isRequired,
    filters: PropTypes.object.isRequired,
};

export default LayerFilter;