var React = require('react');

/**
 * MapAreaListItem component
 */

class MapAreaListItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let overlayStyle = {
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            zIndex: '1000'
        };

        let overlayContentStyle = {
            top: '40px',
            textAlign: 'center',
            position: 'relative',
            padding: '40px'
        };

        let content = false;
        if (this.props.tilesLoaded === this.props.tilesLeftToLoad) {
            content = (<div>
                <h4><i className="material-icons" style={{color: 'green'}}>&#xE5CA;</i> {__("Done")}</h4>
                {this.props.children}
            </div>);
        } else {
            content = (<div>
                <h4>{__("Processing tiles")} ({this.props.tilesLoaded} {__("of")} {this.props.tilesLeftToLoad})</h4>
                <div className="progress">
                    <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: ((this.props.tilesLoaded / this.props.tilesLeftToLoad * 100) + '%')}}></div>
                </div>
            </div>);
        }

        return (<div style={overlayStyle}>
            <div style={overlayContentStyle}>{content}</div>
        </div>);
    }
}

module.exports = MapAreaListItem;