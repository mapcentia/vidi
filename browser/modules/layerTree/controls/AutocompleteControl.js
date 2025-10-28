/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2025 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Combobox } from 'react-widgets'


/**
 * String control component
 */
class AutocompleteControl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            options: [],
            currentField: null
        }

    }

    componentDidMount() {
        let _self = this;
        if (this.state.currentField !== this.props.field) {
            let field = this.props.field;
            this.setState({"currentField": field});
            let sql = btoa(`SELECT distinct(${this.props.field})
                            FROM ${this.props.layerKey}`);
            $.ajax({
                url: '/api/sql/' + this.props.db,
                contentType: 'application/x-www-form-urlencoded',
                scriptCharset: "utf-8",
                dataType: 'json',
                type: 'POST',
                data: 'base64=true&lifetime=0&client_encoding=UTF8&q=' + sql,
                success: function (response) {
                    let items = [];
                    response.features.forEach((e) => {
                        items.push(e.properties[field])
                    })
                    _self.setState({"options": items});
                },
                error: function (response) {
                }
            });
        }
    }

    render() {
        return (
            <div style={{display: "inline"}}>
                <Combobox
                    inputProps={{
                        id: this.props.id,
                        placeholder: "abc123",
                        className: "form-control form-control-sm"
                    }}
                    data={this.state.options}
                    value={this.props.value}
                    onChange={(value) => {
                        this.props.onChange(value === null || value === undefined ? '' : value)
                    }}
                    filter={(item, value) => {
                        if (!value || value.length <= 1) return false;
                        if (item === null || item === undefined) return false;
                        return item.toString().toLowerCase().startsWith(value.toString().toLowerCase());
                    }}
                />
            </div>
        )
    }
}

AutocompleteControl.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
    layerKey: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export {AutocompleteControl};
