class DynamicComponent extends Component {
    constructor(w,h,x,y,iX,iY) {
        super(w,h,x,y,iX,iY);
        this.isMoving = false;
    }

    moveTo(component,destinationX,destinationY) {
        var stepWidth = 10;

        // if component position closer than stepWidth value, then update position and finish moveTo
        if(Math.abs(destinationX-this.x) <= stepWidth && Math.abs(destinationY-this.y) <= stepWidth) {
            // interaction destination reached, and removed from array of destinations
            this.x = destinationX;
            this.y = destinationY;
            removeFromJournal(component);
        } else {
            // interaction destination not reached yet, updating x and y component
            if(Math.abs(destinationX-this.x) >= stepWidth) {
                if (destinationX > this.x) { 
                    this.x += stepWidth;
                } else {
                    this.x -= stepWidth;
                }
            } else {
                this.x = destinationX;
            }

            if(Math.abs(destinationY-this.y) >= stepWidth) {
                if (destinationY > this.y) { 
                    this.y += stepWidth;
                } else {
                    this.y -= stepWidth;
                }
            } else {
                this.y = destinationY;
            }
        } 
    }
}