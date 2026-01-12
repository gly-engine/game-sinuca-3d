export class TranslatorIsometric3D {
    private viewport_x = 0;
    private viewport_y = 0;
    private viewport_w: number;
    private viewport_h: number;

    private worldWidth: number;
    private worldHeight: number;

    private rotX = 0;
    private rotY = 0;
    private rotZ = 0;

    private scale = 1;
    private fov = 0;

    constructor(width: number, height: number) {
        this.worldWidth = width;
        this.worldHeight = height;
        this.viewport_w = width;
        this.viewport_h = height;
    }

    public setViewPort(x: number, y: number, width: number, height: number) {
        this.viewport_x = x;
        this.viewport_y = y;
        this.viewport_w = width;
        this.viewport_h = height;
    }

    public getViewPort() {
        return $multi(this.viewport_x, this.viewport_y, this.viewport_w, this.viewport_h);
    }

    public setViewPortCentered(x: number, y: number, width: number, height: number) {
        const scale = width / this.worldWidth;
        const vpH = Math.round(this.worldHeight * scale);
        const vpY = (height - vpH) / 2;
        this.setViewPort(x, vpY, width, vpH);
    }

    public setRotateWorld(rx: number, ry: number, rz: number) {
        this.rotX = rx;
        this.rotY = ry;
        this.rotZ = rz;
    }

    public setScale(s: number) {
        this.scale = s;
    }

    public setFov(fov: number) {
        this.fov = fov;
    }

    public getXY(x: number, y: number, z: number) {
        const cosX = Math.cos(this.rotX), sinX = Math.sin(this.rotX);
        const cosY = Math.cos(this.rotY), sinY = Math.sin(this.rotY);
        const cosZ = Math.cos(this.rotZ), sinZ = Math.sin(this.rotZ);

        let y1 = y * cosX - z * sinX;
        let z1 = y * sinX + z * cosX;

        let x2 = x * cosY + z1 * sinY;
        let z2 = -x * sinY + z1 * cosY;

        let x3 = x2 * cosZ - y1 * sinZ;
        let y3 = x2 * sinZ + y1 * cosZ;

        let projX = x3;
        let projY = y3;

        let depth = z2;

        if (this.fov > 0) {
            const depthFactor = this.fov / (this.fov + depth);
            projX *= depthFactor;
            projY *= depthFactor;
        }

        projX *= this.scale;
        projY *= this.scale;

        const screenX = this.viewport_x + (projX / this.worldWidth) * this.viewport_w;
        const screenY = this.viewport_y + (projY / this.worldHeight) * this.viewport_h;

        return $multi(screenX + this.viewport_w / 2, screenY + this.viewport_h / 2);
    }

    public getQuadXY(x: number, y: number, w: number, h: number, z = 0) {
        const [x1, y1] = this.getXY(x, y, z)
        const [x2, y2] = this.getXY(w, y, z)
        const [x3, y3] = this.getXY(w, h, z)
        const [x4, y4] = this.getXY(x, h, z)
        return $multi(x1, y1, x2, y2, x3, y3, x4, y4)
    }

    public getAxisXY(x: number, y: number, z: number, size: number) {
        const [ox, oy] = this.getXY(x, y, z)
        const [xx, xy] = this.getXY(x + size, y, z)
        const [yx, yy] = this.getXY(x, y + size, z)
        const [zx, zy] = this.getXY(x, y, z + size)
        return $multi(ox, oy, xx, xy, yx, yy, zx, zy)
    }

    public getW(w: number) {
        return w * this.viewport_w / this.worldWidth * this.scale;
    }

    public getH(h: number) {
        return h * this.viewport_h / this.worldHeight * this.scale;
    }

    public getR(r: number) {
        const sx = (this.viewport_w / this.worldWidth) * this.scale;
        const sy = (this.viewport_h / this.worldHeight) * this.scale;
        return r * ((sx < sy) ? sx : sy);
    }
}

export function newTranslatorIsometric3D(...args: ConstructorParameters<typeof TranslatorIsometric3D>) {
    return new TranslatorIsometric3D(...args);
}
