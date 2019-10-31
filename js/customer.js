class Customer extends DynamicComponent {
    constructor() {
        super(40,40,W/6,H/2,40+W/6+150,H/2,`customer`);
        this.isFollowingWaiter = false;
        this.isLeavingRestaurant = false;
        this.favoriteDish = this.chooseDish();
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

    chooseDish() {
        var randomIndex = Math.floor(Math.random() * menu.length);
        return menu[randomIndex];
    }

    callWaiter() {

    }

    eatDish() {
        setTimeout(function () {
            customers[0].isLeavingRestaurant = true;
            addToJournal(`customers`,-50,-50);
            console.log('customer leave table');
        }, 5000);
    }

    payBill() {

    }

    leaveRestaurant() {

    }
}