/*
 * @author     René Giovanni Borella
 * @copyright  2020 Geopartner A/S
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';
import { throttle, debounce } from "throttle-debounce";
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';


function uniqBy(a, key) {
    var seen = {};
    return a.filter(function(item) {
        var k = key(item);
        return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    })
}

class DAWASearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchTerm: '',
            searchResults: [],

            resultsPerSource: (props.resultsPerSource === undefined ) ? 3 : parseInt(props.resultsPerSource),
            resultsMax: (props.resultsMax === undefined ) ? 10 : parseInt(props.resultsMax),
            resultsKeepOpen: (props.resultsKeepOpen === undefined ) ? false : props.resultsKeepOpen,
            fuzzy: (props.fuzzy === undefined ) ? true : props.fuzzy,
            srid: (props.srid === undefined ) ? 25832 : parseInt(props.srid),
            nocache: (props.nocache === undefined ) ? false : props.nocache,

            enableAdresse: (props.enableAdresse === undefined ) ? true : props.enableAdresse,
            enableMatrikel: (props.enableMatrikel === undefined ) ? true : props.enableMatrikel,
            enableBFE: (props.enableBFE === undefined ) ? true : props.enableBFE,
            enableSFE: (props.enableSFE === undefined ) ? true : props.enableSFE,

            placeholder: this.buildPlaceholder(),
            triggerAtChar: (props.triggerAtChar === undefined ) ? 0 : parseInt(props.triggerAtChar)

        };
        this.autocompleteSearchDebounced = debounce(1200, this.autocompleteSearch);
        this.autocompleteSearchThrottled = throttle(1200, this.autocompleteSearch);
        this.escFunction = this.escFunction.bind(this);

    }
    componentDidMount(){
        document.addEventListener("keydown", this.escFunction, false);
      }
    componentWillUnmount(){
      document.removeEventListener("keydown", this.escFunction, false);
    }

    escFunction(event){
        if(event.keyCode === 27) {
          this.clear();
        }
      }

    clear(){
        const _self = this;
        _self.setState({ searchResults: [], searchTerm: '' })
    }

    buildPlaceholder() {
        //console.log(this.state);
        return 'Adresse, matr.nr, ESR nr. eller SFE nr.';
    }

    _handleResult = (id) => {
        var s = this.state;
        if (!s.resultsKeepOpen) {
            this.setState({
                searchResults: [],
                searchTerm: ''
            });
        }
        this.props._handleResult(id);
    }

    dynamicSearch = (event) => {

        var _self = this;
        var s = _self.state;
        var term = event.target.value;

        _self.setState({
            searchTerm: term,
            }, () => {
                const q = s.searchTerm;
                if (q.length < s.triggerAtChar) {
                    _self.autocompleteSearchThrottled(s.searchTerm);
                } else {
                    _self.autocompleteSearchDebounced(s.searchTerm);
            }
        });
        
    };

    autocompleteSearch = q => {
        //console.log(`Query: ${q}`)
        this._fetch(q);
    };

    _fetch = (q) => {
        var _self = this;
        var s = _self.state;
        var term = s.searchTerm;
        // run promises here to return stuff from somewhere
        var calls = [];

        // Anything
        if (s.enableAdresse) { calls.push(this.callDawa('adresser',term));}
        if (s.enableMatrikel) { calls.push(this.callDawa('jordstykker',term));}

        // only integers
        if (!isNaN(parseInt(term))) {
            if (s.enableESR) { calls.push(this.callDawa('jordstykker',term, 'udvidet_esrejendomsnr'));}
            if (s.enableBFE) { calls.push(this.callDawa('jordstykker',term, 'bfenummer'));}
            if (s.enableSFE) { calls.push(this.callDawa('jordstykker',term, 'sfeejendomsnr'));}
        }

        this.waitingFor = term;
        //console.log(this.waitingFor)
        
        // Call the stuff
        Promise.all(calls)
            .then( r => {
                var results = r;
                
                // Merge all the things
                try {
                    var all = results.flat(1);
                    var cleaned = [];

                    // Dont bring errors
                    all.forEach(obj => {
                        if (obj.hasOwnProperty('tekst')) {
                            cleaned.push(obj);
                        }
                    });
                    //console.log(cleaned);
                    //Only do something with the term we're expecting
                    //console.log(term)
                    if (term === this.waitingFor){
                        _self.setState({
                            searchTerm: term,
                            searchResults: uniqBy(cleaned, JSON.stringify).slice(0, s.resultsMax)
                        });
                    }
                } catch (e) {
                    _self.setState({
                        error: e.toString()
                    });
                } 
            })
            .catch(err => {
                _self.setState({
                    error: e.toString()
                });
            });
    }

    callDawa = (service, term, specific = undefined) => {
        var s = this.state;
        var hostName = 'https://dawa.aws.dk/'+service+'/autocomplete?';
        var params = {};

        params.per_side = s.resultsPerSource;
        params.side = 1;
        params.srid = s.srid;
        
        if (s.nocache) {
            params.cache='no-cache';
        }

        // Pinpointing
        if (specific) {
            switch(specific) {
                case 'bfenummer':               
                        params.bfenummer = term;
                    break;
                case 'esrejendomsnr':
                        params.udvidet_esrejendomsnr = term;
                    break;
                case 'sfeejendomsnr':
                        params.sfeejendomsnr = term;
                    break;
            }
        } else {
            params.q = term;
        }

        // Get ready to rumble
        //console.log(hostName + new URLSearchParams(params));

        return new Promise(function(resolve, reject) {
            fetch(hostName + new URLSearchParams(params))
                .then(r => r.json())
                .then(d => {
                    resolve(d);
                })
                .catch(e => reject(e));
        });
    };

    render() {
        var _self = this;
        var p = this.props;
        var s = this.state;


        return (
            <div>
                <input id="geosag-input" type='text' value= { s.searchTerm } onChange={ this.dynamicSearch } placeholder={ s.placeholder } />
                {s.searchTerm.length > 0 && 
                <IconButton
                    className="geosag-clear-button"
                    onClick={event => this.clear()}
                    size= {'small'}
                    >
                    <ClearIcon />
                </IconButton>
                }
                
                <ResultsList
                    results= { s.searchResults }
                    _handleResult={ _self._handleResult }
                    q={ s.searchTerm }
                    t={ s.triggerAtChar }
                />
            </div>
        );
    }
};

class ResultsList extends React.Component {
    constructor(props) {
        super(props);
    }

    _handleResult = (id) => {
        this.props._handleResult(id);
    }
    
    render() {
        var _self = this;

        if (this.props.results.length > 0) {
            return (
                <div id="geosag-results">
                    {this.props.results.map(r => <div className="geosag-result" onClick={_self._handleResult.bind(this, r)} key={r.tekst}>{r.tekst}</div>)}
                </div> 
            );
        } else {
            //if (this.props.q.length > 0 && this.props.q.length > this.props.t) {
            //    return <p>Der er ikke fundet noget, prøv igen.</p>
            //}
            return '';
        }
    }
}

module.exports = DAWASearch;