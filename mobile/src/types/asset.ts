export type AssetOwnershipType = 'CUSTOMER_OWNED' | 'LEASED' | 'SERVICE_COMPANY_OWNED';

export type AssetStatus = 'ACTIVE' | 'IN_REPAIR' | 'INACTIVE' | 'DECOMMISSIONED';

export type MeterReadingType = 'TOTAL_PAGES' | 'BLACK_AND_WHITE' | 'COLOR' | 'SCANS';

export interface MeterReading {
  id: string;
  type: MeterReadingType;
  value: number;
  recordedAt: string;
  recordedById: string;
  recordedByName: string;
}

export interface Asset {
  id: string;
  tenantId: string;
  customerId: string;
  assetType: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  ownershipType: AssetOwnershipType;
  assignedToCustomerDate?: string;
  installationDate?: string;
  warrantyStartDate?: string;
  warrantyEndDate?: string;
  address?: string;
  primaryContactId?: string;
  primaryContactName?: string;
  status: AssetStatus;
  description?: string;
  meterReadings: MeterReading[];
}
