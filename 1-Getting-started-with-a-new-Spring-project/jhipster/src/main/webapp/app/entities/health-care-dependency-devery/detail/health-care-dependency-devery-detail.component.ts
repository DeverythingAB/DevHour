import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IHealthCareDependencyDevery } from '../health-care-dependency-devery.model';

@Component({
  selector: 'jhi-health-care-dependency-devery-detail',
  templateUrl: './health-care-dependency-devery-detail.component.html',
})
export class HealthCareDependencyDeveryDetailComponent implements OnInit {
  healthCareDependency: IHealthCareDependencyDevery | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ healthCareDependency }) => {
      this.healthCareDependency = healthCareDependency;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
