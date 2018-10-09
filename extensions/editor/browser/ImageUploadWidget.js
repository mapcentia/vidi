import React from 'react';
import Dropzone from 'react-dropzone';


/**
 * Image field widget
 */
class ImageUploadWidget extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loadedImageData: (props.value ? props.value : false)
        };

        this.deleteImage = this.deleteImage.bind(this);
    }

    onDrop(files) {
        let _self = this;
        $.canvasResize(files[0], {
            width: 300,
            height: 0,
            crop: false,
            quality: 80,
            callback: function(data, width, height) {
                _self.setState({
                    loadedImageData: data
                });

                _self.props.onChange(data);
            }
        });
    }

    deleteImage() {
        this.setState({
            loadedImageData: false
        });

        this.props.onChange(undefined);
    }

    render() {
        let control = false;
        if (this.state.loadedImageData) {
            control = (<div>
                <div>
                    <img src={this.state.loadedImageData}/>
                </div>
                <div>
                    <button type="button" className="btn btn-secondary btn-block" onClick={this.deleteImage}>
                        <i className="material-icons">delete</i>
                    </button>
                </div>
            </div>);
        } else {
            control = (<div>
                <Dropzone onDrop={this.onDrop.bind(this)} style={{width: '100%', height: '50px', padding: '5px', border: '1px green dashed'}}>
                    <p>Drop files here, or click to select files to upload</p>
                </Dropzone>
            </div>);
        }

        return (control);
    }
};

module.exports = ImageUploadWidget;