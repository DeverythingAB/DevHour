import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPatientDevery } from '../patient-devery.model';

@Component({
  selector: 'jhi-patient-devery-detail',
  templateUrl: './patient-devery-detail.component.html',
})
export class PatientDeveryDetailComponent implements OnInit {
  patient: IPatientDevery | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ patient }) => {
      this.patient = patient;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
