class Customer extends DynamicComponent {
    constructor() {
        super(40,40,W/6,H/2,40+W/6+150,H/2,`customer`);
        this.isFollowingWaiter = false;
        this.favoriteFood;
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.arc(this.x, this.y, this.w, 0, Math.PI * 2);
        ctx.fillStyle = `yellow`;
        ctx.fill();
        ctx.stroke();
    }

    standInLine() {  

    }

    choosePlate() {

    }

    callWaiter() {

    }

    eatPlate() {

    }

    payBill() {

    }

    leaveRestaurant() {

    }
}