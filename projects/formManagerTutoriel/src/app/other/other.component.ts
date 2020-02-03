import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, FormArray, FormControl } from '@angular/forms';
import { FormManagerService, CustomFormGroup } from '../form-manager.service';
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
      (fG: CustomFormGroup) => {
        if (!isUndefined(fG)) {

        this.myOtherForm = this.cloneAbstractControl(fG.getForm());
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
     this.formManager.cache(FORM_BUILDER_KEY, this.cloneAbstractControl(this.myOtherForm));
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
