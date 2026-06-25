export class CrmRecord {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  ownerId?: string;

  // Generic bucket for provider-specific custom fields
  attributes: Record<string, any> = {};

  constructor(attributes: Record<string, any> = {}) {
    this.attributes = attributes;
  }
}
