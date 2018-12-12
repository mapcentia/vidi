/*
 * @author     Alexander Shumilov
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';
import PropTypes from 'prop-types';

class LoadStrategyToggle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleChange(event, filterName) {}

    render() {
        return (<div><h1>TOGGLE</h1></div>)
    }
}

LoadStrategyToggle.propTypes = {
    initialValue: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default LoadStrategyToggle;