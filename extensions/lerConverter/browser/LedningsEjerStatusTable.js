/*
 * @author     René Giovanni Borella
 * @copyright  2020 Geopartner A/S
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import NotInterestedIcon from '@material-ui/icons/NotInterested';


const Root = {

}
const StatusIcon = {

}
const OK = {

}

var printOmr = function (omr) {
    console.log(omr)

    
    if (Array.isArray(omr)) {
        /* If we got array: */
        return omr.map(o => (
            statusline(o.IndberetningsNr, o.Status)
        ))
    } else {
        /* else run once*/
        return statusline(omr.IndberetningsNr, omr.Status)
    }
}

var statusline = function (omr, status) {
    return (<p>{status}</p>)
}

class LedningsEjerStatusTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ejerliste: props.statusliste
        };
    }
    render() {
        if (this.props.statusliste.length == 0) {
            return (
                <p>Nothing loaded - hide this</p>
            )
        } else {
            return (
                <div>
                    {this.props.statusliste.map(ejer =>(
                        <div key={'lerConverter-feature-ledningsejerliste-status-'+ejer.CVR}>
                            <div>
                                <div>{ejer.Navn}</div>
                                <div>{ejer.CVR}</div>
                                {printOmr(ejer.Interesseområde)}
                            </div>
                        </div>
                    ))}
                </div>
            );
        }
    }
};

module.exports = LedningsEjerStatusTable;