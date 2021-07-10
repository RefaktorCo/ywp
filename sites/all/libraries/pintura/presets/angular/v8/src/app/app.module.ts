import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// import AngularPinturaModule
import { AngularPinturaModule } from '../../local_modules/angular-pintura/angular-pintura.module';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, AngularPinturaModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
