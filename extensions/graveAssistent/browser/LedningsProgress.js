/*
 * @author     René Giovanni Borella
 * @copyright  2020 Geopartner A/S
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';

class LedningsProgress extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ejerliste: props.statusliste,
        };
    }

    getVariant(progress) {
        return progress < 100 ? 'progress-bar-striped progress-bar-animated' : '';
    }

    getProgressColor(isError) {
        return isError ? 'bg-danger' : 'bg-primary';
    }

    render() {
        const p = this.props;

        return (
            <div className="d-flex align-items-center justify-content-center" style={{ height: '100%' }}>
                <div className="w-60 mt-10">
                    <div className="d-flex flex-column align-items-center justify-content-center mb-2">
                        <div className="progress" style={{ width: '100%', height: '40px' }}>
                            <div className={`progress-bar ${this.getVariant(p.progress)} ${this.getProgressColor(p.isError)}`} role="progressbar" style={{ width: `${p.progress}%` }} aria-valuenow={p.progress} aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div>{p.text}</div>
                        {p.errorList.map((f, index) => (
                            <div key={index} className="text-center" style={{ fontSize: '10pt' }}>{f.message}</div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
};

export default LedningsProgress;