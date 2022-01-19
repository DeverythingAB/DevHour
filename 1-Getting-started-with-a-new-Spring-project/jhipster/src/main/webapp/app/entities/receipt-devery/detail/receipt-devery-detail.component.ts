import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IReceiptDevery } from '../receipt-devery.model';

@Component({
  selector: 'jhi-receipt-devery-detail',
  templateUrl: './receipt-devery-detail.component.html',
})
export class ReceiptDeveryDetailComponent implements OnInit {
  receipt: IReceiptDevery | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ receipt }) => {
      this.receipt = receipt;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
