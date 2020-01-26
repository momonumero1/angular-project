import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, FormArray, FormControl } from '@angular/forms';
import { Subject } from 'rxjs/internal/Subject';
import { isUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class FormManagerService {


  cachedFormGroups = new Map<string, FormGroup>();

  formGroupSubject = new Subject<FormGroup>();

  formGroup: FormGroup;

  constructor() { }

  getFormGroup(key: string) {
    if (this.hasForm(key)) {
      this.formGroup = this.cloneAbstractControl(this.cachedFormGroups.get(key));
    }
    this.emitFormGroup();
  }
  emitFormGroup() {
      this.formGroupSubject.next(this.formGroup);

  }

  cache(key: string, formGroup: FormGroup) {
    // console.log('cache');
    this.cachedFormGroups.set(key, this.cloneAbstractControl(formGroup));
    // console.log(this.cachedFormGroups);
    this.emitFormGroup();
  }
  hasForm(key: string) {

    return this.cachedFormGroups.has(key);
  }

  resetCache(key: string) {
    this.cachedFormGroups.delete(key);
  }
  /*
  * Deep clones the given AbstractControl, preserving values, validators, async validators, and disabled status.
  * @param control AbstractControl
  * @returns AbstractControl
  */
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

