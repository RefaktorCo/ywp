import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { AngularPinturaModule } from 'angular-pintura';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, AngularPinturaModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
