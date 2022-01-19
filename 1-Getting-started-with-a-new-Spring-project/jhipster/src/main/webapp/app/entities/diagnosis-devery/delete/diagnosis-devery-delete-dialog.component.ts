import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDiagnosisDevery } from '../diagnosis-devery.model';
import { DiagnosisDeveryService } from '../service/diagnosis-devery.service';

@Component({
  templateUrl: './diagnosis-devery-delete-dialog.component.html',
})
export class DiagnosisDeveryDeleteDialogComponent {
  diagnosis?: IDiagnosisDevery;

  constructor(protected diagnosisService: DiagnosisDeveryService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.diagnosisService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
