import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BoardComponent } from './board/board.component';

import {MatGridListModule, MatButtonModule, MatButtonToggleModule,
        MatMenuModule, MatIconModule, MatSelectModule, MatFormFieldModule} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { NeonButtonComponent } from './neon-button/neon-button.component';
import { ToogleButtonsComponent } from './toogle-buttons/toogle-buttons.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    NeonButtonComponent,
    ToogleButtonsComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    HttpClientModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
