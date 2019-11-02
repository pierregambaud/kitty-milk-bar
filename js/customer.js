class Customer extends DynamicComponent {
    constructor(id) {
        super(40,40,0,H/2,40+W/6+150,H/2,id,`customer`+id, `isEnteringTheRestaurant`);
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