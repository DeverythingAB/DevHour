import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IHealthCareDependencyDevery, HealthCareDependencyDevery } from '../health-care-dependency-devery.model';
import { HealthCareDependencyDeveryService } from '../service/health-care-dependency-devery.service';
import { ILocationDevery } from 'app/entities/location-devery/location-devery.model';
import { LocationDeveryService } from 'app/entities/location-devery/service/location-devery.service';

@Component({
  selector: 'jhi-health-care-dependency-devery-update',
  templateUrl: './health-care-dependency-devery-update.component.html',
})
export class HealthCareDependencyDeveryUpdateComponent implements OnInit {
  isSaving = false;

  locationsCollection: ILocationDevery[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    location: [],
  });

  constructor(
    protected healthCareDependencyService: HealthCareDependencyDeveryService,
    protected locationService: LocationDeveryService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ healthCareDependency }) => {
      this.updateForm(healthCareDependency);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const healthCareDependency = this.createFromForm();
    if (healthCareDependency.id !== undefined) {
      this.subscribeToSaveResponse(this.healthCareDependencyService.update(healthCareDependency));
    } else {
      this.subscribeToSaveResponse(this.healthCareDependencyService.create(healthCareDependency));
    }
  }

  trackLocationDeveryById(index: number, item: ILocationDevery): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHealthCareDependencyDevery>>): void {
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

  protected updateForm(healthCareDependency: IHealthCareDependencyDevery): void {
    this.editForm.patchValue({
      id: healthCareDependency.id,
      name: healthCareDependency.name,
      location: healthCareDependency.location,
    });

    this.locationsCollection = this.locationService.addLocationDeveryToCollectionIfMissing(
      this.locationsCollection,
      healthCareDependency.location
    );
  }

  protected loadRelationshipsOptions(): void {
    this.locationService
      .query({ filter: 'healthcaredependency-is-null' })
      .pipe(map((res: HttpResponse<ILocationDevery[]>) => res.body ?? []))
      .pipe(
        map((locations: ILocationDevery[]) =>
          this.locationService.addLocationDeveryToCollectionIfMissing(locations, this.editForm.get('location')!.value)
        )
      )
      .subscribe((locations: ILocationDevery[]) => (this.locationsCollection = locations));
  }

  protected createFromForm(): IHealthCareDependencyDevery {
    return {
      ...new HealthCareDependencyDevery(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      location: this.editForm.get(['location'])!.value,
    };
  }
}
