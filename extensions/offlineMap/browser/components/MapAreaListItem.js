var React = require('react');

/**
 * MapAreaListItem component
 */

class MapAreaListItem extends React.Component {
    constructor(props) {
        super(props);

        this.id = props.id;
        this.data = props.data;
        this.mapObj = props.mapObj;
        this.extentLayer = false;

        this.state = {
            showExtent: false
        };

        this.onToggleShowExtent = this.onToggleShowExtent.bind(this);
    }

    onToggleShowExtent(e) {
        if (!this.state.showExtent) {
            let ne = this.data.extent._northEast;
            let sw = this.data.extent._southWest;
            let extentFeature = {
                "type":"FeatureCollection",
                "features":[
                    {
                        "type":"Feature",
                        "geometry": {
                            "type":"Polygon",
                            "coordinates":[[
                                [ne.lng, ne.lat],
                                [sw.lng, ne.lat],
                                [sw.lng, sw.lat],
                                [ne.lng, sw.lat],
                                [ne.lng, ne.lat]
                            ]]
                        },
                        "style":{
                            "fill":"red",
                            "stroke-width":"3",
                            "fill-opacity":0.6
                        },
                        "properties":{
                            "name": `Extent for map area ${this.id}`
                        }
                    }
                ]
            };
    
            this.extentLayer = L.geoJSON(extentFeature).addTo(this.mapObj);
        } else {
            this.mapObj.removeLayer(this.extentLayer);
        }

        this.setState({ showExtent: !this.state.showExtent });
    }

    render() {
        let smallButtonStyle = {
            paddingLeft: '0px',
            paddingRight: '0px'
        };

        let date = new Date(this.data.created_at.toString());
        let dateFormatted = (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear();

        let showExtentButton = (<button type="button" onClick={this.onToggleShowExtent} className="btn btn-sm btn-primary" style={smallButtonStyle} title={__("Show extent")}>
            <i className="material-icons">&#xE8F4;</i>
        </button>);
        if (this.state.showExtent === true) {
            showExtentButton = (<button type="button" onClick={this.onToggleShowExtent} className="btn btn-sm btn-primary" style={smallButtonStyle} title={__("Hide extent")}>
                <i className="material-icons">&#xE8F5;</i>
            </button>);
        }

        return (<tr>
            <td>{this.data.layerId}<br/>{dateFormatted}</td>
            <td>{this.data.comment}</td>
            <td>
                <div className="btn-group" role="group">
                    {showExtentButton}
                    <button type="button" onClick={this.props.onRefresh} className="btn btn-sm btn-primary" style={smallButtonStyle} title={__("Refresh")}>
                        <i className="material-icons">&#xE5D5;</i>
                    </button>
                    <button type="button" onClick={this.props.onDelete} className="btn btn-sm btn-primary" style={smallButtonStyle} title={__("Delete")}>
                        <i className="material-icons">&#xE872;</i>
                    </button>
                </div>
            </td>
        </tr>);
    }
}

module.exports = MapAreaListItem;