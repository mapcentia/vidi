/*
 * @author     Martin Høgh
 * @copyright  2013-2023 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
    EXPRESSIONS_FOR_BOOLEANS,
    EXPRESSIONS_FOR_DATES,
    EXPRESSIONS_FOR_NUMBERS,
    EXPRESSIONS_FOR_STRINGS,
    MATCHES
} from './filterUtils';
import {
    AutocompleteControl,
    BooleanControl,
    DateControl,
    DatetimeControl,
    NumberControl,
    StringControl,
    TimeControl
} from './controls';
import LayerFilterSubBlock from "./LayerFilterSubBlock";

/**
 * Layer filter component
 */
const SELECT_WIDTH = `50px`;

const STRING_TYPES = [`text`, `string`, `character`, `character varying`, `uuid`];
const NUMBER_TYPES = [`smallint`, `bigint`, `integer`, `double precision`, `numeric`, `decimal`, 'real'];
const DATE_TYPES = [`date`];
const TIME_TYPES = [`time with time zone`, `time without time zone`];
const DATETIME_TYPES = [`timestamp`, `timestamp with time zone`, `timestamp without time zone`];
const BOOLEAN_TYPES = [`boolean`];
const ALLOWED_TYPES_IN_FILTER = [].concat(STRING_TYPES).concat(NUMBER_TYPES).concat(DATETIME_TYPES).concat(DATE_TYPES).concat(TIME_TYPES).concat(BOOLEAN_TYPES).filter((v, i, a) => a.indexOf(v) === i);

const DUMMY_RULE = {
    fieldname: `null`,
    expression: `null`,
    value: ``
};
const DUMMY_BLOCK = {
    sub: {}
};
let allRulesAreValid = true;

class VectorLayerFilterSubBlock extends React.Component {
    constructor(props) {
        super(props);
        let predefinedFilters = [];
        for (let key in props.predefinedFilters) {
            predefinedFilters.push({
                name: key,
                value: props.predefinedFilters[key]
            });
        }
        let arbitraryFilters = props.arbitraryFilters || {};
        if (!(`match` in arbitraryFilters)) arbitraryFilters[`match`] = (props.layerMeta && `default_match` in props.layerMeta && MATCHES.indexOf(props.layerMeta.default_match) > -1 ? props.layerMeta.default_match : MATCHES[0]);
        if (!(`columns` in arbitraryFilters)) arbitraryFilters[`columns`] = [];

        if (arbitraryFilters.columns.length === 0) {
            arbitraryFilters.columns.push(DUMMY_RULE);
        }
        this.state = {
            layer: props.layer,
            arbitraryFilters,
        };
    }

    updateRootFilters() {
        setTimeout(() => {
            this.props.setFilters();
        }, 100)
    }

    getFilters() {
        let s = {
            columns: [],
            match: null
        };
        this?.state?.arbitraryFilters?.columns?.map((f, i) => {
            if (typeof f?.sub === "object") {
                s.columns[i] = {}
                s.columns[i].sub = this?.block[i]?.current?.getFilters();
            } else {
                s.columns[i] = f;
            }
        })
        s.match = this?.state?.arbitraryFilters?.match;
        return s;
    }

    onRuleDelete(index) {
        let filters = this.state.arbitraryFilters;
        filters.columns.splice(index, 1);
        this.setState({arbitraryFilters: filters});
        this.updateRootFilters();
        //this.forceUpdate();
    }

    onRuleAdd() {
        let filters = this.state.arbitraryFilters;
        filters.columns.push(DUMMY_RULE);
        this.setState({arbitraryFilters: filters});
        this.updateRootFilters();
    }

    onBlockAdd() {
        let filters = this.state.arbitraryFilters;
        const block = DUMMY_BLOCK;
        block.sub = {};
        filters.columns.push(block);
        this.setState({arbitraryFilters: filters});
        this.updateRootFilters();
    }

    changeMatchType(value) {
        let filters = JSON.parse(JSON.stringify(this.state.arbitraryFilters));
        filters.match = value;
        this.setState({arbitraryFilters: filters});
        this.updateRootFilters();
    }

    getExpressionSetForType(type) {
        let expressionSet = EXPRESSIONS_FOR_STRINGS;
        if (NUMBER_TYPES.indexOf(type) !== -1) {
            expressionSet = EXPRESSIONS_FOR_NUMBERS;
        } else if (DATE_TYPES.indexOf(type) !== -1 || DATETIME_TYPES.indexOf(type) !== -1 || TIME_TYPES.indexOf(type) !== -1) {
            expressionSet = EXPRESSIONS_FOR_DATES;
        } else if (BOOLEAN_TYPES.indexOf(type) !== -1) {
            expressionSet = EXPRESSIONS_FOR_BOOLEANS;
        }

        return expressionSet;
    }

    changeFieldname(value, columnIndex) {
        let filters = JSON.parse(JSON.stringify(this.state.arbitraryFilters));

        // Check if current expression is valid against new fieldname type
        for (let key in this.state.layer.fields) {
            if (key === value) {
                let type = this.state.layer.fields[key].type;
                let expressionSet = this.getExpressionSetForType(type);
                if (expressionSet.indexOf(filters.columns[columnIndex].expression) === -1) {
                    filters.columns[columnIndex].expression = expressionSet[0];
                }

                if (this.state.layer.fields[key].restriction) {
                    filters.columns[columnIndex].restriction = this.state.layer.fields[key].restriction;
                } else {
                    filters.columns[columnIndex].restriction = false;
                }
            }
        }

        filters.columns[columnIndex].value = DUMMY_RULE.value;
        filters.columns[columnIndex].fieldname = value;
        this.setState({arbitraryFilters: filters});
        this.updateRootFilters();
    }

    changeExpression(value, columnIndex) {
        let filters = JSON.parse(JSON.stringify(this.state.arbitraryFilters));
        filters.columns[columnIndex].expression = value;
        this.setState({arbitraryFilters: filters});
        this.updateRootFilters();
    }

    changeValue(value, columnIndex) {
        let filters = JSON.parse(JSON.stringify(this.state.arbitraryFilters));
        filters.columns[columnIndex].value = value;
        this.setState({arbitraryFilters: filters});
        this.updateRootFilters();
    }

    isValid(value, type) {
        value = value + "";
        let valueIsValid = false;
        if (NUMBER_TYPES.indexOf(type) === -1) {
            valueIsValid = true;
        } else {
            let intReg = /^\d+$/;
            let floatReg = /^[+-]?\d+(\.\d+)?$/;
            if ((type === `smallint` || type === `integer` || type === `bigint`) && value.match(intReg)) {
                valueIsValid = true;
            } else if ((type === `double precision` || type === `numeric` || type === `real` || type === `decimal`) && value.match(floatReg)) {
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
        let fieldconf = null;
        if (this.state.layer.fieldconf) {
            try {
                fieldconf = JSON.parse(this.state.layer.fieldconf)
            } catch (e) {
            }
        }
        for (let key in this.state.layer.fields) {
            let field = this.state.layer.fields[key];
            if ((fieldconf === null || fieldconf[key] === undefined) || (typeof fieldconf[key]["filter"] !== "undefined" && fieldconf[key]["filter"] !== true)) {
                let alias = null;
                if (fieldconf && typeof fieldconf[key] === "object" && typeof fieldconf[key]["alias"] !== "undefined") {
                    alias = fieldconf[key]["alias"];
                }
                if (ALLOWED_TYPES_IN_FILTER.indexOf(field.type) !== -1) {
                    columnOptions.push(
                        <option key={`field_` + layerKey + `_` + columnIndex} value={key}>{alias || key}</option>);
                    columnIndex++;
                }
            }
        }

        return (<select
            id={`column_select_` + layerKey + `_` + index}
            className="form-control form-control-sm"
            onChange={(event) => {
                this.changeFieldname(event.target.value, index)
            }}
            value={column.fieldname}
            style={{width: `100px`}}>{columnOptions}</select>);
    }

    /**
     * Constructing select control for expression
     *
     * @param {*} column
     * @param {*} index
     * @param {*} layerKey
     */
    renderExpressionControl(column, index, layerKey) {
        let expressionControl;
        if (column.fieldname === DUMMY_RULE.fieldname || column.expression === DUMMY_RULE.expression) {
            expressionControl = (<p></p>);
        } else {
            let expressionOptions = [];
            for (let key in this.state.layer.fields) {
                if (key === column.fieldname) {
                    let expressionSet = this.getExpressionSetForType(this.state.layer.fields[key].type);
                    expressionSet.map((expression, index) => {
                        expressionOptions.push(
                            <option key={`expression_` + layerKey + `_` + (index + 1)}
                                    value={expression}>{expression}</option>);
                    });
                }
            }

            expressionControl = (<select
                id={`expression_select_` + layerKey + `_` + index}
                className="form-control form-control-sm"
                onChange={(event) => {
                    this.changeExpression(event.target.value, index)
                }}
                value={column.expression}
                style={{width: SELECT_WIDTH}}>{expressionOptions}</select>);
        }
        return expressionControl;
    }

    componentDidUpdate(prevProps, prevState) {
        if (JSON.stringify(prevProps.arbitraryFilters) !== JSON.stringify(this.props.arbitraryFilters)) {
            this.setState({arbitraryFilters: this.props.arbitraryFilters})
        }
    }

    render() {
        this.block = [];
        let layerKey = this.state.layer.f_table_schema + '.' + this.state.layer.f_table_name;

        let matchSelectorOptions = [];
        MATCHES.map((match, index) => {
            matchSelectorOptions.push(<option key={`match_` + index} value={match}>{__(match)}</option>);
        });
        let matchSelector = (<select
            id={`match_select_` + layerKey}
            onChange={(event) => {
                this.changeMatchType(event.target.value)
            }}
            value={this.state.arbitraryFilters.match}
            className="form-select form-select-sm" style={{
            display: `inline`,
            width: "85px"
        }}>{matchSelectorOptions}</select>);

        let filterControls = [];

        if (this.state.arbitraryFilters.columns.length === 0) {
            allRulesAreValid = false;
        }

        this.state.arbitraryFilters.columns.map((column, index) => {
            let type = false;
            let isSubBlock = false;
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
            if (column.sub) {
                valueIsValid = true;
            }

            let ruleValidityIndicator = (<span style={{color: 'green'}}><i className="bi bi-check-circle"></i></span>);
            if (!valueIsValid) {
                ruleValidityIndicator = (<span style={{color: 'red'}}><i className="bi bi-slash-circle"></i></span>);
                allRulesAreValid = false;
            }

            /**
             * Different control for different types
             */
            let control = false;
            if (column.fieldname !== DUMMY_RULE.fieldname) {
                let id = (`expression_input_` + layerKey + `_` + index);
                const changeHandler = (value) => {
                    this.changeValue(value, index);
                };

                let fieldconf = null;
                if (this.state.layer.fieldconf) {
                    try {
                        fieldconf = JSON.parse(this.state.layer.fieldconf)
                    } catch (e) {
                    }
                }

                if (STRING_TYPES.indexOf(type) !== -1 && fieldconf && fieldconf[column.fieldname] && fieldconf[column.fieldname].autocomplete) {
                    control = (
                        <AutocompleteControl id={id} value={column.value} layerKey={layerKey} field={column.fieldname}
                                             restriction={column.restriction} db={this.props.db}
                                             onChange={changeHandler}/>);
                } else if (STRING_TYPES.indexOf(type) !== -1) {
                    control = (
                        <StringControl id={id} value={column.value} restriction={column.restriction}
                                       onChange={changeHandler}/>);
                } else if (NUMBER_TYPES.indexOf(type) !== -1) {
                    control = (
                        <NumberControl id={id} value={column.value} restriction={column.restriction}
                                       onChange={changeHandler}/>);
                } else if (DATE_TYPES.indexOf(type) !== -1) {
                    control = (<DateControl id={id} value={column.value} onChange={changeHandler}/>);
                } else if (DATETIME_TYPES.indexOf(type) !== -1) {
                    control = (<DatetimeControl id={id} value={column.value} onChange={changeHandler}/>);
                } else if (TIME_TYPES.indexOf(type) !== -1) {
                    control = (<TimeControl id={id} value={column.value} onChange={changeHandler}/>);
                } else if (BOOLEAN_TYPES.indexOf(type) !== -1) {
                    control = (<BooleanControl id={id} value={column.value} onChange={changeHandler}/>);
                } else {
                    this.block[index] = React.createRef();
                    isSubBlock = true;
                    control = (
                        <LayerFilterSubBlock ref={this.block[index]} layer={this.props.layer}
                                             layerMeta={this.props.layerMeta}
                                             presetFilters={this.props.presetFilters}
                                             arbitraryFilters={column.sub}
                                             setFilters={this.props.setFilters}
                                             isFilterImmutable={this.props.isFilterImmutable}
                        />);
                }
            }

            if (!isSubBlock) {
                filterControls.push(<div key={`column_` + index} className="d-flex align-items-center gap-1">
                    <div className="form-group">
                        <button className="btn btn-light btn-sm" type="button"
                                onClick={this.onRuleDelete.bind(this, index)}
                                style={{display: this.props.isFilterImmutable ? "none" : "inline"}}>
                            <i className="bi bi-dash"></i>
                        </button>
                    </div>
                    <div className="form-group">{fieldControl}</div>
                    <div className="form-group">{expressionControl}</div>
                    <div className="form-group flex-fill">{control}</div>
                    <div className="d-flex align-items-center">{ruleValidityIndicator}</div>
                </div>);
            } else {
                filterControls.push(
                    <div key={`column_` + index}
                         className="d-flex align-items-center gap-1">
                        <div className="form-group align-self-start">
                            <button className="btn btn-light btn-sm" type="button"
                                    onClick={this.onRuleDelete.bind(this, index)}
                                    style={{display: this.props.isFilterImmutable ? "none" : "inline"}}>
                                <i className="bi bi-dash"></i>
                            </button>
                        </div>
                        <div className="p-2 w-100"
                             style={{"borderRadius": "0.375rem", "border": "1px solid #ced4da"}}>{control}</div>
                        <div className="d-flex align-items-center invisible">{ruleValidityIndicator}</div>
                    </div>
                );
            }
        });

        /**
         * Builds the arbitrary filters tab
         */
        const buildArbitraryTab = () => {
            return (
                <div className="js-arbitrary-filters gap-1 d-flex flex-column mb-2"
                     style={this.state.editorFiltersActive ? {
                         pointerEvents: "none",
                         opacity: "0.2"
                     } : {}}>
                    <div className="form-group" style={{display: this.props.isFilterImmutable ? "none" : "inline"}}>
                        {__(`Match the following using operator`)} : {matchSelector}
                    </div>
                    <div className="d-flex flex-column gap-1">{filterControls}</div>
                    <div className="d-flex gap-1">
                        <div className="btn-group" style={{display: this.props.isFilterImmutable ? "none" : "inline"}}>
                            <button className="btn btn-light btn-sm" data-bs-toggle="dropdown" type="button" onClick={this.onRuleAdd.bind(this)}>
                                <i className="bi bi-plus"></i>
                            </button>
                            <button className="btn btn-light btn-sm dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" type="button">
                                <span className="visually-hidden">Toggle Dropdown</span>
                            </button>
                            <ul className="dropdown-menu">
                                <li><button className="dropdown-item"  onClick={this.onBlockAdd.bind(this)}>{__("New block")}</button></li>
                            </ul>
                        </div>
                    </div>
                </div>
            );
        }

        let activeFiltersTab;
        let tabControl = false;
        activeFiltersTab = buildArbitraryTab();
        return (
            <div className="d-flex flex-column gap-1">
                {tabControl}
                {activeFiltersTab}
            </div>
        );
    }
}

VectorLayerFilterSubBlock.propTypes = {
    layer: PropTypes.object.isRequired,
    layerMeta: PropTypes.any.isRequired,
    presetFilters: PropTypes.array,
    arbitraryFilters: PropTypes.object.isRequired,
    isFilterImmutable: PropTypes.bool.isRequired
};

export default VectorLayerFilterSubBlock;
