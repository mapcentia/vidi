// Copyright (c) 2018 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, {Component} from 'react';
import styled from 'styled-components';
import window from 'global/window';
import {connect} from 'react-redux';
import Banner from './components/banner';
import Announcement from './components/announcement';

import {loadSampleConfigurations} from './actions';
import {replaceLoadDataModal} from './factories/load-data-modal';

const KeplerGl = require('kepler.gl/components').injectComponents([
  replaceLoadDataModal()
]);

const MAPBOX_TOKEN = `pk.eyJ1IjoiYWxla3NhbmRyc2h1bWlsb3YiLCJhIjoiY2praHZveHRjMHluMjNxczZ5aThyN2NnaSJ9.lvfZlFn0VMXItgZ4FFEEfg`;
const uuidv4 = require('uuid/v4');

// Sample data
/* eslint-disable no-unused-vars */
import sampleIconCsv, {config as savedMapConfig} from './data/sample-icon-csv';
import {updateVisData, addDataToMap} from 'kepler.gl/actions';
import Processors from 'kepler.gl/processors';
/* eslint-enable no-unused-vars */

const GlobalStyleDiv = styled.div`
  font-family: ff-clan-web-pro, 'Helvetica Neue', Helvetica, sans-serif;
  font-weight: 400;
  font-size: 0.875em;
  line-height: 1.71429;

  *,
  *:before,
  *:after {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
`;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
        width: props.width,
        height: props.height,
        data: props.data
    };
  }

  componentWillMount() {
    // if we pass an id as part of the url
    // we try to fetch along map configurations
    const {params: {id: sampleMapId} = {}} = this.props;

    this.props.dispatch(loadSampleConfigurations(sampleMapId));
    window.addEventListener('resize', this._onResize);
    this._onResize();
  }

  componentDidMount() {
    this._loadData();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._onResize);
  }

  _onResize = () => {
    console.warn(`KeplerGL wrapper: resize case is not covered yet`);
  };

    _loadData() {
        this.state.data.map(data => {
            /*
                Because of the https://github.com/uber/kepler.gl/issues/177 bug point layers
                should be converted to CSV in order to be displayed as point layer (not polygons)
            */

            let processedData = false;
            if (data.meta.type === `POINT`) {
                let csvData = ``;

                let columns = [];
                data.layer.geoJSON.forGrid.map(item => {
                    columns.push(item.header);
                });

                columns = columns.join(`,`);

                let rowValuesAggregate = [];
                data.layer.geoJSON.features.map(feature => {
                    let rowValues = [];
                    data.layer.geoJSON.forGrid.map(fieldName => {
                        let value = feature.properties[fieldName.header];
                        if (value === undefined || value === null) {
                            rowValues.push(``);
                        } else {
                            value = `` + value;
                            rowValues.push(value.replace(`,`, ``));
                        }
                    });

                    rowValuesAggregate.push(rowValues.join(`,`));
                });

                rowValuesAggregate = rowValuesAggregate.join(`\n`);
                csvData = columns + '\n' + rowValuesAggregate;

                processedData = Processors.processCsvData(csvData);
            } else {
                processedData = Processors.processGeojson(data.layer.geoJSON);
            }

            this.props.dispatch(
                updateVisData({
                    info: {
                        id: uuidv4(),
                        label: data.layer.name.replace('.', ' ')
                    },
                    data: processedData
                }, {
                    centerMap: true,
                    readOnly: false
                })
            );
        });
    }

  render() {
    const {width, height} = this.state;
    return (
      <GlobalStyleDiv>
        <div
          style={{
            transition: 'margin 1s, height 1s',
            position: 'absolute',
            width: '100%',
            height: '100%',
            minHeight: `100%`,
            marginTop: 0
          }}
        >
          <KeplerGl
            mapboxApiAccessToken={MAPBOX_TOKEN}
            id="map"
            /*
             * Specify path to keplerGl state, because it is not mount at the root
             */
            getState={state => state.demo.keplerGl}
            width={width}
            height={height}
          />

        </div>
      </GlobalStyleDiv>
    );
  }
}

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(
  mapStateToProps,
  dispatchToProps
)(App);
