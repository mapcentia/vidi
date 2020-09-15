/*
 * @author     René Giovanni Borella
 * @copyright  2020 Geopartner A/S
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import SaveIcon from '@material-ui/icons/Save';
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
                    formatDesc: 'DXF er et almindeligt CAD-format. ',
                    formatDisable: false,
                    formatProduct: 'Man får en pakket zip-fil (opdeling pr. type eller ejer? eller ejer/type? - hvad med komponenter?)'
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

        const clickHandler = () => {
            setTimeout(() => {
              URL.revokeObjectURL(file);
              this.removeEventListener('click', clickHandler);
            }, 150);
          };

        // Close and handle download
        let options = {
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            method: 'POST',
            body: JSON.stringify({forespNummer: _self.props.forespnummer, format: _self.state.format})
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
                a.addEventListener('click', clickHandler, false);
                a.click();
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
              <Button
                  size={p.size}
                  variant={p.variant}
                  color={p.color}
                  onClick={_self.handleClickOpen}
                  style={margin}
                >
                   <SaveIcon
                   fontSize="small"
                   /> Download
                </Button>
              <Dialog disableBackdropClick disableEscapeKeyDown open={s.open} onClose={_self.handleClose}>
                <DialogTitle>Vælg format</DialogTitle>
                <DialogContent>
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="flex-start"
                >

                
                    <Grid item xs={6}>
                        <form style={container}>
                          <FormControl style={formControl}>
                              <RadioGroup aria-label="format" name="format1" value={s.format} onChange={_self.handleChange}>
                                  {s.formatList.map(f => <FormControlLabel key={f.format} value={f.format} disabled={f.formatDisable} control={<Radio />} label={f.formatTitle} />)}
                              </RadioGroup>
                          </FormControl>
                        </form>
                    </Grid>
                    <Grid item xs={6}>
                        {desc === '' ? '' : <p>{desc}</p>}
                        {product === '' ? '' : <p>{product}</p>}
                    </Grid>
                </Grid>
                </DialogContent>
                <DialogActions>
                  <Button onClick={_self.handleClose} color="default" size={p.size} variant={p.variant}>
                    Fortryd
                  </Button>
                  <Button onClick={_self.handleDownload} color="primary" size={p.size} variant={p.variant} disabled={s.format == '' ? true : false}>
                    {s.loading ? 'Oversætter' : 'Download'}
                  </Button>
                  {s.loading && <CircularProgress size={20} />}
                </DialogActions>
              </Dialog>
            </div>
          );
    }
};

module.exports = LedningsDownload;