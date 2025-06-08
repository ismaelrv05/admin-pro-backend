import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { PagesModule } from './pages/pages.module';
import { AuthModule } from './auth/auth.module';


import { AppComponent } from './app.component';
import { NoFoundPageComponent } from './no-found-page/no-found-page.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    NoFoundPageComponent,
  ],
  exports: [
    AppComponent,
    NoFoundPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PagesModule,
    AuthModule,
    NgbModule,
    FormsModule,
    HttpClientModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
