/*
 * @author     Alexander Shumilov
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
    validateFilters,
    MATCHES,
    EXPRESSIONS_FOR_STRINGS,
    EXPRESSIONS_FOR_NUMBERS,
    EXPRESSIONS_FOR_DATES,
    EXPRESSIONS_FOR_BOOLEANS,
    EXPRESSIONS
} from './filterUtils';
import { StringControl, NumberControl, BooleanControl, DateControl } from './controls';

/**
 * Layer filter component
 */
const SELECT_WIDTH = `50px`;

const STRING_TYPES = [`string`, `character varying`];
const NUMBER_TYPES = [`integer`, `double precision`];
const DATE_TYPES = [`date`];
const BOOLEAN_TYPES = [`boolean`];
const ALLOWED_TYPES_IN_FILTER = [].concat(STRING_TYPES).concat(NUMBER_TYPES).concat(DATE_TYPES).concat(BOOLEAN_TYPES).filter((v, i, a) => a.indexOf(v) === i);

const DUMMY_RULE = {
    fieldname: `null`,
    expression: `null`,
    value: ``
};

class VectorLayerFilter extends React.Component {
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

    onRuleDelete(index) {
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

    getExpressionSetForType(type) {
        let expressionSet = EXPRESSIONS_FOR_STRINGS;                
        if (NUMBER_TYPES.indexOf(type) !== -1) {
            expressionSet = EXPRESSIONS_FOR_NUMBERS;
        } else if (DATE_TYPES.indexOf(type) !== -1) {
            expressionSet = EXPRESSIONS_FOR_DATES;
        } else if (BOOLEAN_TYPES.indexOf(type) !== -1) {
            expressionSet = EXPRESSIONS_FOR_BOOLEANS;
        }

        return expressionSet;
    }

    changeFieldname(value, columnIndex) {
        let filters = JSON.parse(JSON.stringify(this.state.filters));

        // Check if current expression is valid against new fieldname type
        for (let key in this.state.layer.fields) {
            if (key === value) {
                let type = this.state.layer.fields[key].type;
                let expressionSet = this.getExpressionSetForType(type);
                if (expressionSet.indexOf(filters.columns[columnIndex].expression) === -1) {
                    filters.columns[columnIndex].expression = expressionSet[0];
                }
            }
        }

        filters.columns[columnIndex].value = DUMMY_RULE.value;
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

    /**
     * Constructing select control for column fieldname
     * 
     * @param {*} column 
     * @param {*} index 
     * @param {*} layerKey 
     */
    renderFieldControl(column, index, layerKey) {
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

        let fieldControl = (<select
            id={ `column_select_` + layerKey + `_` + index }
            className="form-control"
            onChange={(event) => { this.changeFieldname(event.target.value, index) }}
            value={column.fieldname}
            style={{ width: `100px` }}>{columnOptions}</select>);

        return fieldControl;
    }

    /**
     * Constructing select control for expression
     * 
     * @param {*} column 
     * @param {*} index 
     * @param {*} layerKey 
     */
    renderExpressionControl(column, index, layerKey) {
        let expressionControl = false;
        if (column.fieldname === DUMMY_RULE.fieldname || column.expression === DUMMY_RULE.expression) {
            expressionControl = (<p className="text-secondary">{__(`Select field`)}</p>);
        } else {
            let expressionOptions = [];
            for (let key in this.state.layer.fields) {
                if (key === column.fieldname) {
                    let expressionSet = this.getExpressionSetForType(this.state.layer.fields[key].type);
                    expressionSet.map((expression, index) => {
                        expressionOptions.push(<option key={`expression_` + layerKey + `_` + (index + 1)} value={expression}>{expression}</option>);
                    });
                }
            }
            
            expressionControl = (<select
                id={ `expression_select_` + layerKey + `_` + index }
                className="form-control"
                onChange={(event) => { this.changeExpression(event.target.value, index) }}
                value={column.expression}
                style={{ width: SELECT_WIDTH }}>{expressionOptions}</select>);
        }

        return expressionControl;
    }

    render() {
        let allRulesAreValid = true;
        let layerKey = this.state.layer.f_table_name + '.' + this.state.layer.f_table_schema;

        let matchSelectorOptions = [];
        MATCHES.map((match, index) => { matchSelectorOptions.push(<option key={`match_` + index} value={match}>{__(match)}</option>); });
        let matchSelector = (<select
            id={ `match_select_` + layerKey }
            onChange={(event) => { this.changeMatchType(event.target.value) }}
            value={this.state.filters.match}
            className="form-control" style={{
                display: `inline`,
                width: SELECT_WIDTH
            }}>{matchSelectorOptions}</select>);

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

            let fieldControl = this.renderFieldControl(column, index, layerKey);
            let expressionControl = this.renderExpressionControl(column, index, layerKey);

            let valueIsValid = false;
            if (column.fieldname && column.fieldname !== 'null' && column.expression && column.expression !== 'null' && column.value) {
                valueIsValid = this.isValid(column.value, type);
            }

            let ruleValidityIndicator = (<span style={{ color: 'green' }}><i className="fa fa-check-circle"></i></span>);
            if (!valueIsValid) {
                ruleValidityIndicator = (<span style={{ color: 'red' }}><i className="fa fa-ban"></i></span>);
                allRulesAreValid = false;
            }

            /**
             * Different control for different types
             */
            let control = false;
            if (column.fieldname === DUMMY_RULE.fieldname) {
                //control = (<p className="text-secondary">{__(`Select field`)}</p>);
            } else {
                let id = (`expression_input_` + layerKey + `_` + index);
                const changeHandler = (value) => { this.changeValue(value, index) };
                if (STRING_TYPES.indexOf(type) !== -1) {
                    control = (<StringControl id={id} value={column.value} onChange={changeHandler}/>);
                } else if (NUMBER_TYPES.indexOf(type) !== -1) {
                    control = (<NumberControl id={id} value={column.value} onChange={changeHandler}/>);
                } else if (DATE_TYPES.indexOf(type) !== -1) {
                    control = (<DateControl id={id} value={column.value} onChange={changeHandler}/>);
                } else if (BOOLEAN_TYPES.indexOf(type) !== -1) {
                    control = (<BooleanControl id={id} value={column.value} onChange={changeHandler}/>);
                } else {
                    throw new Error(`Unrecognized type`);
                }
            }

            let divStyle = { display: `inline-block`, paddingRight: `10px` };
            let controlDivStyle = divStyle;
            controlDivStyle.maxWidth = `160px`;
            filterControls.push(<div key={`column_` + index}>
                <div className="form-group" style={divStyle}>
                    <button className="btn btn-xs btn-warning" type="button" onClick={this.onRuleDelete.bind(this, index)}>
                        <i className="fa fa-minus"></i>
                    </button>
                </div>
                <div className="form-group" style={divStyle}>{fieldControl}</div>
                <div className="form-group" style={divStyle}>{expressionControl}</div>
                <div className="form-group" style={controlDivStyle}>{control}</div>
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

VectorLayerFilter.propTypes = {
    layer: PropTypes.object.isRequired,
    filters: PropTypes.object.isRequired,
    onApply: PropTypes.func.isRequired,
};

export default VectorLayerFilter;