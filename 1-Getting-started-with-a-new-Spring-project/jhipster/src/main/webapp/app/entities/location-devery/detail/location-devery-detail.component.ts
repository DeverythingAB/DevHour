import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILocationDevery } from '../location-devery.model';

@Component({
  selector: 'jhi-location-devery-detail',
  templateUrl: './location-devery-detail.component.html',
})
export class LocationDeveryDetailComponent implements OnInit {
  location: ILocationDevery | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ location }) => {
      this.location = location;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
