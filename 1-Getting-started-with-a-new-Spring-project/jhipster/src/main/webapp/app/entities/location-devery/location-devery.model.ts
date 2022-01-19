export interface ILocationDevery {
  id?: number;
  streetAddress?: string;
  postalCode?: string;
  city?: string;
  stateProvince?: string;
}

export class LocationDevery implements ILocationDevery {
  constructor(
    public id?: number,
    public streetAddress?: string,
    public postalCode?: string,
    public city?: string,
    public stateProvince?: string
  ) {}
}

export function getLocationDeveryIdentifier(location: ILocationDevery): number | undefined {
  return location.id;
}
