const React = require('react');
const MapAreaListItem = require('./MapAreaListItem');

/**
 * MapAreaListItem component
 */

class MapAreaList extends React.Component {
    constructor(props) {
        super(props);

        this.mapObj = props.mapObj;
        this.state = {
            areaItems: (props.items ? this.itemsObjectToArray(props.items) : [])
        };
    }

    itemsObjectToArray(propItems) {
        let items = [];
        if (propItems) {
            for (let key in propItems) {
                items.push({
                    id: key,
                    data: propItems[key]
                });
            }
        }

        return items;
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ areaItems: this.itemsObjectToArray(nextProps.items) });
    }

    onRefreshHandler(item) {
        this.props.onMapAreaRefresh(item);
    }

    onDeleteHandler(item) {
        this.props.onMapAreaDelete(item);
    }

    render() {
        if (this.state.areaItems.length === 0) {
            return (<div style={{textAlign: 'center', padding: '20px'}}>{__("No map areas have been stored yet")}</div>);
        } else {
            let renderedItems = [];
            this.state.areaItems.map((item, index) => {
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
                        <th scope="col">{__("Info")}</th>
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