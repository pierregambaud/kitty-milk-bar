class Dish extends DynamicComponent {
    constructor(dish) {
        super(25,25,W-kitchenTableWidth/2,H/2,25+W-kitchenTableWidth/2-150,H/2,`dish`);
        this.isTakenByWaiter = false;
        this.color = dish.color;
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