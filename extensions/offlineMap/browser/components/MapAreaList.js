const React = require('react');
const MapAreaListItem = require('./MapAreaListItem');

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

class MapAreaList extends React.Component {
    constructor(props) {
        super(props);

        this.mapObj = props.mapObj;

        this.state = {
            items: []
        };
    }

    componentWillReceiveProps(nextProps) {
        let items = [];
        if (nextProps.items) {
            for (let key in nextProps.items) {
                items.push({
                    id: key,
                    data: nextProps.items[key]
                });
            }
        }

        this.setState({ items });
    }

    onRefreshHandler(item) {
        this.props.onMapAreaRefresh(item);
    }

    onDeleteHandler(item) {
        this.props.onMapAreaDelete(item);
    }

    render() {
        if (this.state.items.length === 0) {
            return (<div style={{textAlign: 'center', padding: '20px'}}>{__("No map areas have been stored yet")}</div>);
        } else {
            let renderedItems = [];
            this.state.items.map((item, index) => {
                renderedItems.push(<MapAreaListItem
                    onRefresh={this.onRefreshHandler.bind(this, item)}
                    onDelete={this.onDeleteHandler.bind(this, item)}
                    mapObj={this.mapObj}
                    key={index}
                    id={item.key}
                    data={item.data}/>);
            });

            return (<table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">{__("Date")}</th>
                        <th scope="col">{__("Comment")}</th>
                        <th scope="col">{__("Actions")}</th>
                    </tr>
                </thead>
                <tbody>{renderedItems}</tbody>
            </table>);
        }       
    }
}

module.exports = MapAreaList;