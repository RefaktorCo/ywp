import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// import AngularDokaModule
import { AngularDokaModule } from '../../local_modules/angular-doka/angular-doka.module';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, AngularDokaModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
