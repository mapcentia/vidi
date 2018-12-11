/*
 * @author     Alexander Shumilov
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';
import PropTypes from 'prop-types';

class TileLayerFilter extends React.Component {
    constructor(props) {
        super(props);

        let filters = [];
        for (let key in props.filters) {
            let splitFilter = props.filters[key].split(`=`);
            if (splitFilter.length === 2) {
                filters.push({
                    name: key,
                    value: props.filters[key]
                });
            } else {
                console.warn(`Invalid filter was provided for ${props.layerKey}: ${props.filters[key]}`);
            }
        }

        let disabledFilters = [];
        if (Array.isArray(props.disabledFilters) && props.disabledFilters.length > 0) {
            props.disabledFilters.map(item => {
                let filterExists = false;
                filters.map(filter => {
                    if (filter.name === item) {
                        filterExists = true;
                    }
                });

                if (filterExists) {
                    disabledFilters.push(item);
                } else {
                    console.warn(`Unrecognized filter ${item} for ${props.layerKey}`);
                }
            });
        }

        if (filters.length === 0) {
            throw new Error(`No tile filters provided for ${props.layerKey}`);
        }

        this.state = {
            filters,
            disabledFilters
        };
    }

    handleChange(event, filterName) {
        let disabledFilters = this.state.disabledFilters;
        if (event.target.checked && disabledFilters.indexOf(filterName) > -1) {
            disabledFilters.splice(disabledFilters.indexOf(filterName), 1);
        } else {
            disabledFilters.push(filterName);
        }

        this.setState({ disabledFilters });
        this.props.onApply({
            layerKey: this.props.layerKey,
            filters: disabledFilters
        });
    }

    render() {
        let filterControls = [];
        this.state.filters.map((item, index) => {
            let filterIsActive = (this.state.disabledFilters.indexOf(item.name) === -1);
            filterControls.push(<div key={ `tile_filter_` + index }>
                <div style={{ display: `inline-block` }}>
                    <div className="checkbox">
                        <label>
                            <input
                                checked={filterIsActive}
                                onChange={(event) => { this.handleChange(event, item.name) }}
                                type="checkbox"
                                name={`tile_filter_` + this.props.layerKey}/>
                        </label>
                    </div>
                </div>
                <div style={{ display: `inline-block` }}>
                    <span>{item.name} ({item.value})</span>
                </div>
            </div>);
        });

        return (<div>{filterControls}</div>)
    }
}

TileLayerFilter.propTypes = {
    layerKey: PropTypes.string.isRequired,
    filters: PropTypes.object.isRequired,
    disabledFilters: PropTypes.array,
    onApply: PropTypes.func.isRequired,
};

export default TileLayerFilter;