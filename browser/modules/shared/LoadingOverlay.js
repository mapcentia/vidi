/*
 * @author     Alexander Shumilov
 * @copyright  2013-2023 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

const React = require('react');

/**
 * Loading overlay
 */
class LoadingOverlay extends React.Component {
    constructor(props) {
        super(props);
    }

    /**
     * Renders the component
     * 
     * @returns {JSX.Element}
     */
    render() {
        return (<div className="loading-overlay w-100 h-100 opacity-75 position-absolute" style={{
            backgroundColor: 'white',
            zIndex:  '1000',
            textAlign: `center`
        }}>
            <div style={{width: `150px`, display: `inline-block`}}>
                <div>{__(`Loading data`)}</div>
                <div className="progress">
                    <div className="progress-bar progress-bar-striped progress-bar-animated w-100"></div>
                </div>
            </div>
        </div>);
    }
}

export default LoadingOverlay;
