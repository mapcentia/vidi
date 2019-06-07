
import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import LoadingOverlay from './../../../../browser/modules/shared/LoadingOverlay';

/**
 * Interface for applying application configurations
 */
class ConfigSwitcher extends React.Component {
    constructor(props) {
        super(props);

        const gc2host = (vidiConfig.gc2 && vidiConfig.gc2.host ? vidiConfig.gc2.host : false);
        if (!gc2host) throw new Error(`Unable to detect GC2 host to pull configurations from`);

        const appDatabase = (vidiConfig.appDatabase ? vidiConfig.appDatabase : false);
        if (!appDatabase) throw new Error(`Unable to detect database`);

        this.state = {
            configSourceURL: `${gc2host}/api/v2/configuration/${appDatabase}`,
            loading: false,
            configurations: []
        };
    }

    componentDidMount() {
        this.updateConfigurationsList();
    }

    updateConfigurationsList() {
        this.setState({loading: true});
        axios.get(`/api/requestProxy?request=${encodeURIComponent(this.state.configSourceURL)}`).then(response => {
            let configurations = [];
            if (`data` in response.data && Array.isArray(response.data.data)) {
                configurations = response.data.data;
            }

            this.setState({
                loading: false,
                configurations
            });
        }).catch(error => {
            console.error(error);
            this.setState({loading: false});
        });
    }

    applyConfiguration(configuration) {
        let parameters = this.props.urlparser.urlVars;
        parameters.config = configuration;
        let parametersArray = [];
        for (let key in parameters) {
            parametersArray.push(`${key}=${parameters[key]}`);
        }

        let changedUrl = location.origin + location.pathname + `?` + parametersArray.join(`&`) + location.hash;
        document.location.href = changedUrl;
    }

    copyToClipboard (str) {
        const el = document.createElement('textarea');
        el.value = str;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    }

    /**
     *
     * @returns {XML}
     */
    render() {
        let overlay = false;
        if (this.state.loading) {
            overlay = (<LoadingOverlay/>);
        }

        let refreshButton = (<button
            type="button"
            className="btn btn-primary btn-sm"
            style={{margin: `0px`}}
            onClick={this.updateConfigurationsList.bind(this)}>{__(`Refresh`)}</button>);

        let configurationControls = false;
        if (this.state.configurations && this.state.configurations.length > 0) {
            let configurationControlItems = [];
            this.state.configurations.map((item, index) => {
                let parsedValue = JSON.parse(item.value);
                let url = `${this.state.configSourceURL}/${item.key}.json`;
                configurationControlItems.push(<div key={`configuration_${index}`} className="list-group-item">
                    <div style={{display: `flex`}}>
                        <div>{parsedValue.published === false ? (<i className="material-icons" title={__(`Configuration is not published yet`)}>lock</i>) : false}</div>
                        <div style={{flexGrow: `1`}}>{parsedValue.name} {parsedValue.description ? `(${parsedValue.description})` : ``}</div>
                        <div>
                            <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                style={{margin: `0px`}}
                                onClick={() => { this.applyConfiguration(url); }}><i className="material-icons">play_circle_filled</i> {__(`Apply`)}</button>
                        </div>
                    </div>
                    <div>
                        <div className="input-group form-group">
                            <a className="input-group-addon" style={{paddingLeft: `0px`, cursor: `pointer`}} onClick={ () => { this.copyToClipboard(url) }}>{__(`Copy`)}</a>
                            <input className="form-control" type="text" defaultValue={url}/>
                        </div>
                    </div>
                </div>);
            });

            configurationControls = (<div>
                <div style={{display: `flex`}}>
                    <div style={{flexGrow: `1`}}>
                        <p>{__(`Total configurations`)}: {this.state.configurations.length}</p>
                    </div>
                    <div>{refreshButton}</div>
                </div>
                <div>{configurationControlItems}</div>
            </div>);
        } else {
            configurationControls = (<div style={{display: `flex`}}>
                <div style={{flexGrow: `1`}}>
                    <p>{__(`No configurations to display`)}</p>
                </div>
                <div>{refreshButton}</div>
            </div>);
        }

        return (<div>
            {overlay}
            <div>
                <div>{configurationControls}</div>
                <div style={{textAlign: `right`, paddingTop: `10px`}}>{__(`Configurations source`)}: <span style={{fontFamily: `Consolas`}}>{this.state.configSourceURL}</span></div>
            </div>
        </div>);
    }
}

ConfigSwitcher.propTypes = {
    urlparser: PropTypes.object.isRequired,
};

export default ConfigSwitcher;