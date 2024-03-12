/*
 * @author     René Giovanni Borella
 * @copyright  2020 Geopartner A/S
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';

class LedningsDownload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            format: 'shp',
            formatList: [
                {
                    format: 'shp',
                    formatTitle: 'ESRI Shape',
                    formatDesc: 'Shape er et gængs format til udveksling af geografisk information. Filen kan med fordel indlæses i QGIS',
                    formatDisable: false,
                    formatProduct: 'Man får en pakket zip-fil med indhold. der vil være en shp-fil for hver geometri-type, samt en log over hvilke kolonner der har skiftet navn i oversættelsen.'
                },
                {
                    format: 'dxf',
                    formatTitle: 'DXF',
                    formatDesc: 'DXF er et almindeligt CAD-format.',
                    formatDisable: false,
                    formatProduct: 'Man får en pakket zip-fil indeholdende en enkelt DXF-fil. Filen er lagopdelt efter ejer og objekttype.'
                },
                {
                    format: 'geojson',
                    formatTitle: 'GeoJSON',
                    formatDesc: 'GeoJSON er et åbent tekst-baseret format. Bruges ofte i web-sammenhæng. Filen kan med fordel indlæses i QGIS.',
                    formatDisable: false,
                    formatProduct: 'Man får en GeoJSON fil, dette er et direkte udtræk af ledningspakken.'
                }
            ],
            loading: false,
        };
    }

    handleChange = (event) => {
        this.setState({ format: event.target.value || '' });
    };

    handleShow = () => this.setState({ show: true });
    handleClose = () => this.setState({ show: false, format: '', loading: false });

    handleDownload = () => {
        const _self = this

        const clickHandler = (file) => {
            setTimeout(() => {
              window.URL.revokeObjectURL(file);
            }, 150);
          };

        // Close and handle download
        let options = {
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            method: 'POST',
            body: JSON.stringify({forespNummer: _self.props.forespnummer, format: _self.state.format, schema: _self.props.schema})
        }
        let url = _self.props.endpoint

        // Set UI
        _self.setState({loading:true})

        fetch(url, options)
        .then( r => r.json())
        .then( d => {
            console.log(d)
            let urlBlob = "data:" + d.mime + ";base64," + d.base64

            //build blob
            fetch(urlBlob)
            .then(blobResponse => blobResponse.blob())
            .then(blob => {
                let file = window.URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = file;
                a.setAttribute('download', d.filename);
                a.addEventListener('click', clickHandler(file), false);
                a.click();
                a.removeEventListener('click', clickHandler);
                this.handleClose()
            })
            .catch(e => console.log(e))
        })
        .catch(e => console.log(e))
    };

    render() {
        const { show, format, formatList, loading } = this.state;
        const selectedFormat = formatList.find(f => f.format === format);
        const modalClass = show ? "modal fade show d-block" : "modal fade";

        return (
            <div>
                <button type="button" className="btn btn-sm btn-light" onClick={this.handleShow}>
                    Download
                </button>

                <div className={modalClass} tabIndex="-1" style={show ? { backgroundColor: 'rgba(0,0,0,0.5)' } : {}}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Vælg format</h5>
                                <button type="button" className="btn-close" onClick={this.handleClose}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        {formatList.map(f => (
                                            <div className="form-check" key={f.format}>
                                                <input 
                                                    className="form-check-input" 
                                                    type="radio" 
                                                    name="formatOption" 
                                                    id={`format-${f.format}`}
                                                    value={f.format}
                                                    checked={format === f.format}
                                                    onChange={this.handleChange}
                                                    disabled={f.formatDisable}
                                                />
                                                <label className="form-check-label" htmlFor={`format-${f.format}`}>
                                                    {f.formatTitle}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="col-md-6">
                                        {selectedFormat && (
                                            <>
                                                <p>{selectedFormat.formatDesc}</p>
                                                <p>{selectedFormat.formatProduct}</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={this.handleClose}>Fortryd</button>
                                <button type="button" className="btn btn-primary" onClick={this.handleDownload} disabled={!format || loading}>
                                    {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                                    {loading ? ' Loading...' : 'Download'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {show && <div className="modal-backdrop fade show"></div>}
            </div>
        );
    }
}

export default LedningsDownload;