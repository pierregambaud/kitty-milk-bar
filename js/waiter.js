class Waiter extends DynamicComponent {
    constructor() {
        super(180,180,W/2,H/2,null,null,1,`waiter`,`isAvailable`);
        
        this.animated = false;
        this.currentAnimationFrame = 0;

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
        
        // function updateFrame() {
        //     this.currentAnimationFrame = ++(this.currentAnimationFrame) % this.imageCols;
        //     this.spriteX = this.currentAnimationFrame * this.spriteW;
        //     this.spriteY = 0 * this.spriteH;
        // }
        // updateFrame = updateFrame.bind(this);

        const updateFrame = () => {
            this.currentAnimationFrame = ++(this.currentAnimationFrame) % this.imageCols;
            this.spriteX = this.currentAnimationFrame * this.spriteW;
            this.spriteY = 0 * this.spriteH;
        }

        if(frames % 300 === 0) {
            this.animated = true;
        }

        if(this.animated && frames % 3 === 0) {
            updateFrame();
            count++;
            if(count === this.imageCols) {
                this.animated = false;
                count = 0;
            }
        }

        ctx.drawImage(this.image, this.spriteX, this.spriteY, this.spriteW, this.spriteH, this.x-this.w/2, this.y-this.h/2, this.w, this.h);
    }
}