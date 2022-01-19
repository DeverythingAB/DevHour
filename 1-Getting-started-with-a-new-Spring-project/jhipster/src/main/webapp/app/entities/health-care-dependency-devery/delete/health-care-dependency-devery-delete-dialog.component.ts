import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IHealthCareDependencyDevery } from '../health-care-dependency-devery.model';
import { HealthCareDependencyDeveryService } from '../service/health-care-dependency-devery.service';

@Component({
  templateUrl: './health-care-dependency-devery-delete-dialog.component.html',
})
export class HealthCareDependencyDeveryDeleteDialogComponent {
  healthCareDependency?: IHealthCareDependencyDevery;

  constructor(protected healthCareDependencyService: HealthCareDependencyDeveryService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.healthCareDependencyService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
