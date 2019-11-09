class Customer extends DynamicComponent {
    constructor(id) {
        var w = 40;
        var h = 40;
        var x = 0;
        var y = H/2;
        var iX = w + W/6 + 150;
        var iY = H/2;
        var name = `customer` + id;
        var status = `isEnteringTheRestaurant`;

        super(w,h,x,y,iX,iY,id,name,status);

        this.favoriteDish = this.chooseDish();
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.arc(this.x, this.y, this.w, 0, Math.PI * 2);
        ctx.fillStyle = `yellow`;
        ctx.fill();
        ctx.stroke();
    }

    chooseDish() {
        var randomIndex = Math.floor(Math.random() * menu.length);
        return menu[randomIndex];
    }

    callWaiter() {
        ctx.fillStyle = "white";
        ctx.fillRect(this.x+40, this.y-100, 200, 90);
        ctx.font = "50px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText("please!", this.x+100+40, this.y+60-100);
    }
}