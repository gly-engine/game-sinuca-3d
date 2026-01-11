import type { SBall, SGameFixed, SGameGenerator, SHole, SWorld } from '@gamely/sinuca-3d'

function length(x: number, y: number): number {
  return Math.sqrt(x * x + y * y);
}

function normalize(x: number, y: number): [number, number] {
  const len = length(x, y);
  if (len === 0) return [0, 0];
  return [x / len, y / len];
}

function integrate(balls: SBall[], friction: number, dt: number): void {
  for (const b of balls) {
    //if (!b.active) continue;

    b.x += b.vx * dt;
    b.y += b.vy * dt;

    const speed = length(b.vx, b.vy);
    if (speed > 0) {
      const decel = friction * dt;
      const newSpeed = Math.max(0, speed - decel);

      if (newSpeed === 0) {
        b.vx = 0;
        b.vy = 0;
      } else {
        const [nx, ny] = normalize(b.vx, b.vy);
        b.vx = nx * newSpeed;
        b.vy = ny * newSpeed;
      }
    }
  }
}

function solveBallCollisions(balls: SBall[]) {
  for (let i = 0; i < balls.length; i++) {
    const a = balls[i];
    //if (!a.active) continue;

    for (let j = i + 1; j < balls.length; j++) {
      const b = balls[j];
      //if (!b.active) continue;

      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = length(dx, dy);
      const minDist = a.r + b.r;

      if (dist === 0 || dist >= minDist) continue;

      const nx = dx / dist;
      const ny = dy / dist;

      const va = a.vx * nx + a.vy * ny;
      const vb = b.vx * nx + b.vy * ny;

      if (va <= vb) continue;

      const p = va - vb;

      a.vx -= p * nx;
      a.vy -= p * ny;
      b.vx += p * nx;
      b.vy += p * ny;

      const overlap = minDist - dist;
      const corr = overlap * 0.5;

      a.x -= nx * corr;
      a.y -= ny * corr;
      b.x += nx * corr;
      b.y += ny * corr;
    }
  }
}

function solveWallCollisions(balls: SBall[], w: number, h: number, restitution: number) {
  for (const b of balls) {
    //if (!b.active) continue;

    if (b.x < b.r) {
      b.x = b.r;
      b.vx = -b.vx * restitution;
    } else if (b.x > w - b.r) {
      b.x = w - b.r;
      b.vx = -b.vx * restitution;
    }

    if (b.y < b.r) {
      b.y = b.r;
      b.vy = -b.vy * restitution;
    } else if (b.y > h - b.r) {
      b.y = h - b.r;
      b.vy = -b.vy * restitution;
    }
  }
}

export class SPhysicsLite {
  private friction = 120;
  private iterations = 2;
  private restitution = 0.98;
  private holes: SHole[];
  private balls: SBall[];
  private world: SWorld = {width: 0, height: 0};

  constructor (generator: SGameFixed | SGameGenerator) {
    this.holes = [];
    this.balls = [];
  }

  public step(dt: number) {
    integrate(this.balls, this.friction, dt);
    for (let i = 0; i < this.iterations; i++) {
      solveBallCollisions(this.balls);
      solveWallCollisions(this.balls, this.world.width, this.world.height, this.restitution);
    }
  }

  public iterator(f: Function) {
    
  }

  public applyImpulse(ballId: number, ix: number, iy: number) {
    const b = this.balls[ballId];
    if (!b) return;
    b.vx += ix;
    b.vy += iy;
  }
}

export function newSPhysicsLite(
  ...args: ConstructorParameters<typeof SPhysicsLite>
): SPhysicsLite {
  return new SPhysicsLite(...args)
}
