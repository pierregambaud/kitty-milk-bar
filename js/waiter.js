class Waiter extends Component {
    constructor() {
        super(40,40,W/2,H/2,0,0);
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x,this.y);
        ctx.arc(this.x, this.y, this.w, 0, Math.PI * 2);
        ctx.fillStyle = `pink`;
        ctx.fill();
        ctx.stroke();
    }

    seatCustomer() {
        customers[0].isFollowingWaiter = true;
    }

    takeOrder() {

    }

    takePlate() {

    }

    serveCustomer(plate) {

    }

    cleanTable() {

    }

    collectMoney() {

    }
}