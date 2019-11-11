class ServingHatch extends Component {
    constructor() {
        var w = 500;
        var h = 30;
        var x = 0;
        var y = H-120;
        var iX = null;
        var iY = null;

        super(w,h,x,y,iX,iY);

        var distanceFromLeftCanvas = 100;
        var distanceBetweenDishes = 100;

        this.dishesSpots = [
            {x: this.x + distanceFromLeftCanvas, y: this.y + this.h / 2, available: true},
            {x: this.x + distanceFromLeftCanvas + distanceBetweenDishes * 1, y: this.y + this.h / 2 + 1, available: true},
            {x: this.x + distanceFromLeftCanvas + distanceBetweenDishes * 2, y: this.y + this.h / 2 + 2, available: true},
            {x: this.x + distanceFromLeftCanvas + distanceBetweenDishes * 3, y: this.y + this.h / 2 + 3, available: true},
            {x: this.x + distanceFromLeftCanvas + distanceBetweenDishes * 4, y: this.y + this.h / 2 + 4, available: true}
        ]; // +1 for each y to be sure the dish won't be taken by mistake by the waiter on its way to the first dishes

        const servingHatchImage = document.createElement('img');
        servingHatchImage.onload = () => {
          this.image = servingHatchImage;
          this.imageW = 624;
          this.imageH = 124;
          this.imageX = 0;
          this.imageY = H - this.imageH;
        }
        servingHatchImage.src = './img/servinghatch.png';
    }

    draw() { // draw it to hide waiter body when picking up a dish
        if (!this.image) return; // if `this.img` is not loaded yet => don't draw
        ctx.drawImage(this.image, this.imageX, this.imageY, this.imageW, this.imageH);
    }
}