import React from 'react';
import PropTypes from 'prop-types';
import { validateFilters, MATCHES, EXPRESSIONS } from './filterUtils';

/**
 * Layer filter component
 */


const SELECT_WIDTH = `50px`;

const ALLOWED_TYPES_IN_FILTER = [`string`, `character varying`, `integer`];

const DUMMY_RULE = {
    fieldname: 'null',
    expression: EXPRESSIONS[0],
    value: ''
};

class LayerFilter extends React.Component {
    constructor(props) {
        super(props);

        let filters = props.filters || {};

        if (`match` in filters === false) filters[`match`] = MATCHES[0];
        if (`columns` in filters === false) filters[`columns`] = new Array();
        if (filters.columns.length === 0) {
            filters.columns.push(DUMMY_RULE);
        }

        // Validating the filters structure
        validateFilters(filters);

        this.state = {
            layer: props.layer,
            filters
        };
    }

    onRuleDelete(event, index) {
        let filters = this.state.filters;
        filters.columns.splice(index, 1);
        this.setState({ filters });
    }

    onRuleAdd() {
        let filters = this.state.filters;
        filters.columns.push(DUMMY_RULE);
        this.setState({ filters });
    }

    onRulesApply() {
        this.props.onApply({
            layerKey: (this.props.layer.f_table_schema + `.` + this.props.layer.f_table_name),
            filters: JSON.parse(JSON.stringify(this.state.filters))
        });
    }

    onRulesClear() {
        this.props.onApply({
            layerKey: (this.props.layer.f_table_schema + `.` + this.props.layer.f_table_name),
            filters: {
                match: `any`,
                columns: []
            }
        });
    }

    changeMatchType(value) {
        let filters = JSON.parse(JSON.stringify(this.state.filters));
        filters.match = value;
        this.setState({ filters });
    }

    changeFieldname(value, columnIndex) {
        let filters = JSON.parse(JSON.stringify(this.state.filters));
        filters.columns[columnIndex].fieldname = value;
        this.setState({ filters });
    }

    changeExpression(value, columnIndex) {
        let filters = JSON.parse(JSON.stringify(this.state.filters));
        filters.columns[columnIndex].expression = value;
        this.setState({ filters });
    }

    changeValue(value, columnIndex) {
        let filters = JSON.parse(JSON.stringify(this.state.filters));
        filters.columns[columnIndex].value = value;
        this.setState({ filters });
    }   

    render() {
        let allRulesAreValid = true;

        let matchSelectorOptions = [];
        MATCHES.map((match, index) => { matchSelectorOptions.push(<option key={`match_` + index} value={match}>{__(match)}</option>); });
        let matchSelector = (<select
            onChange={(event) => { this.changeMatchType(event.target.value) }}
            value={this.state.filters.match}
            className="form-control" style={{
                display: `inline`,
                width: SELECT_WIDTH
            }}>{matchSelectorOptions}</select>);

        let layerKey = this.state.layer.f_table_name + '.' + this.state.layer.f_table_schema;
        let filterControls = [];

        if (this.state.filters.columns.length === 0) {
            allRulesAreValid = false;
        }

        this.state.filters.columns.map((column, index) => {
            // Constructing select for column fieldname
            let columnOptions = [];
            columnOptions.push(<option key={`field_` + layerKey + `_0`} value="null">{__(`Select`)}</option>);
            let columnIndex = 1;
            for (let key in this.state.layer.fields) {
                let field = this.state.layer.fields[key];
                if (ALLOWED_TYPES_IN_FILTER.indexOf(field.type) !== -1) {
                    columnOptions.push(<option key={`field_` + layerKey + `_` + columnIndex} value={key}>{key}</option>);
                    columnIndex++;
                }
            }

            // Constructing select for expression
            let expressionOptions = [];
            EXPRESSIONS.map((expression, index) => {
                expressionOptions.push(<option key={`expression_` + layerKey + `_` + (index + 1)} value={expression}>{expression}</option>);
            });

            let divStyle = { display: `inline-block`, paddingRight: `10px` };

            let ruleValidityIndicator = (<span style={{ color: 'red' }}><i className="fa fa-ban"></i></span>);
            if (column.fieldname && column.fieldname !== 'null' && column.expression && column.expression !== 'null' && column.value) {
                ruleValidityIndicator = (<span style={{ color: 'green' }}><i className="fa fa-check-circle"></i></span>);
            } else {
                allRulesAreValid = false;
            }

            filterControls.push(<div key={`column_` + index}>
                <div style={divStyle}>
                    <button className="btn btn-xs btn-warning" type="button" onClick={this.onRuleDelete.bind(this, index)}>
                        <i className="fa fa-minus"></i>
                    </button>
                </div>
                <div style={divStyle}>
                    <select
                        id={ `column_select_` + layerKey + `_` + index }
                        className="form-control"
                        onChange={(event) => { this.changeFieldname(event.target.value, index) }}
                        value={column.fieldname}
                        style={{ width: `100px` }}>{columnOptions}</select>
                </div>
                <div style={divStyle}>
                    <select
                        id={ `expression_select_` + layerKey + `_` + index }
                        className="form-control"
                        onChange={(event) => { this.changeExpression(event.target.value, index) }}
                        value={column.expression}
                        style={{ width: SELECT_WIDTH }}>{expressionOptions}</select>
                </div>
                <div style={divStyle}>
                    <input
                        id={ `expression_input_` + layerKey + `_` + index }
                        className="form-control"
                        type="text"
                        onChange={(event) => { this.changeValue(event.target.value, index) }} value={column.value}/>
                </div>
                <div style={divStyle}>{ruleValidityIndicator}</div>
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
                <button className="btn btn-sm" type="button" onClick={this.onRulesClear.bind(this)}>
                    <i className="fa fa-eraser"></i> {__(`Disable`)}
                </button>
            </div>
        </div>);
    }
}

LayerFilter.propTypes = {
    layer: PropTypes.object.isRequired,
    filters: PropTypes.object.isRequired,
    onApply: PropTypes.func.isRequired,
};

export default LayerFilter;