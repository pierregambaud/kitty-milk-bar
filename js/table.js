class Table extends Component {
    constructor(coordinates) {
        var w = 200;
        var h = 200;
        var x = coordinates.x;
        var y = coordinates.y;
        var iX = coordinates.x;
        var distanceFromTable = 20;
        var iY = coordinates.chairY+w/2+distanceFromTable;

        (coordinates.x>W/2) ? iX = coordinates.chairX-w/2-distanceFromTable : iX = coordinates.chairX+w/2+distanceFromTable; // personalize interaction X point according to left or right table location

        super(w,h,x,y,iX,iY);

        this.available = true;
        this.emptyTableX = x;
        this.emptyTableY = y;
        this.chairW = 300;
        this.chairH = 200;
        this.chairX = coordinates.chairX;
        this.chairY = coordinates.chairY;
        this.dishX = coordinates.chairX;
        this.dishY = coordinates.chairY + 40;
        this.hasMoney = false;
        this.moneyX = coordinates.x - 25;
        this.moneyY = coordinates.y - 70;

        const tableImage = document.createElement('img');
        tableImage.onload = () => {
          this.image = tableImage;
          this.imageW = w;
          this.imageH = h;
        }
        tableImage.src = './img/table.png';
    }

    draw() {
        if (!this.image) return; // if `this.img` is not loaded yet => don't draw

        ctx.drawImage(this.image, this.x-this.w/2, this.y-this.h/2, this.imageW, this.imageH);

        if(this.hasMoney) {
            // money
            ctx.fillStyle = "green";
            ctx.fillRect(this.moneyX, this.moneyY, 50, 20);
        }
    }
}