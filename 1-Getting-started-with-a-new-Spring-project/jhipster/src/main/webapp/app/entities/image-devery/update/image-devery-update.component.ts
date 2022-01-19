import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IImageDevery, ImageDevery } from '../image-devery.model';
import { ImageDeveryService } from '../service/image-devery.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ILocationDevery } from 'app/entities/location-devery/location-devery.model';
import { LocationDeveryService } from 'app/entities/location-devery/service/location-devery.service';
import { IDiagnosisDevery } from 'app/entities/diagnosis-devery/diagnosis-devery.model';
import { DiagnosisDeveryService } from 'app/entities/diagnosis-devery/service/diagnosis-devery.service';
import { IPatientDevery } from 'app/entities/patient-devery/patient-devery.model';
import { PatientDeveryService } from 'app/entities/patient-devery/service/patient-devery.service';

@Component({
  selector: 'jhi-image-devery-update',
  templateUrl: './image-devery-update.component.html',
})
export class ImageDeveryUpdateComponent implements OnInit {
  isSaving = false;

  locationsCollection: ILocationDevery[] = [];
  diagnosesSharedCollection: IDiagnosisDevery[] = [];
  patientsSharedCollection: IPatientDevery[] = [];

  editForm = this.fb.group({
    id: [],
    image: [null, [Validators.required]],
    imageContentType: [],
    uploaded: [],
    location: [],
    diagnosis: [],
    patient: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected imageService: ImageDeveryService,
    protected locationService: LocationDeveryService,
    protected diagnosisService: DiagnosisDeveryService,
    protected patientService: PatientDeveryService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ image }) => {
      this.updateForm(image);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('devhourApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const image = this.createFromForm();
    if (image.id !== undefined) {
      this.subscribeToSaveResponse(this.imageService.update(image));
    } else {
      this.subscribeToSaveResponse(this.imageService.create(image));
    }
  }

  trackLocationDeveryById(index: number, item: ILocationDevery): number {
    return item.id!;
  }

  trackDiagnosisDeveryById(index: number, item: IDiagnosisDevery): number {
    return item.id!;
  }

  trackPatientDeveryById(index: number, item: IPatientDevery): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IImageDevery>>): void {
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

  protected updateForm(image: IImageDevery): void {
    this.editForm.patchValue({
      id: image.id,
      image: image.image,
      imageContentType: image.imageContentType,
      uploaded: image.uploaded,
      location: image.location,
      diagnosis: image.diagnosis,
      patient: image.patient,
    });

    this.locationsCollection = this.locationService.addLocationDeveryToCollectionIfMissing(this.locationsCollection, image.location);
    this.diagnosesSharedCollection = this.diagnosisService.addDiagnosisDeveryToCollectionIfMissing(
      this.diagnosesSharedCollection,
      image.diagnosis
    );
    this.patientsSharedCollection = this.patientService.addPatientDeveryToCollectionIfMissing(this.patientsSharedCollection, image.patient);
  }

  protected loadRelationshipsOptions(): void {
    this.locationService
      .query({ filter: 'image-is-null' })
      .pipe(map((res: HttpResponse<ILocationDevery[]>) => res.body ?? []))
      .pipe(
        map((locations: ILocationDevery[]) =>
          this.locationService.addLocationDeveryToCollectionIfMissing(locations, this.editForm.get('location')!.value)
        )
      )
      .subscribe((locations: ILocationDevery[]) => (this.locationsCollection = locations));

    this.diagnosisService
      .query()
      .pipe(map((res: HttpResponse<IDiagnosisDevery[]>) => res.body ?? []))
      .pipe(
        map((diagnoses: IDiagnosisDevery[]) =>
          this.diagnosisService.addDiagnosisDeveryToCollectionIfMissing(diagnoses, this.editForm.get('diagnosis')!.value)
        )
      )
      .subscribe((diagnoses: IDiagnosisDevery[]) => (this.diagnosesSharedCollection = diagnoses));

    this.patientService
      .query()
      .pipe(map((res: HttpResponse<IPatientDevery[]>) => res.body ?? []))
      .pipe(
        map((patients: IPatientDevery[]) =>
          this.patientService.addPatientDeveryToCollectionIfMissing(patients, this.editForm.get('patient')!.value)
        )
      )
      .subscribe((patients: IPatientDevery[]) => (this.patientsSharedCollection = patients));
  }

  protected createFromForm(): IImageDevery {
    return {
      ...new ImageDevery(),
      id: this.editForm.get(['id'])!.value,
      imageContentType: this.editForm.get(['imageContentType'])!.value,
      image: this.editForm.get(['image'])!.value,
      uploaded: this.editForm.get(['uploaded'])!.value,
      location: this.editForm.get(['location'])!.value,
      diagnosis: this.editForm.get(['diagnosis'])!.value,
      patient: this.editForm.get(['patient'])!.value,
    };
  }
}
