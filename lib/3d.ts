export class TranslatorIsometric3D {
    private viewport_x = 0;
    private viewport_y = 0;
    private viewport_w: number;
    private viewport_h: number;

    private worldWidth: number;
    private worldHeight: number;

    private pivotX: number;
    private pivotY: number;
    private pivotZ: number;

    private rotQuatW = 1;
    private rotQuatX = 0;
    private rotQuatY = 0;
    private rotQuatZ = 0;

    private scale = 1;
    private depthField = 0;

    constructor(width: number, height: number) {
        this.worldWidth = width;
        this.worldHeight = height;
        this.viewport_w = width;
        this.viewport_h = height;

        // mesa no plano X–Y, Z é altura
        this.pivotX = width / 2;
        this.pivotY = height / 2;
        this.pivotZ = 0;
    }

    public setPivot(x: number, y: number, z: number) {
        this.pivotX = x;
        this.pivotY = y;
        this.pivotZ = z;
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

    public setScale(s: number) {
        this.scale = s;
    }

    public setDepthField(d: number) {
        this.depthField = d;
    }

    public setQuatRotate(w: number, x: number, y: number, z: number) {
        this.rotQuatW = w;
        this.rotQuatX = x;
        this.rotQuatY = y;
        this.rotQuatZ = z;
    }

    public setEulerRotate(rx: number, ry: number, rz: number) {
        const cx = Math.cos(rx * 0.5), sx = Math.sin(rx * 0.5);
        const cy = Math.cos(ry * 0.5), sy = Math.sin(ry * 0.5);
        const cz = Math.cos(rz * 0.5), sz = Math.sin(rz * 0.5);

        this.rotQuatW = cx * cy * cz + sx * sy * sz;
        this.rotQuatX = sx * cy * cz + cx * sy * sz;
        this.rotQuatY = cx * sy * cz - sx * cy * sz;
        this.rotQuatZ = cx * cy * sz - sx * sy * cz;
    }

    public setIsometricRotation(yaw: number, pitch: number) {
        const hy = yaw * 0.5;
        const hp = pitch * 0.5;

        const cy = Math.cos(hy), sy = Math.sin(hy);
        const cp = Math.cos(hp), sp = Math.sin(hp);

        // q = qYaw(Z) * qPitch(X)
        this.rotQuatW = cy * cp;
        this.rotQuatX = sp * cy;
        this.rotQuatY = sp * sy;
        this.rotQuatZ = sy * cp;
    }

    public getQuatRotate() {
        return $multi(this.rotQuatW, this.rotQuatX, this.rotQuatY, this.rotQuatZ);
    }

    private rotateVecByQuat(x: number, y: number, z: number) {
        const qw = this.rotQuatW, qx = this.rotQuatX, qy = this.rotQuatY, qz = this.rotQuatZ;

        const tx = 2 * (qy * z - qz * y);
        const ty = 2 * (qz * x - qx * z);
        const tz = 2 * (qx * y - qy * x);

        return $multi(
            x + qw * tx + (qy * tz - qz * ty),
            y + qw * ty + (qz * tx - qx * tz),
            z + qw * tz + (qx * ty - qy * tx)
        );
    }

    public getXY(x: number, y: number, z: number) {
        x -= this.pivotX;
        y -= this.pivotY;
        z -= this.pivotZ;

        const [rx, ry, rz] = this.rotateVecByQuat(x, y, z);

        let projX = rx;
        let projY = ry;
        let depth = rz;

        if (this.depthField > 0) {
            const depthFactor = this.depthField / (this.depthField + depth);
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
        const [x1, y1] = this.getXY(x, y, z);
        const [x2, y2] = this.getXY(w, y, z);
        const [x3, y3] = this.getXY(w, h, z);
        const [x4, y4] = this.getXY(x, h, z);
        return $multi(x1, y1, x2, y2, x3, y3, x4, y4);
    }

    public getAxisXY(x: number, y: number, z: number, size: number) {
        const [ox, oy] = this.getXY(x, y, z);
        const [xx, xy] = this.getXY(x + size, y, z);
        const [yx, yy] = this.getXY(x, y + size, z);
        const [zx, zy] = this.getXY(x, y, z + size);
        return $multi(xx, xy, yx, yy, zx, zy, ox, oy);
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
