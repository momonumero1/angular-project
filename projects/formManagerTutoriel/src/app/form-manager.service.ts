import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, FormArray, FormControl } from '@angular/forms';
import { Subject } from 'rxjs/internal/Subject';
import { isUndefined } from 'util';
import * as _ from 'lodash';


export class CustomFormGroup {
  private form: FormGroup;

  setForm(fg: FormGroup) {
    this.form = fg;
  }

  getForm(): FormGroup {
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

  cache(key: string, formGroup: FormGroup) {
    console.log('cache');
    const cFG=new CustomFormGroup();
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

