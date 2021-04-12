import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { AngularDokaModule } from 'angular-doka';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, AngularDokaModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
