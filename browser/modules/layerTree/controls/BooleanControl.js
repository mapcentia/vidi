/*
 * @author     Alexander Shumilov
 * @copyright  2013-2018 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Boolean control component
 */
class BooleanControl extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div>
            <div style={{ display: 'inline-block' }}>
                <input type="radio" id={this.props.id} name={this.props.id} value="null" checked={this.props.value === `null` || this.props.value === ``}
                    onChange={(event) => { this.props.onChange('null') }}/>{__(`Null`)}
            </div>
            <div style={{ display: 'inline-block', paddingLeft: '20px' }}>
                <input type="radio" id={this.props.id} name={this.props.id} value="true" checked={this.props.value === `true`}
                    onChange={(event) => { this.props.onChange('true') }}/>{__(`Yes`)}
            </div>
            <div style={{ display: 'inline-block', paddingLeft: '20px' }}>
                <input type="radio" id={this.props.id} name={this.props.id} value="false" checked={this.props.value === `false`}
                    onChange={(event) => { this.props.onChange('false') }}/>{__(`No`)}
            </div>
        </div>);
    }
}

BooleanControl.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export { BooleanControl };