import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ReceiptDeveryDetailComponent } from './receipt-devery-detail.component';

describe('ReceiptDevery Management Detail Component', () => {
  let comp: ReceiptDeveryDetailComponent;
  let fixture: ComponentFixture<ReceiptDeveryDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceiptDeveryDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ receipt: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ReceiptDeveryDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ReceiptDeveryDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load receipt on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.receipt).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
