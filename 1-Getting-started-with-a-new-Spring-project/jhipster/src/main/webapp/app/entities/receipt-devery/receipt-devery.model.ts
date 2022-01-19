import { IHealthCareDependencyDevery } from 'app/entities/health-care-dependency-devery/health-care-dependency-devery.model';
import { IDiagnosisDevery } from 'app/entities/diagnosis-devery/diagnosis-devery.model';

export interface IReceiptDevery {
  id?: number;
  number?: number;
  healthCareDependency?: IHealthCareDependencyDevery | null;
  diagnosis?: IDiagnosisDevery | null;
}

export class ReceiptDevery implements IReceiptDevery {
  constructor(
    public id?: number,
    public number?: number,
    public healthCareDependency?: IHealthCareDependencyDevery | null,
    public diagnosis?: IDiagnosisDevery | null
  ) {}
}

export function getReceiptDeveryIdentifier(receipt: IReceiptDevery): number | undefined {
  return receipt.id;
}
