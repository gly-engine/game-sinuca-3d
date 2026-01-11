export type SBall = {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

export type SHole = {
  x: number;
  y: number;
  r: number;
}

export type SWorld = {
  width: number;
  height: number;
  balls: SBall[];
}

declare const node: {}
export default node
