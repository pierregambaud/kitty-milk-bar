class Customer extends Component {
    constructor() {
        super(40,40,W/6,H/2,40+W/6+150,H/2);
        this.isFollowingWaiter = false;
        this.isSeated = false;
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

    followWaiter() {
        var distanceBetweenPeople = 100;
        var destinationX;
        var destinationY;

        if(Math.abs(waiter.x-this.x) < distanceBetweenPeople && Math.abs(waiter.y-this.y) < distanceBetweenPeople) {
            console.log(`follows Waiter but waits for Waiter to move`);
        } else {
            // determine value for destinationX
            if(Math.abs(waiter.x-this.x) >= distanceBetweenPeople) {
                destinationX = waiter.x;
            } else {
                destinationX = this.x;
            }

            // determine value for destinationY
            if(Math.abs(waiter.y-this.y) >= distanceBetweenPeople) {
                destinationY = waiter.y;
            } else {
                destinationY = this.y;
            }

            this.moveTo(`customer`,destinationX, destinationY);
            console.log(`follows Waiter and moves toward him`);
        }
    }

    sitAtTheTable(table) {
        addToJournal(`customer`,table.chairX,table.chairY);
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