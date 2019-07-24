var React = require('react');

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
     * @returns {XML}
     */
    render() {
        return (<div style={{
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