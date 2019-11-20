class DynamicComponent extends Component {
    constructor(w,h,x,y,iX,iY,id,name,status) {
        super(w,h,x,y,iX,iY);
        this.id = id;
        this.name = name;
        this.status = status;
        this.direction = `right`;
    }

    moveTo(componentName,journalEntryId,destinationX,destinationY) {
        var stepWidth = 10;

        // if component position closer than stepWidth value, then update position and finish moveTo
        if(Math.abs(destinationX-this.x) <= stepWidth && Math.abs(destinationY-this.y) <= stepWidth) {
            // interaction destination reached, and removed from array of destinations
            this.x = destinationX;
            this.y = destinationY;
            removeFromJournal(componentName,journalEntryId);
        } else {
            // interaction destination not reached yet, updating x and y component
            if(Math.abs(destinationX-this.x) >= stepWidth) {
                if (destinationX > this.x) { 
                    this.x += stepWidth;
                    this.direction = `right`;
                } else {
                    this.x -= stepWidth;
                    this.direction = `left`;
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

    follow(component,journalEntryId,distanceBetweenComponents) {
        var destinationX;
        var destinationY;

        if(Math.abs(component.x-this.x) < distanceBetweenComponents && Math.abs(component.y-this.y) < distanceBetweenComponents) {
        } else {
            // determine value for destinationX
            if(Math.abs(component.x-this.x) >= distanceBetweenComponents) {
                destinationX = component.x;
            } else {
                destinationX = this.x;
            }

            // determine value for destinationY
            if(Math.abs(component.y-this.y) >= distanceBetweenComponents) {
                destinationY = component.y;
            } else {
                destinationY = this.y;
            }

            this.moveTo(component,journalEntryId,destinationX,destinationY);
        }
    }
}