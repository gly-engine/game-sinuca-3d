export type SBall = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

export type SWorld = {
  width: number;
  height: number;
  balls: SBall[];
}

declare const node: {}
export default node
