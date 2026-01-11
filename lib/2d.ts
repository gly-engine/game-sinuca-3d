export class Translator2D {
    private width: number;
    private height: number;
    private viewport_w;
    private viewport_h;
    private viewport_x = 0;
    private viewport_y = 0;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.viewport_w = width;
        this.viewport_h = height;
    }

    public getViewPort() {
        return $multi(this.viewport_x, this.viewport_y, this.viewport_w, this.viewport_h);
    }

    public setViewPort(x: number, y: number, width: number, height: number) {
        this.viewport_x = x;
        this.viewport_y = y;
        this.viewport_w = width;
        this.viewport_h = height;
    }

    public setViewPortCentered(x: number, y: number, width: number, height: number) {
        const scale = width / this.width;
        const vpH = Math.round(this.height * scale);
        const vpY = (height - vpH) / 2;
        this.setViewPort(x, vpY, width, vpH);
    }

    public getX(x: number) {
        return this.viewport_x + (x * this.viewport_w / this.width);
    }

    public getY(y: number) {
        return this.viewport_y + (y * this.viewport_h / this.height);
    }

    public getW(w: number) {
        return w * this.viewport_w / this.width;
    }

    public getH(h: number) {
        return h * this.viewport_h / this.height;
    }

    public getR(r: number) {
        const sx = this.viewport_w / this.width;
        const sy = this.viewport_h / this.height;
        return r * ((sx < sy) ? sx : sy);
    }
}

export function newTranslator2D(
    ...args: ConstructorParameters<typeof Translator2D>
): Translator2D {
    return new Translator2D(...args)
}
