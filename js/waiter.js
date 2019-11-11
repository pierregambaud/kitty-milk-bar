class Waiter extends DynamicComponent {
    constructor() {
        var w = 180;
        var h = 180;
        var x = W/2;
        var y = 710; // same value as customer.y
        var iX = null;
        var iY = null;
        var id = 1;
        var name = `waiter`;
        var status = `isAvailable`;

        super(w,h,x,y,iX,iY,id,name,status);
        
        this.animated = false;
        this.animationFrequency = Math.floor(Math.random() * 400) + 200; // between 200 and 600 
        this.currentAnimationFrame = 0;
        this.animationCounter = 0;

        const waiterImage = document.createElement('img');
        waiterImage.onload = () => {
          this.image = waiterImage;
          this.imageW = 3200;
          this.imageH = 800;
          this.imageCols = 8;
          this.imageRows = 2;
          this.spriteX = 0;
          this.spriteY = 0;
          this.spriteW = this.imageW / this.imageCols;
          this.spriteH = this.imageH / this.imageRows;
        }
        waiterImage.src = './img/waiter.png';
    }

    draw() {
        if (!this.image) return; // if `this.img` is not loaded yet => don't draw

        const updateFrame = () => {
            this.currentAnimationFrame = ++(this.currentAnimationFrame) % this.imageCols;
            this.spriteX = this.currentAnimationFrame * this.spriteW;
            if(this.direction === `right`) {
                this.spriteY = 1 * this.spriteH; // tail left position
            } else {
                this.spriteY = 0 * this.spriteH; // tail right position
            }
        }

        if(frames % this.animationFrequency === 0) {
            this.animated = true;
        }

        if(this.animated) { 
            if(frames % 3 === 0) { // if animated, sprints
                updateFrame();
                this.animationCounter++;
                if(this.animationCounter === this.imageCols) {
                    this.animated = false;
                    this.animationCounter = 0;
                }
            }
        } else { // if not animated, just change tail position according to the direction
            if(this.direction === `right`) {
                this.spriteY = 1 * this.spriteH; // tail left position
            } else {
                this.spriteY = 0 * this.spriteH; // tail right position
            }
        }

        ctx.drawImage(this.image, this.spriteX, this.spriteY, this.spriteW, this.spriteH, this.x-this.w/2, this.y-this.h/2, this.w, this.h);
    }
}