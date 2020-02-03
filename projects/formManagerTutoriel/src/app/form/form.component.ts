import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormArray, FormControl } from '@angular/forms';
import { FormManagerService, CustomFormGroup } from '../form-manager.service';
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
      (fG: CustomFormGroup) => {
         if (!isUndefined(fG)) {
          this.myForm = this.cloneAbstractControl(fG.getForm());
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
        name: [null,Validators.required],
        surname: null
      });
  }
  ngOnDestroy() {
    this.formManager.cache(FORM_BUILDER_KEY, this.cloneAbstractControl(this.myForm));
    this.formGroupSubcription.unsubscribe();
  }
  onChangeValue() {
    // this.formManager.cache(FORM_BUILDER_KEY, this.myForm);
  }
  onReset() {
    this.myForm.reset();
    // this.formManager.cache(FORM_BUILDER_KEY, this.myForm);
  }
  onResetForm() {
    this.formManager.getFormGroup(FORM_BUILDER_KEY);
  }
  cloneAbstractControl<T extends AbstractControl>(control: T): T {
    let newControl: T;

    if (control instanceof FormGroup) {
      const formGroup = new FormGroup({}, control.validator, control.asyncValidator);
      const controls = control.controls;

      Object.keys(controls).forEach(key => {
        formGroup.addControl(key, this.cloneAbstractControl(controls[key]));
      });

      newControl = formGroup as any;
    } else if (control instanceof FormArray) {
      const formArray = new FormArray([], control.validator, control.asyncValidator);

      control.controls.forEach(formControl => formArray.push(this.cloneAbstractControl(formControl)));

      newControl = formArray as any;
    } else if (control instanceof FormControl) {
      newControl = new FormControl(control.value, control.validator, control.asyncValidator) as any;
    } else {
      throw new Error('Error: unexpected control value');
    }

    if (control.disabled) { newControl.disable({emitEvent: false}); }

    return newControl;
  }

}
