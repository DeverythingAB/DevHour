import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'patient-devery',
        data: { pageTitle: 'devhourApp.patient.home.title' },
        loadChildren: () => import('./patient-devery/patient-devery.module').then(m => m.PatientDeveryModule),
      },
      {
        path: 'health-care-dependency-devery',
        data: { pageTitle: 'devhourApp.healthCareDependency.home.title' },
        loadChildren: () =>
          import('./health-care-dependency-devery/health-care-dependency-devery.module').then(m => m.HealthCareDependencyDeveryModule),
      },
      {
        path: 'location-devery',
        data: { pageTitle: 'devhourApp.location.home.title' },
        loadChildren: () => import('./location-devery/location-devery.module').then(m => m.LocationDeveryModule),
      },
      {
        path: 'image-devery',
        data: { pageTitle: 'devhourApp.image.home.title' },
        loadChildren: () => import('./image-devery/image-devery.module').then(m => m.ImageDeveryModule),
      },
      {
        path: 'diagnosis-devery',
        data: { pageTitle: 'devhourApp.diagnosis.home.title' },
        loadChildren: () => import('./diagnosis-devery/diagnosis-devery.module').then(m => m.DiagnosisDeveryModule),
      },
      {
        path: 'receipt-devery',
        data: { pageTitle: 'devhourApp.receipt.home.title' },
        loadChildren: () => import('./receipt-devery/receipt-devery.module').then(m => m.ReceiptDeveryModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
