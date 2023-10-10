/*
 * @author     Alexander Shumilov
 * @copyright  2013-2023 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
    MATCHES,
    validateFilters
} from './filterUtils';

import LayerFilterSubBlock from "./LayerFilterSubBlock";
import mustache from 'mustache';

const SELECT_WIDTH = `50px`;
const PREDEFINED_TAB = 0;
const ARBITRARY_TAB = 1;
const DUMMY_RULE = {
    fieldname: `null`,
    expression: `null`,
    value: ``
};

class VectorLayerFilter extends React.Component {
    constructor(props) {
        super(props);
        this.block = React.createRef();

        let predefinedFilters = [];
        for (let key in props.predefinedFilters) {
            predefinedFilters.push({
                name: key,
                value: props.predefinedFilters[key]
            });
        }

        let disabledPredefinedFilters = [];
        if (Array.isArray(props.disabledPredefinedFilters) && props.disabledPredefinedFilters.length > 0) {
            props.disabledPredefinedFilters.map(item => {
                let filterExists = false;
                predefinedFilters.map(filter => {
                    if (filter.name === item) {
                        filterExists = true;
                    }
                });

                if (filterExists) {
                    disabledPredefinedFilters.push(item);
                } else {
                    console.warn(`Unrecognized filter ${item} for ${props.layerKey}`);
                }
            });
        }

        let arbitraryFilters = props.arbitraryFilters || {};
        if (!(`match` in arbitraryFilters)) arbitraryFilters[`match`] = (props.layerMeta && `default_match` in props.layerMeta && MATCHES.indexOf(props.layerMeta.default_match) > -1 ? props.layerMeta.default_match : MATCHES[0]);
        if (!(`columns` in arbitraryFilters)) arbitraryFilters[`columns`] = [];

        if (this.props.presetFilters.length > 0) {
            this.props.presetFilters.map(item => {
                let filterIsAlreadySet = false;
                arbitraryFilters.columns.map(alreadyExistingFilterItem => {
                    if (alreadyExistingFilterItem.fieldname === item.field) {
                        filterIsAlreadySet = true;
                    }
                });

                if (filterIsAlreadySet === false) {
                    arbitraryFilters.columns.push({
                        fieldname: item.field,
                        expression: item.operator,
                        value: ``,
                        restriction: this.props.layer.fields[item.field]?.restriction || false
                    });
                }
            });
        } else if (arbitraryFilters.columns.length === 0) {
            arbitraryFilters.columns.push(DUMMY_RULE);
        }

        // Validating the arbitraryFilters structure
        validateFilters(arbitraryFilters);
        this.setFilters = this.setFilters.bind(this);
        this.state = {
            activeTab: PREDEFINED_TAB,
            layer: props.layer,
            arbitraryFilters,
            predefinedFilters,
            disabledPredefinedFilters,
            editorFilters: props.editorFilters,
            editorFiltersActive: props.editorFiltersActive,
            isAllBlocksValid: true
        };
    }

    onRulesApply() {
        const filters = this.block.current.getFilters();
        this.setState({arbitraryFilters: filters})
        this.props.onApplyArbitrary({
            layerKey: (this.props.layer.f_table_schema + `.` + this.props.layer.f_table_name),
            filters: JSON.parse(JSON.stringify(filters))
        });
    }

    onRulesClear() {
        let layerKey = this.props.layer.f_table_schema + `.` + this.props.layer.f_table_name;
        this.props.onDisableArbitrary(layerKey);
        this.props.onApplyArbitrary({
            layerKey: layerKey,
            filters: {
                match: `any`,
                columns: []
            }
        });
    }

    setFilters() {
        const filters = this.block.current.getFilters();
        this.setState({arbitraryFilters: filters})
    }

    switchActiveTab() {
        this.setState({activeTab: (this.state.activeTab === PREDEFINED_TAB ? ARBITRARY_TAB : PREDEFINED_TAB)});
    }

    handlePredefinedFiltersChange(event, filterName) {
        let disabledPredefinedFilters = this.state.disabledPredefinedFilters;
        if (event.target.checked && disabledPredefinedFilters.indexOf(filterName) > -1) {
            disabledPredefinedFilters.splice(disabledPredefinedFilters.indexOf(filterName), 1);
        } else {
            disabledPredefinedFilters.push(filterName);
        }

        this.setState({disabledPredefinedFilters});
        this.props.onApplyPredefined({
            layerKey: (this.props.layer.f_table_schema + `.` + this.props.layer.f_table_name),
            filters: disabledPredefinedFilters
        });
    }

    applyEditor() {
        this.props.onApplyEditor({
            layerKey: (this.props.layer.f_table_schema + `.` + this.props.layer.f_table_name),
        });
    }

    activateEditor() {
        this.setState({editorFiltersActive: event.target.checked})
        this.props.onActivateEditor({
            layerKey: (this.props.layer.f_table_schema + `.` + this.props.layer.f_table_name),
            active: event.target.checked
        });
    }

    handleReset() {
        let props = this.props;
        let arbitraryFilters = props.arbitraryFilters || {};
        let resetArbitraryFilters = {
            match: (props.layerMeta && `default_match` in props.layerMeta && MATCHES.indexOf(props.layerMeta.default_match) > -1 ? props.layerMeta.default_match : MATCHES[0]),
            columns: []
        };
        if (props.presetFilters.length === 0) {
            resetArbitraryFilters.columns.push(DUMMY_RULE);
        } else {
            arbitraryFilters.columns.forEach((a) => {
                props.presetFilters.forEach((p) => {
                    if (p.field === a.fieldname) {
                        resetArbitraryFilters.columns.push({fieldname: p.field, expression: p.operator, value: ""});
                    }
                })
            })
        }
        // Validating the arbitraryFilters structure
        validateFilters(resetArbitraryFilters);
        this.onRulesClear();
        this.setState({arbitraryFilters: resetArbitraryFilters});
    }

    handleFitBounds() {
        this.props.onApplyFitBounds(this.props.layer.f_table_schema + `.` + this.props.layer.f_table_name);
    }

    render() {
        let matchSelectorOptions = [];
        MATCHES.map((match, index) => {
            matchSelectorOptions.push(<option key={`match_` + index} value={match}>{__(match)}</option>);
        });

        /**
         * Builds the arbitrary filters tab
         */
        const buildArbitraryTab = () => {

            /**
             * Build notification about the existing children
             */
            return (
                <div className="js-arbitrary-filters gap-1 d-flex flex-column mb-2"
                     style={this.state.editorFiltersActive ? {
                         pointerEvents: "none",
                         opacity: "0.2"
                     } : {}}>
                    <div className="d-flex flex-column gap-1">{<LayerFilterSubBlock ref={this.block}
                                                                                    layer={this.props.layer}
                                                                                    layerMeta={this.props.layerMeta}
                                                                                    presetFilters={this.props.presetFilters}
                                                                                    arbitraryFilters={this.state.arbitraryFilters}
                                                                                    setFilters={this.setFilters}
                                                                                    isFilterImmutable={this.props.isFilterImmutable}
                    />}</div>
                    <div className="d-flex gap-1">
                        <button className="btn btn-outline-success btn-sm" type="button"
                                onClick={this.onRulesApply.bind(this)}>
                            <i className="bi bi-check"></i><span className="d-none d-lg-inline"> {__(`Apply`)}</span>
                        </button>
                        <button className="btn btn-light btn-sm" type="button" onClick={this.onRulesClear.bind(this)}>
                            <i className="bi bi-eraser"></i><span className="d-none d-lg-inline"> {__(`Disable`)}</span>
                        </button>
                        {buildResetButton()}
                    </div>
                </div>
            );
        }

        /**
         * Builds the predefined filters tab
         */
        const buildPredefinedTab = () => {
            let predefinedFiltersTab = [];
            this.state.predefinedFilters.map((item, index) => {
                let filterIsActive = (this.state.disabledPredefinedFilters.indexOf(item.name) === -1);
                const id = `tile_filter_` + (this.props.layer.f_table_schema + `.` + this.props.layer.f_table_name);
                predefinedFiltersTab.push(
                    <div key={`tile_filter_` + index} style={this.state.editorFiltersActive ? {
                        pointerEvents: "none",
                        opacity: "0.2"
                    } : {}}>
                        <div className="form-check">
                            <label className="form-check-label d-flex align-items-center gap-1">
                                <input
                                    className="form-check-input"
                                    checked={filterIsActive}
                                    onChange={(event) => {
                                        this.handlePredefinedFiltersChange(event, item.name)
                                    }}
                                    type="checkbox"
                                    name={id}
                                />
                                {item.name}
                            </label>
                        </div>
                    </div>
                );
            });

            return (<div className="js-predefined-filters">{predefinedFiltersTab}</div>);
        };

        /**
         * Builds the WHERE field
         */
        const buildWhereClauseField = () => {
            const handleChange = (event) => {
                let parsedValue = [event.target.value];
                this.setState({"editorFilters": parsedValue});
                this.props.onChangeEditor({
                    layerKey: (this.props.layer.f_table_schema + `.` + this.props.layer.f_table_name),
                    filters: parsedValue || null
                });
            };
            return (
                <div className="where-clause-field" style={{
                    marginTop: "25px",
                    display: this.props.isFilterImmutable ? "none" : "inline"
                }}>
                    <div className="form-check">
                        <input id="filter-editor-switch" className="form-check-input" type="checkbox"
                               checked={this.state.editorFiltersActive}
                               onChange={this.activateEditor.bind(this)}/>
                        <label htmlFor="filter-editor-switch"
                               className="form-check-label d-flex align-items-center gap-1">
                            {__(`Filter editor`)}
                        </label>
                    </div>
                    <div style={!this.state.editorFiltersActive ? {pointerEvents: "none", display: "none"} : {}}>
                        <textarea
                            className="form-control w-100 mb-2"
                            onChange={handleChange}
                            name={`editor_filter_` + (this.props.layer.f_table_schema + `.` + this.props.layer.f_table_name)}
                            value={
                                this.state.editorFilters[0]
                            }
                        />
                        <button style={!this.state.editorFiltersActive ? {
                            pointerEvents: "none",
                            opacity: "0.2"
                        } : {}} type="button" className="btn btn-sm btn-outline-success w-100"
                                onClick={this.applyEditor.bind(this)}>
                            <i className="bi bi-check"></i><span className="d-none d-lg-inline"> {__(`Apply`)}</span>
                        </button>
                    </div>
                </div>
            )
        };

        const buildResetButton = () => {
            return (<button className="btn btn-sm btn-outline-danger" onClick={this.handleReset.bind(this)}>
                <i className="bi bi-reply"></i><span className="d-none d-lg-inline"> {__(`Reset`)}</span></button>)
        };

        const buildFitBoundsButton = () => {
            return (<button className="btn btn-sm btn-outline-secondary set-extent-btn w-100"
                            onClick={this.handleFitBounds.bind(this)}>
                <i className="bi bi-arrows-fullscreen"></i> {__(`Fit bounds to filter`)}</button>)
        };

        let activeFiltersTab;
        let tabControl = false;
        if (Object.keys(this.state.predefinedFilters).length > 0) {
            tabControl = (<div>
                <div className="btn-group w-100" role="group">
                    <input type="radio" id="predefined-filter-tab" name="sdsd" className="btn-check"
                           checked={this.state.activeTab === PREDEFINED_TAB}
                           onChange={this.switchActiveTab.bind(this)}/>
                    <label className="btn btn-outline-secondary btn-sm" htmlFor="predefined-filter-tab">
                        {__(`Predefined`)}
                    </label>
                    <input type="radio" id="arbitrary-filter-tab" name="sdsd" className="btn-check"
                           checked={this.state.activeTab === ARBITRARY_TAB}
                           onChange={this.switchActiveTab.bind(this)}/>
                    <label className="btn btn-outline-secondary btn-sm" htmlFor="arbitrary-filter-tab">
                        {__(`Arbitrary`)}
                    </label>
                </div>
            </div>);

            if (this.state.activeTab === PREDEFINED_TAB) {
                activeFiltersTab = buildPredefinedTab();
            } else {
                activeFiltersTab = buildArbitraryTab();
            }
        } else {
            activeFiltersTab = buildArbitraryTab();
        }
        let html, jsx;
        let filterHtmlTemplate = this.props.layerMeta?.filter_html_template;
        if (filterHtmlTemplate) {
            const dict = {filters: this.state.editorFilters[0]};
            html = mustache.render(filterHtmlTemplate, dict);
            if (html) {
                jsx = (<div dangerouslySetInnerHTML={{__html: html}}></div>)
            }
        }

        return (
            <div className="d-flex flex-column gap-1">
                {tabControl}
                {activeFiltersTab}
                {buildFitBoundsButton()}
                <div className="filter-functions">
                    {buildWhereClauseField()}
                </div>
                {jsx}
            </div>
        );
    }
}

VectorLayerFilter.propTypes = {
    layer: PropTypes.object.isRequired,
    layerMeta: PropTypes.any.isRequired,
    presetFilters: PropTypes.array,
    predefinedFilters: PropTypes.object.isRequired,
    disabledPredefinedFilters: PropTypes.array.isRequired,
    arbitraryFilters: PropTypes.object.isRequired,
    onApplyPredefined: PropTypes.func.isRequired,
    onApplyArbitrary: PropTypes.func.isRequired,
    onDisableArbitrary: PropTypes.func.isRequired,
    onApplyFitBounds: PropTypes.func.isRequired,
    onChangeEditor: PropTypes.func.isRequired,
    onActivateEditor: PropTypes.func.isRequired,
    onApplyEditor: PropTypes.func.isRequired,
    editorFilters: PropTypes.array.isRequired,
    editorFiltersActive: PropTypes.bool.isRequired,
    isFilterImmutable: PropTypes.bool.isRequired,
};

export default VectorLayerFilter;
