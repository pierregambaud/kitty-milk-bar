class ServingHatch extends Component {
    constructor() {
        var w = W/10;
        var h = H/4;
        var x = W-w;
        var y = H/2-h/2;
        var iX = null;
        var iY = null;

        super(w,h,x,y,iX,iY);

        this.dishesSpots = [
            {x: this.x + this.w / 2, y: this.y + (this.h / 8), available: true},
            {x: this.x + this.w / 2, y: this.y + (this.h / 8) * 2, available: true},
            {x: this.x + this.w / 2, y: this.y + (this.h / 8) * 3, available: true},
            {x: this.x + this.w / 2, y: this.y + (this.h / 8) * 4, available: true},
            {x: this.x + this.w / 2, y: this.y + (this.h / 8) * 5, available: true},
            {x: this.x + this.w / 2, y: this.y + (this.h / 8) * 6, available: true}
        ];
    }

    draw() {
        ctx.fillStyle = `green`;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}