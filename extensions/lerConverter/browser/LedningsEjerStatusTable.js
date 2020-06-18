/*
 * @author     René Giovanni Borella
 * @copyright  2020 Geopartner A/S
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';


class LedningsEjerStatusTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ejerliste: props.statusliste
        };
    }


    render() {
        if (this.state.ejerliste.length == 0) {
            return (
                <p>Nothing here</p>
            )
        } else {
            return (
                <p>Plenty here!</p>
            )
        }
    }
};

module.exports = LedningsEjerStatusTable;