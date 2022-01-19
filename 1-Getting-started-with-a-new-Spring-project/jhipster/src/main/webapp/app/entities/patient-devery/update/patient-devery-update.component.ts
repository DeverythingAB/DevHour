import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IPatientDevery, PatientDevery } from '../patient-devery.model';
import { PatientDeveryService } from '../service/patient-devery.service';

@Component({
  selector: 'jhi-patient-devery-update',
  templateUrl: './patient-devery-update.component.html',
})
export class PatientDeveryUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    curp: [null, [Validators.required]],
    firstName: [],
    lastName: [],
    email: [],
    phoneNumber: [],
  });

  constructor(protected patientService: PatientDeveryService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ patient }) => {
      this.updateForm(patient);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const patient = this.createFromForm();
    if (patient.id !== undefined) {
      this.subscribeToSaveResponse(this.patientService.update(patient));
    } else {
      this.subscribeToSaveResponse(this.patientService.create(patient));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPatientDevery>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(patient: IPatientDevery): void {
    this.editForm.patchValue({
      id: patient.id,
      curp: patient.curp,
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      phoneNumber: patient.phoneNumber,
    });
  }

  protected createFromForm(): IPatientDevery {
    return {
      ...new PatientDevery(),
      id: this.editForm.get(['id'])!.value,
      curp: this.editForm.get(['curp'])!.value,
      firstName: this.editForm.get(['firstName'])!.value,
      lastName: this.editForm.get(['lastName'])!.value,
      email: this.editForm.get(['email'])!.value,
      phoneNumber: this.editForm.get(['phoneNumber'])!.value,
    };
  }
}
