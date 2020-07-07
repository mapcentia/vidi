/*
 * @author     René Giovanni Borella
 * @copyright  2020 Geopartner A/S
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';


var statusline = function (omr, status) {
    //console.log(omr)
    //console.log(status)
    return (<p>{status}</p>)
}

class LedningsProgress extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ejerliste: props.statusliste
        };
    }
    render() {
        const p = this.props
        console.log(p)

        const flexContainer = {
            height: '100%',
            padding: '0',
            margin: '0',
            display: '-webkit-box',
            display: '-moz-box',
            display: '-ms-flexbox',
            display: '-webkit-flex',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }
        const row = {
            width: '60%',
            marginTop: '10%'
            //border: '1px solid blue'
        }
        const flexItem = {
            padding: '5px',
            //height: '40px',
            margin: '20px 0px 20px 0px',
            lineHeight: '20px',
            //fontWeight: 'bold',
            fontSize: '1.8em',
            textAlign: 'center'
        }

        return (
            <div style={flexContainer}>
                <div style={row}>
                    <div style={flexItem}><CircularProgress variant="static" value={p.progress}/></div>
                    <div style={flexItem}>{p.text}</div>
                </div>
            </div>
        );
    }
};

module.exports = LedningsProgress;