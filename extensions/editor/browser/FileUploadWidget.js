/*
 * @author     Alexander Shumilov
 * @copyright  2013-2026 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';
import Dropzone from 'react-dropzone';

import {MIME_TYPES_APPS, MIME_TYPES_IMAGES} from '../../../browser/modules/constants';
import config from "../../../config/config";

const MAX_WIDTH = 2400;
const MAX_HEIGHT = 1800;
const MAX_SIZE = 30_000_000;
const doNotScaleImages = config?.extensionConfig?.editor?.doNotScaleImages ?? false;

/**
 * Pull "image/jpeg" out of "data:image/jpeg;base64,..." without splitting the
 * whole base64 payload (which would allocate a large string copy).
 */
function extractContentType(dataUrl) {
    if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) return null;
    const semi = dataUrl.indexOf(';');
    return semi > 5 ? dataUrl.substring(5, semi) : null;
}

/**
 * Decode a data URL to a Blob synchronously so the widget can render the image
 * on first paint without a Loading flash. The base64 string itself is not
 * retained — only the resulting Blob + a short blob: URL.
 */
function dataUrlToBlob(dataUrl) {
    const semi = dataUrl.indexOf(';');
    if (semi < 5) return null;
    const contentType = dataUrl.substring(5, semi);
    const comma = dataUrl.indexOf(',', semi);
    if (comma < 0) return null;
    try {
        const binary = atob(dataUrl.substring(comma + 1));
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        return new Blob([bytes], {type: contentType});
    } catch (e) {
        console.warn('FileUploadWidget: failed to decode data URL', e);
        return null;
    }
}

function isHttpUrl(str) {
    return typeof str === 'string' && !str.startsWith('data:') &&
        (str.startsWith('http://') || str.startsWith('https://'));
}

function cleanQuotes(value) {
    return value && value.includes('"') ? value.replaceAll('"', '') : value;
}

class FileUploadWidget extends React.Component {
    constructor(props) {
        super(props);

        const initial = this.buildDisplayState(props.value);
        this.state = {
            displayUrl: initial.displayUrl,
            contentType: initial.contentType,
            isHttpPending: initial.isHttpPending
        };

        this.deleteFile = this.deleteFile.bind(this);
    }

    /**
     * Decide what to render for a given form value. data:-URLs are converted
     * synchronously to a blob URL; HTTP URLs are flagged for async fetch.
     */
    buildDisplayState(rawValue) {
        if (!rawValue) {
            return {displayUrl: null, contentType: null, isHttpPending: false};
        }
        const value = cleanQuotes(rawValue);
        if (value.startsWith('data:')) {
            const blob = dataUrlToBlob(value);
            if (blob) {
                return {
                    displayUrl: URL.createObjectURL(blob),
                    contentType: blob.type || extractContentType(value),
                    isHttpPending: false
                };
            }
            return {displayUrl: null, contentType: null, isHttpPending: false};
        }
        if (isHttpUrl(value)) {
            return {displayUrl: null, contentType: null, isHttpPending: true};
        }
        return {displayUrl: null, contentType: null, isHttpPending: false};
    }

    componentDidMount() {
        if (this.state.isHttpPending) {
            this.fetchHttpUrl(cleanQuotes(this.props.value));
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.value === this.props.value) return;

        const previousDisplayUrl = this.state.displayUrl;
        const next = this.buildDisplayState(this.props.value);
        this.setState(next, () => {
            // Revoke the old blob URL only after the new one has rendered, so
            // the browser never holds a reference to a revoked URL.
            if (typeof previousDisplayUrl === 'string'
                && previousDisplayUrl.startsWith('blob:')
                && previousDisplayUrl !== this.state.displayUrl) {
                URL.revokeObjectURL(previousDisplayUrl);
            }
            if (next.isHttpPending) {
                this.fetchHttpUrl(cleanQuotes(this.props.value));
            }
        });
    }

    componentWillUnmount() {
        const url = this.state.displayUrl;
        if (typeof url === 'string' && url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
        }
    }

    setSaveButtonPending(pending) {
        const btn = document.querySelector('.editor-save-btn');
        const label = document.querySelector('.editor-save-btn-label');
        const loading = document.querySelector('.editor-save-btn-loading');
        if (!btn || !label || !loading) return;
        btn.disabled = pending;
        label.classList.toggle('d-none', pending);
        loading.classList.toggle('d-none', !pending);
    }

    fetchHttpUrl(url) {
        if (this._convertingUrl === url) return;
        this._convertingUrl = url;
        this.setSaveButtonPending(true);
        const cleanUrl = url.split('?')[0];

        fetch(cleanUrl)
            .then(res => {
                if (res.status === 404) {
                    this.props.onChange(undefined);
                    throw new Error('404 Not Found');
                }
                if (!res.ok) throw new Error('Network response was not ok');
                return res.blob();
            })
            .then(blob => {
                // Show the image immediately via blob URL while we async-convert
                // to base64 for the form state.
                const blobUrl = URL.createObjectURL(blob);
                this.setState({
                    displayUrl: blobUrl,
                    contentType: blob.type,
                    isHttpPending: false
                });
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            })
            .then(dataUrl => {
                this.props.onChange(dataUrl);
            })
            .catch(e => {
                console.warn(e && e.message ? e.message : e);
            })
            .finally(() => {
                this._convertingUrl = null;
                this.setSaveButtonPending(false);
            });
    }

    onDrop(files) {
        const file = files[0];
        if (!file) return;
        if (file.size > MAX_SIZE) {
            alert(__("File is too big! Maximum size is") + " " + (MAX_SIZE / 1000000) + " " + __("MB"));
            return;
        }
        if (MIME_TYPES_IMAGES.includes(file.type)) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    let width = img.width;
                    let height = img.height;
                    if (!doNotScaleImages) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    const data = canvas.toDataURL(file.type);
                    this.props.onChange(data);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.props.onChange(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }

    deleteFile() {
        this.props.onChange(undefined);
    }


    render() {
        const {displayUrl, contentType, isHttpPending} = this.state;

        if (displayUrl) {
            let el;
            if (MIME_TYPES_IMAGES.includes(contentType)) {
                el = (<img src={displayUrl} alt=''/>);
            } else if (MIME_TYPES_APPS.includes(contentType)) {
                el = (<embed
                    src={displayUrl}
                    type={contentType}
                    width="100%"
                    height="600px"
                />);
            } else {
                el = (
                    <div>
                        <div className="alert alert-warning" role="alert">
                            <i className="bi bi-exclamation-triangle-fill"></i> {__("The file type can't be shown but you can download it")} : <a download href={displayUrl}>{contentType}</a>
                        </div>
                    </div>
                );
            }
            return (
                <div>
                    <div className="mb-3">{el}</div>
                    <div>
                        <button type="button" className="btn btn-outline-danger btn-block" onClick={this.deleteFile}>
                            <i className="bi bi-slash-circle"></i>
                        </button>
                    </div>
                </div>
            );
        }

        if (isHttpPending) {
            return (
                <div className="mb-3 text-muted small">
                    <i className="spinner-border spinner-border-sm me-1"></i>{__("Loading")}
                </div>
            );
        }

        return (
            <div>
                <Dropzone onDrop={this.onDrop.bind(this)}
                          style={{width: '100%', height: '50px', padding: '5px', border: '1px green dashed'}}>
                    <p>{__("Drop file here, or click to select file to upload")}</p>
                </Dropzone>
            </div>
        );
    }
}

module.exports = FileUploadWidget;
