/**
 * @file utils.ts
 * @author RodrigoDornelles
 * @date 2026-01-11
 */
import type { Translator2D } from '@gamely/sinuca-3d/2d'
import type { SBall, SPhisicsInterface } from '@gamely/sinuca-3d'

export function getCueXY2D(engine: SPhisicsInterface, render: Translator2D) {
    const balls = (engine as unknown as {balls: SBall[]}).balls;
    if (!balls[0]) return $multi(undefined, undefined);
    const cx = balls[0].x;
    const cy = balls[0].y;
    const tx = render.getX(cx)
    const ty = render.getY(cy)
    return $multi(tx, ty)
}
