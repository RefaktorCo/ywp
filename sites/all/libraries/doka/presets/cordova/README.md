# README

## On iOS we need `cordova-plugin-wkwebview-file-xhr` to read from the file protocol

To load files Doka Image Editor needs this XHR plugin

`cordova plugin add https://github.com/oracle/cordova-plugin-wkwebview-file-xhr`

## We need to allow `blob:` in the Content Security Policy

Add `blob:` after `img-src 'self'`

<meta
    http-equiv="Content-Security-Policy"
    content="default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *; img-src 'self' blob: data: content:;"
/>

## cordova-plugin-file overwrites native browser APIs

The `cordova-plugin-file` plugin overwrites browser native `File`, `FileReader`, and `ProgressEvent`
https://github.com/apache/cordova-plugin-file/issues/316

Add the following script to backup native web APIs in the global object, Doka Image Editor will try to access the native API from that object before trying the native web API. This script needs to run before the Cordova script is loaded.

<script src="js/doka-backup-webapi.js"></script>

## cordova-plugin-camera is required for camera access

Please read these instructions on updating the config.xml
https://cordova.apache.org/docs/en/10.x/reference/cordova-plugin-camera/index.html
