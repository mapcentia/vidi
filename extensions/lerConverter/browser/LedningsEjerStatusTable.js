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


const getUnique = function(arr) {
    let a = []
    arr.forEach(f => {
        a.push(f.cvr)
    })

    return [...new Set(a)]
}

const getByCvr = function(arr, cvrNo) {
    return arr.filter(obj => {
        return obj.cvr === cvrNo
    })
}

const shorter = function(string) {
    let l = 40;
    if (string.length > l){
        return string.slice(0,l-3)+'...'
    } else {
        return string
    }
}

const statusIcon = function(statusText) {
    switch(statusText) {
        case 'Sendes via mail udenom LER':
            return <WarningIcon style={{ color: '#808080'}}/>
        case 'Ledningsoplysninger udleveret':
            return  <CheckCircleIcon style={{ color: '#7FFF00'}} />
        default:
            return <WarningIcon style={{ color: '#FFA500'}}/>
    }
}

class LedningsEjerStatusTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ejerListe: props.statusliste
        };

    }

    showStatusList(arr) {
        let l = arr
        let uniqCVR = getUnique(l)

        // Handle each by CVR
        uniqCVR.forEach(cvr => {
            let omr = getByCvr(l, cvr)
            //console.log(omr)

        })
    }

    render() {
        const p = this.props
        const s = this.state
        const FS = '1rem'
        //let orderedArr = this.showStatusList(this.state.ejerListe)

        if (this.props.statusliste.map.length == 0) {
            return (
                <p>Indlæser</p>
            )
        } else {
            return (
                <div>
                    <Table>
                        <TableHead>
                            <TableCell style={{ fontSize: FS }}>Status</TableCell>
                            <TableCell style={{ fontSize: FS }}>Område</TableCell>
                            <TableCell style={{ fontSize: FS }}>Status</TableCell>
                            <TableCell style={{ fontSize: FS }}>Ejer</TableCell>
                        </TableHead>
                        <TableBody>
                    {this.props.statusliste.map(ejer =>{ 
                        return (
                        <TableRow key={'lerConverter-feature-ledningsejerliste-status-'+ejer.CVR+ejer.indberetningsnr}>
                            <TableCell align="center" style={{ fontSize: FS }}>{statusIcon(ejer.status)}</TableCell>
                            <TableCell align="right" style={{ fontSize: FS }}>{ejer.indberetningsnr}</TableCell>
                            <TableCell align="left" style={{ fontSize: FS }}>{ejer.status}</TableCell>
                            <TableCell align="left" style={{ fontSize: FS }} >{shorter(ejer.navn)}</TableCell>
                        </TableRow>)
                    })}
                        </TableBody>
                    </Table>
                </div>
            );
        }
    }
};

module.exports = LedningsEjerStatusTable;