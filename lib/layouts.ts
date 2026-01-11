import type { SBall, SHole } from "@gamely/sinuca-3d";

let ball_size    = 285;
let ball_spacing = 571;
let world_width  = 25400;
let world_height = 12700;

type SIteratorPairType<T> = 
  T extends SBall ? LuaMultiReturn<[T, 'ball']> :
  T extends SHole ? LuaMultiReturn<[T, 'hole']> :
  never;

function layoutJoin<T>(skip_t: boolean, ...generators: Array<LuaIterable<T>>) {
  let index = 0;
  return (() => {
    do {
      const ret = generators[index]() as Record<string, unknown>
      if (ret !== undefined) {
        if (skip_t) return ret;
        if (ret.vx !== undefined) return $multi(ret, 'ball')
        if (ret.r !== undefined) return $multi(ret, 'hole')
      }
    }
    while(++index < generators.length);
    return undefined
  }) as unknown as LuaIterable<T>
}

export function SGeneratorRack(x: number, y: number, grid: number[], rotate = false) {
  let row = 0;
  let col = 0;

  return (() => {
    if (row >= grid.length) return undefined;

    let columns = grid[row];

    while (col >= columns) {
      col = 0;
      row++;
      if (row >= grid.length) return undefined;
      columns = grid[row];
    }

    let cy = col - (columns - 1) / 2;
    let cx = row - (grid.length - 1) / 2;

    if (rotate) {
      const aux = cx;
      cx = cy;
      cy = aux;
    }

    const ball: SBall = {
      active: true,
      x: x + cx * ball_spacing,
      y: y + cy * ball_spacing,
      vx: 0,
      vy: 0,
      r: ball_size
    };

    col++;
    return ball;
  }) as unknown as LuaIterable<SBall>;
}

export function SLayoutJoin<T extends LuaIterable<any>[]>(
  ...generators: T
): LuaIterable<SIteratorPairType<ReturnType<T[number]>>> {
  return layoutJoin(false, ...generators)
}

export function STriangleRack(x: number, y: number, max = 15) {
  const grid: Array<number> = []
  let row = 1, remaning = max < 0? -max: max;
  while (remaning > 0) {
    grid.push(row < remaning? row: remaning);
    remaning -= row++;
  }
  return SGeneratorRack(x, y, max > 0? grid: grid.reverse());
}

export function SLineUpRack(x: number, y: number, max = 5, join = false) {
  const grid: Array<number> = []
  let remaning = max < 0? -max: max
  while (remaning > 0) {
    const count = ((grid.length % 2) === 0 || join)? 1: 0;
    grid.push(count);
    remaning -= count;
  }
  return SGeneratorRack(x, y, grid, max < 0);
}

export function SCrossRack(x: number, y: number, max = 10) {
  return layoutJoin(true,
    SLineUpRack(x, y, max/2),
    SLineUpRack(x, y, -max/2)
  );
}

export function SSquareRack(x: number, y: number, max = 20, join = false) {
  let remaining = max < 0? -max: max;
  const sqrt = Math.sqrt(remaining);
  if (max < 0) {
    const grid = [];
    while (remaining > 0) {
      grid.push(sqrt < remaining? sqrt: remaining);
      remaining -= sqrt;
    }
    return SGeneratorRack(x, y, grid);
  }

  const offset = join? 1: 2;
  const gridSize = Math.floor(Math.sqrt(remaining));
  const half = offset * ((gridSize - 1) / 2);
  const lineLength = gridSize;

  return layoutJoin(true,
    SLineUpRack(x, y - half * ball_spacing, lineLength, join),
    SLineUpRack(x, y + half * ball_spacing, lineLength, join),
    SLineUpRack(x - half * ball_spacing, y, - (lineLength - 2), join),
    SLineUpRack(x + half * ball_spacing, y, - (lineLength - 2), join)
  );
}

export function SCueWithRack(x: number, y: number, generator: LuaIterable<SBall>) {
  return layoutJoin(true, SGeneratorRack(x, y, [1]), generator)
}

export function SDiamoundRack(x: number, y: number) {
  return SGeneratorRack(x, y, [1, 2, 3, 2, 1])
}

export function S8PoolRack(max?: number) {
  const w4 = world_width / 4, h2 = world_height/2;
  return SCueWithRack(w4, h2, STriangleRack(w4 * 3, h2, max))
}

export function S9PoolRack(): LuaIterable<SBall> {
  const w4 = world_width / 4, h2 = world_height / 2;
  return SCueWithRack(w4, h2, SDiamoundRack(w4 * 3, h2))
}

export function S8PoolGame() {
  return S8PoolRack();
}

export const SConfig = {
  getBallSize: () => ball_size,
  getBallSpacing: () => ball_spacing,
  getWorldSize: () => $multi(world_width, world_height),
  setBallSize: (r: number) => { ball_size = r},
  setBallSpacing: (s: number) => { ball_spacing = s},
  setWorldSize: (w: number, h: number) => {
    world_width = w;
    world_height = h;
  }
}
