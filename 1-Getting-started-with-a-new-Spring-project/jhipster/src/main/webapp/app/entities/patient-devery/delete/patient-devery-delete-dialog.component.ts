import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPatientDevery } from '../patient-devery.model';
import { PatientDeveryService } from '../service/patient-devery.service';

@Component({
  templateUrl: './patient-devery-delete-dialog.component.html',
})
export class PatientDeveryDeleteDialogComponent {
  patient?: IPatientDevery;

  constructor(protected patientService: PatientDeveryService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.patientService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
