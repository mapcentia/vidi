/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2020 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';
import PropTypes from 'prop-types';
import ReactAutocomplete from 'react-autocomplete'


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

    handleOnSelect(value) {
        this.setState({value});
        this.props.onChange(value)
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
            <ReactAutocomplete
                wrapperStyle={{display: "inline"}}
                id={this.props.id}
                items={this.state.options}
                shouldItemRender={(item, value) => {
                    if (value.length > 1) {
                        if (item !== null) {
                            return item.toLowerCase().startsWith(value.toLocaleLowerCase());
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }}
                getItemValue={item => item}
                renderItem={(item, highlighted) =>
                    <div key={item} style={{backgroundColor: highlighted ? '#eee' : 'transparent'}}>{item}</div>
                }
                value={this.props.value}
                onChange={(event) => {
                    this.props.onChange(event.target.value)
                }}
                onSelect={value => this.handleOnSelect(value)}
                renderMenu={children => (
                    <div style={{
                        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                        padding: '2px 0',
                        position: 'absolute',
                        width: '100%',
                        maxWidth: '160px',
                        background: 'rgba(255, 255, 255, 1)',
                        zIndex: '10000'

                    }}
                         className="menu">{children.slice(0, 10)}</div>
                )}
                inputProps={{
                    placeholder: "abc123",
                    className: "form-control form-control-sm"

                }}
            />
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
