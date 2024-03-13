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
        // Add check for undefined or null progress to apply indeterminate style
        return progress === undefined || progress === null || progress < 100 ? 'progress-bar-striped progress-bar-animated' : '';
    }

    getProgressColor(isError) {
        return isError ? 'bg-danger' : 'bg-primary';
    }

    render() {
        const p = this.props;
        const hasProgress = p.progress !== undefined && p.progress !== null;

        return (
            <div className="d-flex align-items-center justify-content-center" style={{ height: '100%' }}>
                <div className="w-80 m-6 p-6">
                    <div className="d-flex flex-column align-items-center justify-content-center mb-2">
                        <div className="progress">
                            <div className={`progress-bar ${this.getVariant(p.progress)} ${this.getProgressColor(p.isError)}`} role="progressbar"  
                                aria-valuenow={hasProgress ? p.progress : undefined} 
                                aria-valuemin="0" 
                                aria-valuemax="100">
                            </div>
                        </div>
                        <div>{p.text}</div>
                        {p.errorList.map((f, index) => (
                            <div key={index} className="text-center"><p>{f.message}</p></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
};

export default LedningsProgress;