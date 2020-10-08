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



var shorter = function(string) {
    let l = 40;
    if (string.length > l){
        return string.slice(0,l-3)+'...'
    } else {
        return string
    }
};


class MatrikelTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            matrListe: props.matrListe
        };

    }

    _handleDelete(id){
        this.props._handleDelete(id);
    }

    _handleFocus(id){
        this.props._handleFocus(id);
    }

    render() {
        var p = this.props;
        var s = this.state;
        var FS = '1rem'
        
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
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={ cellStyle }></TableCell>
                                <TableCell style={ cellStyle }>Matrikel</TableCell>
                                <TableCell style={ cellStyle }>Kommune</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                    {this.props.matrListe.map(matr =>{
                        return (
                        <TableRow key={'geosag-matrikelliste-'+matr.ejerlavskode+matr.kommunenr+matr.matrikelnr}>
                            <TableCell align="left" style={ cellStyle }><button onClick={this._handleDelete.bind(this, matr)}>Fjern</button><button onClick={this._handleFocus.bind(this, matr)}>Vis</button></TableCell>
                            <TableCell align="left" style={ cellStyle }>{matr.matrikelnr+','+shorter(matr.ejerlavsnavn)}</TableCell>
                            <TableCell align="left" style={ cellStyle }>{matr.kommune}</TableCell>
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