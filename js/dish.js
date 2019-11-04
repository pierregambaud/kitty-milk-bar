class Dish extends DynamicComponent {
    constructor(x,y,dishId,customerId,dish) {
        super(25,25,x,y,25+x-150,y,dishId,dish.name,`isReadyToBeServed`);
        this.name = dish.name;
        this.color = dish.color;
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