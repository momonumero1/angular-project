import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormComponent } from './form/form.component';
import { OtherComponent } from './other/other.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormManagerService } from './form-manager.service';
import { MatInputModule, MatSelectModule, MatFormFieldModule, MatOptionModule } from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

const routes: Routes = [
  {path: 'form', component: FormComponent},
  {path: 'other', component: OtherComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes), ReactiveFormsModule, CommonModule ,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule,
    BrowserAnimationsModule ],
  exports: [RouterModule],
  declarations: [FormComponent, OtherComponent],
  providers: [FormManagerService],
})
export class AppRoutingModule { }
