class Table extends Component {
    constructor(x,y) {
        var w = W/6;
        var h = W/6;
        var iY;
        
        var distanceFromTable = 20;
        (y>H/2) ? iY = y-w/2-distanceFromTable : iY = y+w/2+distanceFromTable; // personalize interaction Y point according to top or bottom table location

        super(w,h,x,y,x,iY);
        
        this.available = true;
        this.chairX = x - W/7;
        this.chairY = y;
        this.chairW = 30;
        this.dishX = x - 60;
        this.dishY = y;
        this.hasMoney = false;
        this.moneyX = x - 25;
        this.moneyY = y - 70;
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

        if(this.hasMoney) {
            // money
            ctx.fillStyle = "green";
            ctx.fillRect(this.moneyX, this.moneyY, 50, 20);
        }
    }
}