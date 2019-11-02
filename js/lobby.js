class Lobby extends Component {
    constructor() {
        super(W/4,H/10,0,H/2-H/10/2,H/10 + 150,H/2);
    }

    draw() {
        ctx.fillStyle = `red`;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}