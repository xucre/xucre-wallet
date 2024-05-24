export interface ConversionRate {
  currency: string;
  value?: number;
  setCurrency?: (currency: string) => void;
}