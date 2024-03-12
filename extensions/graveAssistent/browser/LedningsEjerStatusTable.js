/*
 * @author     René Giovanni Borella
 * @copyright  2020 Geopartner A/S
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';

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
            return <i className="bi bi-exclamation-triangle-fill" style={{ color: '#808080'}}></i>;
        case 'Ledningsoplysninger udleveret':
            return <i className="bi bi-check-circle-fill" style={{ color: '#7FFF00'}}></i>;
        case 'Ingen ledninger i graveområde':
            return <i className="bi bi-check-circle-fill" style={{ color: '#808080'}}></i>;
        case 'Ikke leveret':
            return <i className="bi bi-x-circle-fill" style={{ color: '#ff3700'}}></i>;
        default:
            return <i className="bi bi-exclamation-triangle-fill" style={{ color: '#FFA500'}}></i>;
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
        //let orderedArr = this.showStatusList(this.state.ejerListe)

        if (this.props.statusliste.map.length == 0) {
            return (
                <p>Indlæser</p>
            )
        } else {
            return (
                    <div>
                    <table className="table" style={{ width: "auto", tableLayout: "auto" }}>
                        <thead>
                        <tr>
                            <th className="text-center fs-6">Status</th>
                            <th className="text-center fs-6">Område</th>
                            <th className="text-center fs-6">Status</th>
                            <th className="text-center fs-6">Ejer</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.props.statusliste.map(ejer => (
                            <tr key={'graveAssistent-feature-ledningsejerliste-status-' + ejer.CVR + ejer.indberetningsnr}>
                            <td className="text-center fs-6">{statusIcon(ejer.status)}</td>
                            <td className="text-end fs-6" >{ejer.indberetningsnr}</td>
                            <td className="text-start fs-6">{ejer.status}</td>
                            <td className="text-start fs-6">{shorter(ejer.navn)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
            );
        }
    }
};

module.exports = LedningsEjerStatusTable;