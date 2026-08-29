export interface ORARecord {
  unitName: string;
  displayName: string;
  totalResponses: number;
  training: number;
  peer: number;
  self: number;
  waiting: number;
  staff: number;
  finalGradeReceived: number;
  staffOraGradingUrl?: string;
}
