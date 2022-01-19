import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IReceiptDevery, ReceiptDevery } from '../receipt-devery.model';
import { ReceiptDeveryService } from '../service/receipt-devery.service';
import { IHealthCareDependencyDevery } from 'app/entities/health-care-dependency-devery/health-care-dependency-devery.model';
import { HealthCareDependencyDeveryService } from 'app/entities/health-care-dependency-devery/service/health-care-dependency-devery.service';
import { IDiagnosisDevery } from 'app/entities/diagnosis-devery/diagnosis-devery.model';
import { DiagnosisDeveryService } from 'app/entities/diagnosis-devery/service/diagnosis-devery.service';

@Component({
  selector: 'jhi-receipt-devery-update',
  templateUrl: './receipt-devery-update.component.html',
})
export class ReceiptDeveryUpdateComponent implements OnInit {
  isSaving = false;

  healthCareDependenciesCollection: IHealthCareDependencyDevery[] = [];
  diagnosesCollection: IDiagnosisDevery[] = [];

  editForm = this.fb.group({
    id: [],
    number: [null, [Validators.required]],
    healthCareDependency: [],
    diagnosis: [],
  });

  constructor(
    protected receiptService: ReceiptDeveryService,
    protected healthCareDependencyService: HealthCareDependencyDeveryService,
    protected diagnosisService: DiagnosisDeveryService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ receipt }) => {
      this.updateForm(receipt);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const receipt = this.createFromForm();
    if (receipt.id !== undefined) {
      this.subscribeToSaveResponse(this.receiptService.update(receipt));
    } else {
      this.subscribeToSaveResponse(this.receiptService.create(receipt));
    }
  }

  trackHealthCareDependencyDeveryById(index: number, item: IHealthCareDependencyDevery): number {
    return item.id!;
  }

  trackDiagnosisDeveryById(index: number, item: IDiagnosisDevery): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReceiptDevery>>): void {
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

  protected updateForm(receipt: IReceiptDevery): void {
    this.editForm.patchValue({
      id: receipt.id,
      number: receipt.number,
      healthCareDependency: receipt.healthCareDependency,
      diagnosis: receipt.diagnosis,
    });

    this.healthCareDependenciesCollection = this.healthCareDependencyService.addHealthCareDependencyDeveryToCollectionIfMissing(
      this.healthCareDependenciesCollection,
      receipt.healthCareDependency
    );
    this.diagnosesCollection = this.diagnosisService.addDiagnosisDeveryToCollectionIfMissing(this.diagnosesCollection, receipt.diagnosis);
  }

  protected loadRelationshipsOptions(): void {
    this.healthCareDependencyService
      .query({ filter: 'receipt-is-null' })
      .pipe(map((res: HttpResponse<IHealthCareDependencyDevery[]>) => res.body ?? []))
      .pipe(
        map((healthCareDependencies: IHealthCareDependencyDevery[]) =>
          this.healthCareDependencyService.addHealthCareDependencyDeveryToCollectionIfMissing(
            healthCareDependencies,
            this.editForm.get('healthCareDependency')!.value
          )
        )
      )
      .subscribe(
        (healthCareDependencies: IHealthCareDependencyDevery[]) => (this.healthCareDependenciesCollection = healthCareDependencies)
      );

    this.diagnosisService
      .query({ filter: 'receipt-is-null' })
      .pipe(map((res: HttpResponse<IDiagnosisDevery[]>) => res.body ?? []))
      .pipe(
        map((diagnoses: IDiagnosisDevery[]) =>
          this.diagnosisService.addDiagnosisDeveryToCollectionIfMissing(diagnoses, this.editForm.get('diagnosis')!.value)
        )
      )
      .subscribe((diagnoses: IDiagnosisDevery[]) => (this.diagnosesCollection = diagnoses));
  }

  protected createFromForm(): IReceiptDevery {
    return {
      ...new ReceiptDevery(),
      id: this.editForm.get(['id'])!.value,
      number: this.editForm.get(['number'])!.value,
      healthCareDependency: this.editForm.get(['healthCareDependency'])!.value,
      diagnosis: this.editForm.get(['diagnosis'])!.value,
    };
  }
}
