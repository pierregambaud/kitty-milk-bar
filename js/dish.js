class Dish extends DynamicComponent {
    constructor(x,y,dishId,customerId,dish) {
        var w = 100;
        var h = 100;
        var iX = x;
        var iY = y - 50;
        var name = dish.name;
        var status = `isReadyToBeServed`;

        super(w,h,x,y,iX,iY,dishId,name,status);

        this.price = dish.price;
        this.customerId = customerId;
        this.currentAnimationFrame = 0;

        const bowlImage = document.createElement('img');
        bowlImage.onload = () => {
          this.image = bowlImage;
          this.imageW = 600;
          this.imageH = 600;
          this.imageCols = 3;
          this.imageRows = 3;
          this.spriteX = 0;
          this.spriteY = 0;
          this.spriteW = this.imageW / this.imageCols;
          this.spriteH = this.imageH / this.imageRows;
        }
        bowlImage.src = './img/bowl.png';
    }

    draw() {
        if (!this.image) return; // if `this.img` is not loaded yet => don't draw

        const updateFrame = () => {
            this.currentAnimationFrame = ++(this.currentAnimationFrame) % this.imageCols;

            switch(this.status) {
                case `isReadyToBeServed`:
                case `isTakenByWaiter` :
                    this.spriteX = 0 * this.spriteW;
                    break;
                case `isLaidOnTheRightTable` :
                    this.spriteX = 1 * this.spriteW;
                    break;
                case `isEmpty` :
                    this.spriteX = 2 * this.spriteW;
                    break;
            }

            switch(this.name) {
                case `Chocolate Milkshake` :
                    this.spriteY = 0 * this.spriteH;
                    break;
                case `Strawberry Milkshake` :
                    this.spriteY = 1 * this.spriteH;
                    break; 
                case `Vanilla Milkshake` :
                    this.spriteY = 2 * this.spriteH;
                    break;           
            }
        }

        updateFrame();
        ctx.drawImage(this.image, this.spriteX, this.spriteY, this.spriteW, this.spriteH, this.x-this.w/2, this.y-this.h/2, this.w, this.h);
    }
}