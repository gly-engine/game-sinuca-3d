import type { SBall } from "@gamely/sinuca-3d";

export function SGeneratorRack(x: number, y: number, grid: number[], rotate = false) {
  const spacing = 20;
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
      x: x + cx * spacing,
      y: y + cy * spacing,
      vx: 0,
      vy: 0,
      r: 10
    };

    col++;
    return ball;
  }) as unknown as LuaIterable<SBall>;
}

export function SJoinAllRacks(...generators: Array<LuaIterable<SBall>>) {
  let index = 0;
  return (() => {
    do {
      const ball = generators[index]()
      if (ball !== undefined) return ball;
    }
    while(++index < generators.length);
    return undefined
  }) as unknown as LuaIterable<SBall>
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
  return SJoinAllRacks(
    SLineUpRack(x, y, max/2),
    SLineUpRack(x, y, -max/2)
  );
}

export function SSquareRack(x: number, y: number, max = 20, join = false) {
  /** @todo move */
  const spacing = 20;
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

  return SJoinAllRacks(
    SLineUpRack(x, y - half * spacing, lineLength, join),
    SLineUpRack(x, y + half * spacing, lineLength, join),
    SLineUpRack(x - half * spacing, y, - (lineLength - 2), join),
    SLineUpRack(x + half * spacing, y, - (lineLength - 2), join)
  );
}

export function SCueWithRack(x: number, y: number, generator: LuaIterable<SBall>) {
  return SJoinAllRacks(SGeneratorRack(x, y, [1]), generator)
}

export function SDiamoundRack(x: number, y: number) {
  return SGeneratorRack(x, y, [1, 2, 3, 2, 1])
}

export function SLayout8Pool(width: number, height: number, max?: number) {
  const w4 = width / 4, h2 = height/2;
  return SCueWithRack(w4, h2, STriangleRack(w4 * 3, h2, max))
}

export function SLayout9Pool(width: number, height: number) {
  const w4 = width / 4, h2 = height/2;
  return SCueWithRack(w4, h2, SDiamoundRack(w4 * 3, h2))
}
