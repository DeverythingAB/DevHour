import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDiagnosisDevery } from '../diagnosis-devery.model';

@Component({
  selector: 'jhi-diagnosis-devery-detail',
  templateUrl: './diagnosis-devery-detail.component.html',
})
export class DiagnosisDeveryDetailComponent implements OnInit {
  diagnosis: IDiagnosisDevery | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ diagnosis }) => {
      this.diagnosis = diagnosis;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
