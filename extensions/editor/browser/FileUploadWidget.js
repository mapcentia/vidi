/*
 * @author     Alexander Shumilov
 * @copyright  2013-2023 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';
import Dropzone from 'react-dropzone';

import {MIME_TYPES_APPS, MIME_TYPES_IMAGES} from '../../../browser/modules/constants';
import {splitBase64} from '../../../browser/modules/utils';

const MAX_WIDTH = 1024;
const MAX_HEIGHT = 768;
const MAX_SIZE = 5000000;




/**
 * Image field widget
 */
class FileUploadWidget extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loadedImageData: (props.value ? props.value : false)
        };

        this.deleteFile = this.deleteFile.bind(this);
    }

    onDrop(files) {
        let _self = this;
        const file = files[0];
        console.log("Dropping", file.type)
        if (file && file.size > MAX_SIZE) {
            alert(__("File is too big! Maximum size is") + " " + (MAX_SIZE / 1000000) + " " + __("MB"));
            return;
        }
        if (file && MIME_TYPES_IMAGES.includes(file.type)) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = function () {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    let width = img.width;
                    let height = img.height;
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT
                    }
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    const data = canvas.toDataURL(file.type);
                    _self.setState({
                        loadedImageData: data
                    });
                    _self.props.onChange(data);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                _self.setState({
                    loadedImageData: data
                });
                _self.props.onChange(data);
            };
            reader.readAsDataURL(file);
        }
    }

    deleteFile() {
        this.setState({
            loadedImageData: false
        });
        this.props.onChange(undefined);
    }


    render() {
        let control = false;
        if (this.state.loadedImageData) {
            const type = splitBase64(this.state.loadedImageData).contentType;
            console.log("Viewing", type);
            let el;
            if (MIME_TYPES_IMAGES.includes(type)) {
                el = (<img src={this.state.loadedImageData} alt=''/>);
            } else if (MIME_TYPES_APPS.includes(type)) {
                el = (<embed
                    src={this.state.loadedImageData}
                    type={type}
                    width="100%"
                    height="600px"
                />);
            } else {
                el = (
                    <div>
                        <div className="alert alert-warning" role="alert">
                            <i className="bi bi-exclamation-triangle-fill"></i> {__("The file type can't be shown but you can download it") + ": " + type}
                        </div>
                        <a download href={this.state.loadedImageData}>{__("Download the file")}</a>
                    </div>
                )
            }
            control = (<div>
                <div className="mb-3">{el}</div>
                <div>
                    <button type="button" className="btn btn-outline-danger btn-block" onClick={this.deleteFile}>
                        <i className="bi bi-slash-circle"></i>
                    </button>
                </div>
            </div>);
        } else {
            control = (<div>
                <Dropzone onDrop={this.onDrop.bind(this)}
                          style={{width: '100%', height: '50px', padding: '5px', border: '1px green dashed'}}>
                    <p>{__("Drop file here, or click to select file to upload")}</p>
                </Dropzone>
            </div>);
        }

        return (control);
    }
}

module.exports = FileUploadWidget;
