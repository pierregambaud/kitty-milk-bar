class Plate extends DynamicComponent {
    constructor() {
        super(25,25,W-kitchenTableWidth/2,H/2,25+W-kitchenTableWidth/2-150,H/2,`plate`);
        this.isTakenByWaiter = false;
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.arc(this.x, this.y, this.w, 0, Math.PI * 2);
        ctx.fillStyle = `black`;
        ctx.fill();
        ctx.stroke();
    }
}