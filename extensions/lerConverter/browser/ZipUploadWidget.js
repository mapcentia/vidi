/*
 * @author     René Giovanni Borella
 * @copyright  2020 Geopartner A/S
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

import React from 'react';
import Dropzone from 'react-dropzone';
import JSZip from 'jszip';

console.log('ZipUploadWidget loaded!');

/**
 * Parses xml to JSON
 * @param {*} xmlData 
 */
var parsetoJSON = function(xmlData){
    var parser = require('fast-xml-parser');
    var options = {
        attributeNamePrefix : "@_",
        attrNodeName: "attr", //default is 'false'
        textNodeName : "#text",
        ignoreAttributes : true,
        ignoreNameSpace : false,
        allowBooleanAttributes : false,
        parseNodeValue : true,
        parseAttributeValue : false,
        trimValues: true,
        cdataTagName: "__cdata", //default is 'false'
        cdataPositionChar: "\\c",
        parseTrueNumberOnly: false,
        arrayMode: false, //"strict"
        stopNodes: ["parse-me-as-string"]
    };

    if( parser.validate(xmlData) === true) { //optional (it'll return an object in case it's not valid)
        var jsonObj = parser.parse(xmlData,options);
        console.log(jsonObj)
    }

    // Intermediate obj
    var tObj = parser.getTraversalObj(xmlData,options);
    console.log(tObj)
    var jsonObj = parser.convertToJson(tObj,options);
    console.log(jsonObj)
}

/**
 * Shows LedningsejerStatusListe 
 * @param {*} zipblob 
 */
var handleLedningsejerStatus = function(xmlstring) {
    console.log(xmlstring)
}

/**
 * Reads contents of blob to determine files to parse
 * @param {*} zipblob 
 */
var readContents = function(zipblob) {
    var newZip = new JSZip();
    newZip.loadAsync(zipblob).then(function (zip) {
        Object.keys(zip.files).forEach(function (filename) {
          //console.log(filename)

          ///* Handle graveforespoergsel */
          //if (filename.indexOf('Graveforespoergsel') != -1){
          //  zip.files[filename].async('string').then(fileData => {handleLedningsejerStatus(fileData)})
          //}
          ///* Handle Ledninger */
          //if (filename == 'consolidated.gml'){
          //  zip.files[filename].async('string').then(fileData => {handleLedningsejerStatus(fileData)})
          //}

          /* Show Status */
          if (filename == 'LedningsejerStatusListe.xml'){
            zip.files[filename].async('string').then(fileData => {parsetoJSON(fileData)})
          }
      })
    })
}


class ZipUploadWidget extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loadedPackage: (props.value ? props.value : false),
            packageStatusText: '',
            packageStatusProgress:'',
            isError: (props.value ? props.value : false),
            isErrorMessage: ''
        };
    }

    /**
     * Sets error and message
     * @param {*} files 
     */
    setError(message) {
        this.setState({isError: true, isErrorMessage: message})
    }
    setStatus(message, increment) {
        this.setState({packageStatusText: message, packageStatusProgress: increment})
    }

    /**
     * Reads the uploaded .zip-file into a blob
     * @param {*} files 
     */
    onDrop(files) {
        let _self = this;
        //TODO: screen input
        readContents(files[0])
    }

    resetBox() {
        this.setState({
            loadedPackage: false,
            isError: false
        });

        this.props.onChange(undefined);
    }

    render() {
        let control = false;
        if (this.state.isError) {
            control = (
                <div>
                    <p>Shit failed, yo!</p>
                    <p>{this.state.isErrorMessage}</p>
                </div>
            )
        }
        else if (this.state.loadedPackage) {
            control = (
            <div>
                <div>
                    <p>There is stuff - status is: {this.state.packageStatusText}</p>
                </div>
                <div>
                    <button type="button" className="btn btn-secondary btn-block" onClick={this.resetBox}>
                        <p>reset form</p>
                    </button>
                </div>
            </div>
            );
        } else {
            control = (
            <div>
                <Dropzone
                onDrop={this.onDrop.bind(this)}
                style={{
                    width: '100%', height: '50px', padding: '5px', border: '1px green dashed'
                }}
                >
                <p>Drop it dawg</p>
                </Dropzone>
            </div>
            );
        }

        return (control);
    }
};

module.exports = ZipUploadWidget;