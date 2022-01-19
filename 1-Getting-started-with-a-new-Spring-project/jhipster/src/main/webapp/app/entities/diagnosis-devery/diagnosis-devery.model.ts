export interface IDiagnosisDevery {
  id?: number;
  diagnosis?: string;
}

export class DiagnosisDevery implements IDiagnosisDevery {
  constructor(public id?: number, public diagnosis?: string) {}
}

export function getDiagnosisDeveryIdentifier(diagnosis: IDiagnosisDevery): number | undefined {
  return diagnosis.id;
}
