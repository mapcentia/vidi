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
                    formatDesc: 'Bla Bla 1',
                    formatProduct: 'Man får bla bla 1'
                },
                {
                    format: 'dxf',
                    formatTitle: 'DXF',
                    formatDesc: 'Bla Bla 2',
                    formatProduct: 'Man får bla bla 2'
                },
                {
                    format: 'geojson',
                    formatTitle: 'GeoJSON',
                    formatDesc: 'Bla Bla 2',
                    formatProduct: 'Man får bla bla 3'
                }
            ]
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
        fetch(url, options)
        .then( r => r.json())
        .then( d => {
            console.log(d)
            let urlBlob = "data:" + d.mimetype + ";base64," + d.base64

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
            })
        })


        //.then(_self.setState({open:false,format: ''}))
        .catch(e => console.log(e))
    };

    render() {
        const p = this.props
        const _self = this;
        const s = _self.state
        
        console.log(p)
        console.log(s)

        const container = {
            display: 'flex',
            fexWrap: 'wrap'
        }
        const formControl = {
            minWidth: 120
        }
        const margin = {
            margin: 10
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
                <DialogTitle>Vælg format og download</DialogTitle>
                <DialogContent>
                  <form style={container}>
                    <FormControl style={formControl}>
                        <RadioGroup aria-label="gender" name="gender1" value={s.format} onChange={_self.handleChange}>
                            {s.formatList.map(f => <FormControlLabel value={f.format} control={<Radio />} label={f.formatTitle} />)}
                        </RadioGroup>
                    </FormControl>
                  </form>
                  <p></p>
                </DialogContent>
                <DialogActions>
                  <Button onClick={_self.handleClose} color="default" size={p.size} variant={p.variant}>
                    Fortryd
                  </Button>
                  <Button onClick={_self.handleDownload} color="primary" size={p.size} variant={p.variant} disabled={s.format == '' ? true : false}>
                    Download
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          );
    }
};

module.exports = LedningsDownload;