/*
 * @author     René Giovanni Borella
 * @copyright  2020 Geopartner A/S
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';


class LedningsDownload extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            format: '',
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
                    formatDesc: 'GeoJSON er et åbent tekst-baseret format. Bruges ofte i web-sammenhæng. Filen kan med fordel indlæses i  QGIS.',
                    formatDisable: false,
                    formatProduct: 'Man får en GeoJSON fil, dette er et direkte udtræk af ledningspakken.'
                }
            ],
            loading: false
        };
    }
    handleChange = (event) => {
        const _self = this

        _self.setState({format:event.target.value || ''})
    };

    handleClickOpen = () => {
        const _self = this
        _self.setState({open:true});
    };

    handleClose = () => {
        const _self = this
        _self.setState({
            open:false,
            format: ''
        });
    };

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
                _self.setState({loading:false})
            })
            .then(_self.setState({open:false,format: ''}))
            .catch(e => console.log(e))
        })
        .catch(e => console.log(e))
    };

    render() {
        const p = this.props
        const _self = this;
        const s = _self.state
        
        //console.log(p)
        //console.log(s)

        const container = {
            display: 'flex',
            flexWrap: 'wrap'
        }
        const formControl = {
            minWidth: 120
        }
        const margin = {
            margin: 10
        }

        let formatDescription, desc, product
        if (s.format === '') {
            desc = 'Vælg et format i siden, og få en fin forklaring over de forskellige formater du kan hente.'
            product = ''
        } else {
            desc = s.formatList.find(x => x.format === s.format).formatDesc
            product = s.formatList.find(x => x.format === s.format).formatProduct
        }


        return (
            
            <div>
                <button type="button" class="btn btn-sm btn-light" id="_draw_download_geojson" data-bs-toggle="modal" data-bs-target="#downloadModal">
                    <i class="bi bi-save" aria-hidden="true"></i> Download
                </button>

                <div class="modal" id="downloadModal" tabindex="-1" aria-labelledby="downloadModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">Vælg format</h4>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div className="form-check">
                                    <label>
                                        <input className="form-check-input" onClick={this.onCoordinatesSystemClick} type="radio"
                                            id="coordinates-system-utm"
                                            name="coordinates-system" value="utm"/>
                                        UTM
                                    </label>
                                </div>
                                <div class="container-fluid">
                                    <div class="row">
                                        <div class="col-sm-9">
                                            Level 1: .col-sm-9
                                            <div class="row">
                                            <div class="col-8 col-sm-6">
                                                Level 2: .col-8 .col-sm-6
                                            </div>
                                            <div class="col-4 col-sm-6">
                                                Level 2: .col-4 .col-sm-6
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>                      
                            <div class="modal-footer">
                                <button type="button" class="btn btn-sm btn-light" data-bs-dismiss="modal">Fortryd</button>
                                <button type="button" class="btn btn-sm btn-primary" onClick={this.handleDownload} disabled={this.state.format == '' ? true : false}>{this.state.loading ? 'Oversætter' : 'Download'}</button>
                                {this.state.loading && <div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div>}
                            </div>
                        </div>
                    </div>
                </div>  
            </div>
          );
    }
};

module.exports = LedningsDownload;