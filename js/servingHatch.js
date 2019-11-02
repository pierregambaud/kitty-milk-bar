class ServingHatch extends Component {
    constructor() {
        super(W/10,H/4,W-W/10,3*H/8,0,0);
        this.dishesSpots = [{x: this.x + this.w / 2, y: this.y + (this.h / 8), available: true},{x: this.x + this.w / 2, y: this.y + (this.h / 8) * 2, available: true},{x: this.x + this.w / 2, y: this.y + (this.h / 8) * 3, available: true},{x: this.x + this.w / 2, y: this.y + (this.h / 8) * 4, available: true},{x: this.x + this.w / 2, y: this.y + (this.h / 8) * 5, available: true},{x: this.x + this.w / 2, y: this.y + (this.h / 8) * 6, available: true}];
    }

    draw() {
        ctx.fillStyle = `green`;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}