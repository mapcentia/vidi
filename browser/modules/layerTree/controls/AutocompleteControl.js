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

    render() {
        let _self = this;
        if (this.state.currentField !== this.props.field) {
            let field = this.props.field;
            this.setState({"currentField": field});
            let sql = btoa(`SELECT distinct(${this.props.field}) FROM ${this.props.layerKey}`);
            $.ajax({
                url: '/api/sql/nt',
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

        return (
            <ReactAutocomplete
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
                value={this.state.value}
                onChange={e => this.setState({value: e.target.value})}
                onSelect={value => this.handleOnSelect(value)}
                renderMenu={children => (
                    <div style={{
                        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                        padding: '2px 0',
                        position: 'fixed',
                        width: '100%',
                        maxWidth: '160px',
                        background: 'rgba(255, 255, 255, 1)',
                        zIndex: '10000'

                    }} className="menu">{children.slice(0, 10)}</div>
                )}
                inputProps={{
                    placeholder: "abc123",
                    style: {
                        boxSizing: "border-box",
                        margin: "0",
                        font: "inherit",
                        fontFamily: "inherit",
                        display: "block",
                        width: "100%",
                        color: "#555",
                        height: "38px",
                        padding: "7px 0",
                        fontSize: "16px",
                        lineHeight: "1.42857143",
                        border: "0",
                        backgroundImage: "linear-gradient(#222, #222), linear-gradient(#D2D2D2, #D2D2D2)",
                        backgroundSize: "0 2px, 100% 1px",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center bottom, center calc(100% - 1px)",
                        backgroundColor: "rgba(0, 0, 0, 0)",
                        transition: "background 0s ease-out",
                        float: "none",
                        boxShadow: "none",
                        borderRadius: "0",
                        marginBottom: "7px"
                    }
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