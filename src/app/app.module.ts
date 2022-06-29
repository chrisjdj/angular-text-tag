import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TextTagComponent } from './text-tag/component/text-tag.component';
import { TextTagDirective } from './text-tag/directive/text-tag.directive';

@NgModule({
  declarations: [
    AppComponent,
    TextTagComponent,
    TextTagDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
