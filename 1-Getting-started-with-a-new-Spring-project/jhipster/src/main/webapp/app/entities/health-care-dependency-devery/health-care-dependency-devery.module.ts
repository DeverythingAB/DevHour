import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { HealthCareDependencyDeveryComponent } from './list/health-care-dependency-devery.component';
import { HealthCareDependencyDeveryDetailComponent } from './detail/health-care-dependency-devery-detail.component';
import { HealthCareDependencyDeveryUpdateComponent } from './update/health-care-dependency-devery-update.component';
import { HealthCareDependencyDeveryDeleteDialogComponent } from './delete/health-care-dependency-devery-delete-dialog.component';
import { HealthCareDependencyDeveryRoutingModule } from './route/health-care-dependency-devery-routing.module';

@NgModule({
  imports: [SharedModule, HealthCareDependencyDeveryRoutingModule],
  declarations: [
    HealthCareDependencyDeveryComponent,
    HealthCareDependencyDeveryDetailComponent,
    HealthCareDependencyDeveryUpdateComponent,
    HealthCareDependencyDeveryDeleteDialogComponent,
  ],
  entryComponents: [HealthCareDependencyDeveryDeleteDialogComponent],
})
export class HealthCareDependencyDeveryModule {}
