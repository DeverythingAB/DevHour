import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IImageDevery } from '../image-devery.model';
import { ImageDeveryService } from '../service/image-devery.service';

@Component({
  templateUrl: './image-devery-delete-dialog.component.html',
})
export class ImageDeveryDeleteDialogComponent {
  image?: IImageDevery;

  constructor(protected imageService: ImageDeveryService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.imageService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
