export type SBall = {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

export type SHole = {
  active: boolean;
  x: number;
  y: number;
  r: number;
}

export type SWorld = {
  width: number;
  height: number;
}

export type SGameGenerator = LuaIterable<(
  | LuaMultiReturn<[SBall, 'ball']> 
  | LuaMultiReturn<[SHole, 'hole']>
  | LuaMultiReturn<[SWorld, 'world']>
)>

export type SGameFixed = Array<(
  | [SBall, 'ball']
  | [SHole, 'hole']
  | [SWorld, 'world']
)>

export type SItemAdder = SGameFixed | SGameGenerator | SBall | SHole

export interface SPhisicsInterface {
  add(item: SItemAdder): SPhisicsInterface;
  add(item: 'ball', x: number, y: number, r: number): SPhisicsInterface;
  add(item: 'hole', x: number, y: number, r: number): SPhisicsInterface;
  step(dt: number): void;
  iterator(f: (ball: SBall, index: number) => void): void;
  applyImpulse(ballId: number, ix: number, iy: number): void;
}

declare const node: {}
export default node
