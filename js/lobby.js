class Lobby extends Component {
    constructor() {
        var w = 320;
        var h = 150;
        var x = 0;
        var y = 690;
        var iX = null;
        var iY = null;

        super(w,h,x,y,iX,iY);

        var minimumDistanceFromRightBorder = 80;
        var distanceBetweenSpot = 160;
        var distanceFromTopCarpet = 20;

        this.customersSpots = [
            {x: this.x + this.w - minimumDistanceFromRightBorder - distanceBetweenSpot*0, y: this.y + distanceFromTopCarpet, available: true},
            {x: this.x + this.w - minimumDistanceFromRightBorder - distanceBetweenSpot*1, y: this.y + distanceFromTopCarpet, available: true},
            {x: this.x + this.w - minimumDistanceFromRightBorder - distanceBetweenSpot*2, y: this.y + distanceFromTopCarpet, available: true},
            {x: this.x + this.w - minimumDistanceFromRightBorder - distanceBetweenSpot*3, y: this.y + distanceFromTopCarpet, available: true},
            {x: this.x + this.w - minimumDistanceFromRightBorder - distanceBetweenSpot*4, y: this.y + distanceFromTopCarpet, available: true},
            {x: this.x + this.w - minimumDistanceFromRightBorder - distanceBetweenSpot*5, y: this.y + distanceFromTopCarpet, available: true}
        ];
    }
}