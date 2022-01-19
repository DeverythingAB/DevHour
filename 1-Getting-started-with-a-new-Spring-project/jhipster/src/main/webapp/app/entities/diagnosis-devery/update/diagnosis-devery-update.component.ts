import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IDiagnosisDevery, DiagnosisDevery } from '../diagnosis-devery.model';
import { DiagnosisDeveryService } from '../service/diagnosis-devery.service';

@Component({
  selector: 'jhi-diagnosis-devery-update',
  templateUrl: './diagnosis-devery-update.component.html',
})
export class DiagnosisDeveryUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    diagnosis: [null, [Validators.required]],
  });

  constructor(protected diagnosisService: DiagnosisDeveryService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ diagnosis }) => {
      this.updateForm(diagnosis);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const diagnosis = this.createFromForm();
    if (diagnosis.id !== undefined) {
      this.subscribeToSaveResponse(this.diagnosisService.update(diagnosis));
    } else {
      this.subscribeToSaveResponse(this.diagnosisService.create(diagnosis));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDiagnosisDevery>>): void {
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

  protected updateForm(diagnosis: IDiagnosisDevery): void {
    this.editForm.patchValue({
      id: diagnosis.id,
      diagnosis: diagnosis.diagnosis,
    });
  }

  protected createFromForm(): IDiagnosisDevery {
    return {
      ...new DiagnosisDevery(),
      id: this.editForm.get(['id'])!.value,
      diagnosis: this.editForm.get(['diagnosis'])!.value,
    };
  }
}
