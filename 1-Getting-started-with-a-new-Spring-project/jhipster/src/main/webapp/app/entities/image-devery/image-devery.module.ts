import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ImageDeveryComponent } from './list/image-devery.component';
import { ImageDeveryDetailComponent } from './detail/image-devery-detail.component';
import { ImageDeveryUpdateComponent } from './update/image-devery-update.component';
import { ImageDeveryDeleteDialogComponent } from './delete/image-devery-delete-dialog.component';
import { ImageDeveryRoutingModule } from './route/image-devery-routing.module';

@NgModule({
  imports: [SharedModule, ImageDeveryRoutingModule],
  declarations: [ImageDeveryComponent, ImageDeveryDetailComponent, ImageDeveryUpdateComponent, ImageDeveryDeleteDialogComponent],
  entryComponents: [ImageDeveryDeleteDialogComponent],
})
export class ImageDeveryModule {}
