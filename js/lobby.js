class Lobby extends Component {
    constructor() {
        var w = W/4;
        var h = H/10;
        var x = 0;
        var y = H/2-h/2;
        var iX = null;
        var iY = null;

        super(w,h,x,y,iX,iY);

        var minimumDistanceFromRightBorder = 80;
        var distanceBetweenSpot = 160;

        this.customersSpots = [{x: this.x + this.w - minimumDistanceFromRightBorder - distanceBetweenSpot*0, y: this.y + this.w / 3, available: true},{x: this.x + this.w - minimumDistanceFromRightBorder - distanceBetweenSpot*1, y: this.y + this.w / 3, available: true},{x: this.x + this.w - minimumDistanceFromRightBorder - distanceBetweenSpot*2, y: this.y + this.w / 3, available: true},{x: this.x + this.w - minimumDistanceFromRightBorder - distanceBetweenSpot*3, y: this.y + this.w / 3, available: true},{x: this.x + this.w - minimumDistanceFromRightBorder - distanceBetweenSpot*4, y: this.y + this.w / 3, available: true},{x: this.x + this.w - minimumDistanceFromRightBorder - distanceBetweenSpot*5, y: this.y + this.w / 3, available: true}];
    }

    draw() {
        ctx.fillStyle = `red`;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}