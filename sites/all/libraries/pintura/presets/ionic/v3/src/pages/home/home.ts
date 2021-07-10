import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

// allow accessing global Pintura module
declare var pintura: any;

@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
})
export class HomePage {
    constructor(public navCtrl: NavController) {}

    editImage() {
        // import functionality from global Pintura module
        const {
            setPlugins,
            openEditor,
            locale_en_gb,
            createDefaultImageReader,
            createDefaultImageWriter,
            plugin_crop,
            plugin_crop_locale_en_gb,
        } = pintura;

        // load needed plugins
        setPlugins(plugin_crop);

        // open editor editor
        const editor = openEditor({
            src: './assets/imgs/logo.png',
            imageReader: createDefaultImageReader(),
            imageWriter: createDefaultImageWriter(),
            locale: {
                ...locale_en_gb,
                ...plugin_crop_locale_en_gb,
            },
        });

        editor.on('process', (res) => {
            console.log(res);
        });
    }
}
