class Dish extends DynamicComponent {
    constructor(x,y,dishId,customerId,dish) {
        var w = 25;
        var h = 25;
        var iX = h + x - 150;
        var iY = y;
        var name = dish.name;
        var status = `isReadyToBeServed`;

        super(w,h,x,y,iX,iY,dishId,name,status);

        this.color = dish.color;
        this.price = dish.price;
        this.customerId = customerId;
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.arc(this.x, this.y, this.w, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.stroke();
    }
}