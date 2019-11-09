class Customer extends DynamicComponent {
    constructor(id) {
        var w = 180;
        var h = 180;
        var x = 0;
        var y = H/2;
        var iX = w + W/6;
        var iY = H/2;
        var name = `customer` + id;
        var status = `isEnteringTheRestaurant`;

        super(w,h,x,y,iX,iY,id,name,status);

        this.favoriteDish = this.chooseDish();
        this.animated = false;
        this.currentAnimationFrame = 0;
        this.animationCounter = 0;

        const customerImage = document.createElement('img');
        customerImage.onload = () => {
          this.image = customerImage;
          this.imageW = 3200;
          this.imageH = 800;
          this.imageCols = 8;
          this.imageRows = 2;
          this.spriteX = 0;
          this.spriteY = 0;
          this.spriteW = this.imageW / this.imageCols;
          this.spriteH = this.imageH / this.imageRows;
        }
        customerImage.src = './img/customer.png';
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

        if(frames % 300 === 0) {
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

        // ctx.beginPath();
        // ctx.moveTo(this.x, this.y);
        // ctx.arc(this.x, this.y, this.w, 0, Math.PI * 2);
        // ctx.fillStyle = `yellow`;
        // ctx.fill();
        // ctx.stroke();
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