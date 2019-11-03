class Lobby extends Component {
    constructor() {
        super(W/4,H/10,0,H/2-H/10/2,null,null);
        this.customersSpots = [{x: this.x + this.w - 50 - 80*0, y: this.y + this.w / 3, available: true},{x: this.x + this.w - 50 - 80*1, y: this.y + this.w / 3, available: true},{x: this.x + this.w - 50 - 80*2, y: this.y + this.w / 3, available: true},{x: this.x + this.w - 50 - 80*3, y: this.y + this.w / 3, available: true},{x: this.x + this.w - 50 - 80*4, y: this.y + this.w / 3, available: true},{x: this.x + this.w - 50 - 80*5, y: this.y + this.w / 3, available: true}];
    }

    draw() {
        ctx.fillStyle = `red`;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}