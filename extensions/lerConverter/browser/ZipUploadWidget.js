/*
 * @author     René Giovanni Borella
 * @copyright  2020 Geopartner A/S
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';
import Dropzone from 'react-dropzone';

/**
 * Image field widget
 */

 console.log('ZipUploadWidget loaded!');

class ZipUploadWidget extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loadedPackage: (props.value ? props.value : false),
            packageStatusText: '',
            packageStatusProgress:''
        };
    }

    onDrop(files) {
        let _self = this;
        console.log(files[0])

        /* Let user know we got it */
        this.setState({packageStatus: 'Reading!', packageStatusProgress: 10})
    }

    resetBox() {
        this.setState({
            loadedPackage: false
        });

        this.props.onChange(undefined);
    }

    render() {
        let control = false;
        if (this.state.loadedPackage) {
            control = (<div>
                <div>
                    <p>There is stuff - status is: {this.state.packageStatus}</p>
                </div>
                <div>
                    <button type="button" className="btn btn-secondary btn-block" onClick={this.resetBox}>
                        <p>reset form</p>
                    </button>
                </div>
            </div>);
        } else {
            control = (<div>
                <Dropzone onDrop={this.onDrop.bind(this)} style={{width: '100%', height: '50px', padding: '5px', border: '1px green dashed'}}>
                    <p>Drop it like it's hot!</p>
                </Dropzone>
            </div>);
        }

        return (control);
    }
};

module.exports = ZipUploadWidget;