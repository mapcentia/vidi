import React from 'react';
import PropTypes from 'prop-types';
import {
    validateFilters,
    MATCHES,
    EXPRESSIONS_FOR_STRINGS,
    EXPRESSIONS_FOR_NUMBERS,
    EXPRESSIONS
} from './filterUtils';

/**
 * Layer filter component
 */


const SELECT_WIDTH = `50px`;

const STRING_TYPES = [`string`, `character varying`];
const NUMBER_TYPES = [`integer`, `double precision`];
const ALLOWED_TYPES_IN_FILTER = [].concat(STRING_TYPES).concat(NUMBER_TYPES).filter((v, i, a) => a.indexOf(v) === i);

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

        // Check if current expression is valid against new fieldname type
        for (let key in this.state.layer.fields) {
            if (key === value) {
                let type = this.state.layer.fields[key].type;

                if (this.isValid(filters.columns[columnIndex].value, type) === false) {
                    filters.columns[columnIndex].value = ``;
                }

                if (STRING_TYPES.indexOf(type) !== -1) {
                    if (EXPRESSIONS_FOR_STRINGS.indexOf(filters.columns[columnIndex].expression) === -1) {
                        filters.columns[columnIndex].expression = EXPRESSIONS_FOR_STRINGS[0];
                    }
                } else if (NUMBER_TYPES.indexOf(type) !== -1) {
                    if (EXPRESSIONS_FOR_NUMBERS.indexOf(filters.columns[columnIndex].expression) === -1) {
                        filters.columns[columnIndex].expression = EXPRESSIONS_FOR_NUMBERS[0];
                    }
                }
            }
        }

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

    isValid(value, type) {
        let valueIsValid = false;
        if (NUMBER_TYPES.indexOf(type) === -1) {
            valueIsValid = true;
        } else {
            let intReg = /^\d+$/;
            let floatReg = /^[+-]?\d+(\.\d+)?$/;
            if (type === `integer` && value.match(intReg)) {
                valueIsValid = true;
            } else if (type === `double precision` && value.match(floatReg)) {
                valueIsValid = true;
            }
        }

        return valueIsValid;
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
            let type = false;
            for (let key in this.state.layer.fields) {
                if (key === column.fieldname) {
                    type = this.state.layer.fields[key].type;
                }
            }

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
            if (column.fieldname === DUMMY_RULE.fieldname) {
                EXPRESSIONS.map((expression, index) => {
                    expressionOptions.push(<option key={`expression_` + layerKey + `_` + (index + 1)} value={expression}>{expression}</option>);
                });
            } else {
                for (let key in this.state.layer.fields) {
                    if (key === column.fieldname) {
                        if (STRING_TYPES.indexOf(this.state.layer.fields[key].type) !== -1) {
                            EXPRESSIONS_FOR_STRINGS.map((expression, index) => {
                                expressionOptions.push(<option key={`expression_` + layerKey + `_` + (index + 1)} value={expression}>{expression}</option>);
                            });
                        } else if (NUMBER_TYPES.indexOf(this.state.layer.fields[key].type) !== -1) {
                            EXPRESSIONS_FOR_NUMBERS.map((expression, index) => {
                                expressionOptions.push(<option key={`expression_` + layerKey + `_` + (index + 1)} value={expression}>{expression}</option>);
                            });
                        }
                    }
                }
            }

            let divStyle = { display: `inline-block`, paddingRight: `10px` };

            let valueIsValid = false;
            if (column.fieldname && column.fieldname !== 'null' && column.expression && column.expression !== 'null' && column.value) {
                valueIsValid = this.isValid(column.value, type);
            }

            let ruleValidityIndicator = (<span style={{ color: 'green' }}><i className="fa fa-check-circle"></i></span>);
            if (!valueIsValid) {
                ruleValidityIndicator = (<span style={{ color: 'red' }}><i className="fa fa-ban"></i></span>);
                allRulesAreValid = false;
            }

            let placeholder = `abc`;
            let inputType = `text`;

            if (NUMBER_TYPES.indexOf(type) !== -1) {
                placeholder = `123`;
                inputType = `number`;
            }

            filterControls.push(<div key={`column_` + index}>
                <div className="form-group" style={divStyle}>
                    <button className="btn btn-xs btn-warning" type="button" onClick={this.onRuleDelete.bind(this, index)}>
                        <i className="fa fa-minus"></i>
                    </button>
                </div>
                <div className="form-group" style={divStyle}>
                    <select
                        id={ `column_select_` + layerKey + `_` + index }
                        className="form-control"
                        onChange={(event) => { this.changeFieldname(event.target.value, index) }}
                        value={column.fieldname}
                        style={{ width: `100px` }}>{columnOptions}</select>
                </div>
                <div className="form-group" style={divStyle}>
                    <select
                        id={ `expression_select_` + layerKey + `_` + index }
                        className="form-control"
                        onChange={(event) => { this.changeExpression(event.target.value, index) }}
                        value={column.expression}
                        style={{ width: SELECT_WIDTH }}>{expressionOptions}</select>
                </div>
                <div className="form-group" style={divStyle}>
                    <input
                        id={ `expression_input_` + layerKey + `_` + index }
                        className="form-control"
                        type={inputType}
                        placeholder={placeholder}
                        onChange={(event) => { this.changeValue(event.target.value, index) }} value={column.value}/>
                </div>
                <div style={divStyle}>{ruleValidityIndicator}</div>
            </div>);
        });

        return (<div>
            <div className="form-group">
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