/*
 * @author     René Giovanni Borella
 * @copyright  2020 Geopartner A/S
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import WarningIcon from '@material-ui/icons/Warning';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import PageviewIcon from '@material-ui/icons/Pageview';
import Grid from '@material-ui/core/Grid';



class MatrikelTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            matrListe: props.matrListe,
            shorterLength: (props.shorterLength === undefined ) ? 40 : parseInt(props.shorterLength)
        };

    }

    shorter(text) {
        var l = this.state.shorterLength;
        if (text.length > l){
            return text.slice(0,l-3)+'...';
        } else {
            return text;
        }
    };
    

    _handleDelete(id){
        this.props._handleDelete(id);
    }

    _handleFocus(id){
        this.props._handleFocus(id);
    }

    render() {
        var p = this.props;
        var s = this.state;
        var FS = '1.2rem'
        
        var cellStyle = {
            fontSize: FS
        }

        if (this.props.matrListe.map.length == 0) {
            return (
                <p>Der er ikke tilknyttet nogen matrikler endnu.</p>
            )
        } else {
            return (
                <div>
                    <Table size="small">
                        <colgroup>
                           <col style={{width:'10%'}}/>
                           <col style={{width:'80%'}}/>
                        </colgroup>
                        <TableHead>
                            <TableRow>
                                <TableCell style={ cellStyle }></TableCell>
                                <TableCell style={ cellStyle }>Matrikel</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                    {this.props.matrListe.map(matr =>{
                        //console.log(matr);
                        return (
                        <TableRow key={'geosag-matrikelliste-'+matr.ejerlavskode+matr.kommunenr+matr.matrikelnr}>
                            <TableCell align="left" style={ cellStyle }>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <Grid><Tooltip title={'Vis matrikel i kortet'}><IconButton size={'small'} onClick={this._handleFocus.bind(this, matr)} disabled={!matr.hasGeometry}><PageviewIcon /></IconButton></Tooltip></Grid>
                                <Grid><Tooltip title={'Fjern matrikel fra listen.'}><IconButton size={'small'} onClick={this._handleDelete.bind(this, matr)}><DeleteIcon /></IconButton></Tooltip></Grid>
                            </div>
                            </TableCell>
                            <TableCell align="left" style={ cellStyle }>{matr.matrikelnr+', '+this.shorter(matr.ejerlavsnavn)}</TableCell>
                        </TableRow>)
                    })}
                        </TableBody>
                    </Table>
                </div>
            );
        }
    }
};

module.exports = MatrikelTable;