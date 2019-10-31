class Plate extends DynamicComponent {
    constructor() {
        super(25,25,W-kitchenTableWidth/2,H/2,25+W-kitchenTableWidth/2-150,H/2);
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

    followWaiter() {
        var distanceBetweenPeople = 100;
        var destinationX;
        var destinationY;

        if(Math.abs(waiter.x-this.x) < distanceBetweenPeople && Math.abs(waiter.y-this.y) < distanceBetweenPeople) {
            console.log(`plate follows Waiter but waits for Waiter to move`);
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

            this.moveTo(`plates`,destinationX, destinationY);
            console.log(`plate follows Waiter and moves toward him`);
        }
    }
}