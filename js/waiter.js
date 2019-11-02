class Waiter extends DynamicComponent {
    constructor() {
        super(40,40,W/2,H/2,null,null,`waiter`,`isAvailable`);
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x,this.y);
        ctx.arc(this.x, this.y, this.w, 0, Math.PI * 2);
        ctx.fillStyle = `pink`;
        ctx.fill();
        ctx.stroke();
    }

    takeOrder() {
    }

    serveCustomer(plate) {

    }

    cleanTable() {

    }

    collectMoney() {

    }
}