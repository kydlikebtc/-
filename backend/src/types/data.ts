export interface GlassnodeData {
  nupl: number;
  rhodl: number;
  puell: number;
  reserveRisk: number;
  mvrv: number;
}

export interface CoinglassData {
  // Add Coinglass specific data fields here
  // Currently not used in the code
  [key: string]: number;
}
