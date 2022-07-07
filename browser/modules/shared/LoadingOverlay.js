/*
 * @author     Alexander Shumilov
 * @copyright  2013-2022 MapCentia ApS
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
        return (<div className="loading-overlay" style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            opacity: '0.8',
            zIndex:  '1000',
            textAlign: `center`
        }}>
            <div style={{width: `150px`, display: `inline-block`}}>
                <div>{__(`Loading data`)}</div>
                <div className="progress progress-striped active">
                    <div className="progress-bar" style={{width: `100%`}}></div>
                </div>
            </div>
        </div>);
    }
}

export default LoadingOverlay;
