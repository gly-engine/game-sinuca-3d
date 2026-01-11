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

declare const node: {}
export default node
