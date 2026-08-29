export type GradingToolsType = 'single' | 'all';

export interface GradingParams {
  learner?: string;
  problem: string;
}

export interface RescoreParams extends GradingParams {
  onlyIfHigher: boolean;
}

export interface ScoreParams extends GradingParams {
  newScore: number;
}
