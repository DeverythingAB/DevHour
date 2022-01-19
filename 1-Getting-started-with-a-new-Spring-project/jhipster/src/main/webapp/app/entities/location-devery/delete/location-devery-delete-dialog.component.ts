import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILocationDevery } from '../location-devery.model';
import { LocationDeveryService } from '../service/location-devery.service';

@Component({
  templateUrl: './location-devery-delete-dialog.component.html',
})
export class LocationDeveryDeleteDialogComponent {
  location?: ILocationDevery;

  constructor(protected locationService: LocationDeveryService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.locationService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
