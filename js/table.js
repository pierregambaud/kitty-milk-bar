class Table extends Component {
    constructor(x,y) {
        var iY;
        (y>H/2) ? iY = y-W/6/2-80 : iY = y+W/6/2+80;

        super(W/6,W/6,x,y,x,iY);
        this.chairX = x - W/7;
        this.chairY = y;
        this.chairW = 30;
    }

    draw() {
        // table
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.arc(this.x, this.y, 100, 0, Math.PI * 2);
        ctx.fillStyle = `blue`;
        ctx.fill();
        ctx.stroke();

        // seat
        ctx.beginPath();
        ctx.moveTo(this.chairX, this.chairY);
        ctx.arc(this.chairX, this.chairY, 30, 0, Math.PI * 2);
        ctx.fillStyle = `orange`;
        ctx.fill();
        ctx.stroke();
    }
}