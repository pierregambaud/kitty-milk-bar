class ServingHatch extends Component {
    constructor() {
        super(W/10,H/4,W-W/10,3*H/8,0,0);
        this.dishesSpots = [{x: this.x + this.w / 2, y: this.y + (this.h / 8) , dish: null},{x: this.x + this.w / 2, y: this.y + (this.h / 8) * 2, dish: null},{x: this.x + this.w / 2, y: this.y + (this.h / 8) * 3, dish: null},{x: this.x + this.w / 2, y: this.y + (this.h / 8) * 4, dish: null},{x: this.x + this.w / 2, y: this.y + (this.h / 8) * 5, dish: null},{x: this.x + this.w / 2, y: this.y + (this.h / 8) * 6, dish: null}];
    }

    draw() {
        ctx.fillStyle = `green`;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    spotAvailable(index) {
        (this.dishesSpots[index] === null) ? `true` : `false`;
    }
}