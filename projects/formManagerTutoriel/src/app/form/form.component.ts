import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormManagerService } from '../form-manager.service';
import { Subscription } from 'rxjs';
import { isUndefined } from 'util';

const FORM_BUILDER_KEY = 'form1';

@Component({
  selector: 'fmt-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, OnDestroy {


  myForm: FormGroup;
  formGroupSubcription: Subscription;
  constructor(private formBuilder: FormBuilder,
              private formManager: FormManagerService) { }

  ngOnInit() {
    this.initForm();
    this.formGroupSubcription = this.formManager.formGroupSubject.subscribe(
      (fG: FormGroup) => {
         if (!isUndefined(fG)) {
          this.myForm = fG;
        } else {
          this.initForm();
        }
      },
      (error) => {
        console.log('error');
      }
    );

    this.formManager.getFormGroup(FORM_BUILDER_KEY);

  }
  initForm() {
    this.myForm = this.formBuilder.group(
      {
        name: null,
        surname: null
      });
  }
  ngOnDestroy() {
    this.formManager.cache(FORM_BUILDER_KEY, this.myForm);
    this.formGroupSubcription.unsubscribe();
  }
  onChangeValue() {
    // this.formManager.cache(FORM_BUILDER_KEY, this.myForm);
  }
  onReset() {
    this.myForm.reset();
    //this.formManager.cache(FORM_BUILDER_KEY, this.myForm);
  }
  onResetForm() {
    this.formManager.getFormGroup(FORM_BUILDER_KEY);
  }


}
