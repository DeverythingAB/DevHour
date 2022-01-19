import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ReceiptDeveryComponent } from './list/receipt-devery.component';
import { ReceiptDeveryDetailComponent } from './detail/receipt-devery-detail.component';
import { ReceiptDeveryUpdateComponent } from './update/receipt-devery-update.component';
import { ReceiptDeveryDeleteDialogComponent } from './delete/receipt-devery-delete-dialog.component';
import { ReceiptDeveryRoutingModule } from './route/receipt-devery-routing.module';

@NgModule({
  imports: [SharedModule, ReceiptDeveryRoutingModule],
  declarations: [ReceiptDeveryComponent, ReceiptDeveryDetailComponent, ReceiptDeveryUpdateComponent, ReceiptDeveryDeleteDialogComponent],
  entryComponents: [ReceiptDeveryDeleteDialogComponent],
})
export class ReceiptDeveryModule {}
