import { ILocationDevery } from 'app/entities/location-devery/location-devery.model';

export interface IHealthCareDependencyDevery {
  id?: number;
  name?: string;
  location?: ILocationDevery | null;
}

export class HealthCareDependencyDevery implements IHealthCareDependencyDevery {
  constructor(public id?: number, public name?: string, public location?: ILocationDevery | null) {}
}

export function getHealthCareDependencyDeveryIdentifier(healthCareDependency: IHealthCareDependencyDevery): number | undefined {
  return healthCareDependency.id;
}
