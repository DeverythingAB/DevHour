import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IReceiptDevery } from '../receipt-devery.model';
import { ReceiptDeveryService } from '../service/receipt-devery.service';

@Component({
  templateUrl: './receipt-devery-delete-dialog.component.html',
})
export class ReceiptDeveryDeleteDialogComponent {
  receipt?: IReceiptDevery;

  constructor(protected receiptService: ReceiptDeveryService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.receiptService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
