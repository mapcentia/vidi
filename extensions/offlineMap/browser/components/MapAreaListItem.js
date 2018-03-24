var React = require('react');

/**
 * Translations
 */
const translations = require('./../translations');

/**
 *
 * @param txt
 * @returns {*}
 * @private
 */
var __ = function (txt) {
    if (translations[txt][window._vidiLocale]) {
        return translations[txt][window._vidiLocale];
    } else {
        return txt;
    }
};

/**
 * MapAreaListItem component
 */

class MapAreaListItem extends React.Component {
    constructor(props) {
        super(props);

        this.id = props.id;
        this.data = props.data;
        
        this.state = {
            showExtent: false
        };

        this.onToggleShowExtent = this.onToggleShowExtent.bind(this);
    }

    onToggleShowExtent(e) {
        this.setState({ showExtent: !this.state.showExtent });
    }

    render() {
        let smallButtonStyle = {
            paddingLeft: '0px',
            paddingRight: '0px'
        };

        let date = new Date(this.data.created_at.toString());
        let dateFormatted = (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear();

        let showExtentIcon = (<i className="material-icons">&#xE8F4;</i>);
        if (this.state.showExtent === true) {
            showExtentIcon = (<i className="material-icons">&#xE8F5;</i>);
        }

        return (<tr>
            <td>{dateFormatted}</td>
            <td>{this.data.comment}</td>
            <td>
                <div className="btn-group" role="group">
                    <button type="button" onClick={this.onToggleShowExtent} className="btn btn-sm btn-primary" style={smallButtonStyle} title={__("Show extent")}>
                        
                    </button>
                    <button type="button" className="btn btn-sm btn-primary" style={smallButtonStyle} title={__("Refresh")}>
                        <i className="material-icons">&#xE5D5;</i>
                    </button>
                    <button type="button" className="btn btn-sm btn-primary" style={smallButtonStyle} title={__("Delete")}>
                        <i className="material-icons">&#xE872;</i>
                    </button>
                </div>
            </td>
        </tr>);
    }
}

module.exports = MapAreaListItem;