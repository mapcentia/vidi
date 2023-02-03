/*
 * @author     Martin Høgh
 * @copyright  2013-2023 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';
import PropTypes from 'prop-types';

class Download extends React.Component {
    constructor(props) {
        super(props);
    }
    handleDownload(e) {
        e.preventDefault();
        const format = e.target.getAttribute("data-format");
        this.props.onApplyDownload(this.props.layer.f_table_schema + `.` + this.props.layer.f_table_name, format);
    }

    render() {
        return (
            <div className="btn-group" role="group">
                <button type="button" className="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown"
                        aria-expanded="false">
                    Download
                </button>
                <ul className="dropdown-menu">
                    <li><a data-format="geojson" className="dropdown-item" href="#"
                           onClick={this.handleDownload.bind(this)}>GeoJSON</a></li>
                    <li><a data-format="csv" className="dropdown-item" href="#"
                           onClick={this.handleDownload.bind(this)}>CSV</a></li>
                    <li><a data-format="excel" className="dropdown-item" href="#"
                           onClick={this.handleDownload.bind(this)}>Excel</a></li>
                    <li>
                        <hr className="dropdown-divider"/>
                    </li>
                    <li><a data-format="ogr/GPKG" className="dropdown-item" href="#"
                           onClick={this.handleDownload.bind(this)}>GeoPackage</a></li>
                    <li><a data-format="ogr/ESRI Shapefile" className="dropdown-item" href="#"
                           onClick={this.handleDownload.bind(this)}>ESRI Shapefile</a></li>
                </ul>
            </div>
        )
    }
}

Download.propTypes = {
    onApplyDownload: PropTypes.func.isRequired,
    layer: PropTypes.object.isRequired,
};

export default Download;
