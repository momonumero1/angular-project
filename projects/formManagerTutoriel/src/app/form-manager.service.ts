import { Injectable } from '@angular/core';
import { FormBuilder, UntypedFormGroup, AbstractControl, FormArray, FormControl } from '@angular/forms';
import { Subject } from 'rxjs/internal/Subject';
import { isUndefined } from 'util';
import * as _ from 'lodash';


export class CustomFormGroup {
  private form: UntypedFormGroup;

  setForm(fg: UntypedFormGroup) {
    this.form = fg;
  }

  getForm(): UntypedFormGroup {
    return this.form;
  }
}



@Injectable({
  providedIn: 'root'
})
export class FormManagerService {


  cachedFormGroups = new Map<string, CustomFormGroup>();

  formGroupSubject = new Subject<CustomFormGroup>();

  formGroup: CustomFormGroup;

  constructor() { }

  getFormGroup(key: string) {
    if (this.hasForm(key)) {
      this.formGroup = this.cachedFormGroups.get(key);
    }
    this.emitFormGroup();
  }
  emitFormGroup() {
      this.formGroupSubject.next(this.formGroup);

  }

  cache(key: string, formGroup: UntypedFormGroup) {
    console.log('cache');
    const cFG = new CustomFormGroup();
    cFG.setForm(formGroup);
    this.cachedFormGroups.set(key, cFG);
    console.log(this.cachedFormGroups);
    this.emitFormGroup();
  }
  hasForm(key: string) {

    return this.cachedFormGroups.has(key);
  }

  resetCache(key: string) {
    this.cachedFormGroups.delete(key);
  }

}

