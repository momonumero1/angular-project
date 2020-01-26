import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormManagerService } from '../form-manager.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { isUndefined } from 'util';

const FORM_BUILDER_KEY = 'otherform1';

@Component({
  selector: 'fmt-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.css']
})
export class OtherComponent implements OnInit, OnDestroy {
  formGroupSubcription: Subscription;
  myOtherForm: FormGroup;
  constructor(private formBuilder: FormBuilder,
              private formManager: FormManagerService) { }

  ngOnInit() {
    this.initForm();
    this.formGroupSubcription = this.formManager.formGroupSubject.subscribe(
      (fG: FormGroup) => {
        if (!isUndefined(fG)) {

        this.myOtherForm = fG;
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
    this.myOtherForm = this.formBuilder.group(
      {
        name: null,
        surname: null,
        license: null
      });
  }
  ngOnDestroy() {
     this.formManager.cache(FORM_BUILDER_KEY, this.myOtherForm);
     this.formGroupSubcription.unsubscribe();
  }
  onChangeValue() {
     // this.formManager.cache(FORM_BUILDER_KEY, this.myOtherForm);
  }
  onReset() {
    this.myOtherForm.reset();
    //this.formManager.cache(FORM_BUILDER_KEY, this.myOtherForm);
  }
  onResetForm() {
    this.formManager.getFormGroup(FORM_BUILDER_KEY);
  }
}
