class Customer extends DynamicComponent {
    constructor(id) {
        // common with DynamicComponent
        var w = 180;
        var h = 180;
        var x = -100; // outsite the canvas
        var y = 710; // same value as lobby.y + distanceFromTopCarpet => aligned with the red carpet for its entry
        var iX = 420; // lobby.x + lobby.w + minimumDistanceFromRightBorder + 20
        var iY = y;
        var name = `customer` + id;
        var status = `isEnteringTheRestaurant`;

        super(w,h,x,y,iX,iY,id,name,status); // push to DynamicComponent

        // specific to customer
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
        
        this.tableId = null;
        this.favoriteDish = this.chooseDish();
        this.servedDishId = null;
        this.animated = false;
        this.animationFrequency = Math.floor(Math.random() * 500) + 300; // between 300 and 800 
        this.currentAnimationFrame = 0;
        this.animationCounter = 0;

        // speech bubble
        const bubbleImage = document.createElement('img');
        bubbleImage.onload = () => {
            this.bubbleImage = bubbleImage;
            this.bubbleW = 150;
            this.bubbleH = 150;
            this.bubbleRelativeX = this.bubbleW / 4; // need to add this.x when called
            this.bubbleRelativeY = - this.bubbleH; // need to add this.y when called
        }
        bubbleImage.src = './img/bubble.png';
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

    sayHello() {
        if (!this.bubbleImage) return

        let textMarginLeft = 75;
        let textMarginTop = 80;

        ctx.drawImage(this.bubbleImage, this.bubbleRelativeX + this.x, this.bubbleRelativeY + this.y, this.bubbleW, this.bubbleH);
        ctx.font = "bold 30px Open Sans";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText("meow", this.bubbleRelativeX + this.x + textMarginLeft, this.bubbleRelativeY + this.y + textMarginTop);

    }

    chooseDish() {
        var randomIndex = Math.floor(Math.random() * menu.length);
        return menu[randomIndex];
    }

    callWaiter() {
        if (!this.bubbleImage) return;

        var textMarginLeft = 75;
        var textMarginTop = 80;

        ctx.drawImage(this.bubbleImage, this.bubbleRelativeX + this.x, this.bubbleRelativeY + this.y, this.bubbleW, this.bubbleH);
        ctx.font = "bold 30px Open Sans";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText("meow!", this.bubbleRelativeX + this.x + textMarginLeft, this.bubbleRelativeY + this.y + textMarginTop);
    }

    showOrderedDish() {
        // ordered dish
        var orderedDishW = 100;
        var orderedDishH = 100;
        var orderedDishX = this.x + this.bubbleW/2 - 10;
        var orderedDishY = this.y - this.bubbleH + 20;
        var orderedDishSpriteX = 0;
        var orderedDishSpriteY = 0;
        var orderedDishSpriteW = 200;
        var orderedDishSpriteH = 200;

        const orderedDishImage = document.createElement('img');
        orderedDishImage.onload = () => {
        }
        orderedDishImage.src = './img/bowl.png';

        // display both
        if (!this.bubbleImage) return;
        if (!orderedDishImage) return;

        switch(this.favoriteDish.name) {
            case `Chocolate Milkshake` :
                orderedDishSpriteY = 0 * orderedDishSpriteH;
                break;
            case `Strawberry Milkshake` :
                orderedDishSpriteY = 1 * orderedDishSpriteH;
                break; 
            case `Vanilla Milkshake` :
                orderedDishSpriteY = 2 * orderedDishSpriteH;
                break;           
        }

        ctx.drawImage(this.bubbleImage, this.bubbleRelativeX + this.x, this.bubbleRelativeY + this.y, this.bubbleW, this.bubbleH);
        ctx.drawImage(orderedDishImage, orderedDishSpriteX, orderedDishSpriteY, orderedDishSpriteW, orderedDishSpriteH, orderedDishX, orderedDishY, orderedDishW, orderedDishH);
    }

    showNoMoreTableAvailable() {
        // no table available
        var noTableW = 80;
        var noTableH = 80;
        var noTableX = this.x + this.bubbleW/2 - 1;
        var noTableY = this.y - this.bubbleH + 23;

        const noTableImage = document.createElement('img');
        noTableImage.onload = () => {
        }
        noTableImage.src = './img/notable.png';

        // display both
        if (!this.bubbleImage) return;
        if (!noTableImage) return;

        ctx.drawImage(this.bubbleImage, this.bubbleRelativeX + this.x, this.bubbleRelativeY + this.y, this.bubbleW, this.bubbleH);
        ctx.drawImage(noTableImage, noTableX, noTableY, noTableW, noTableH);
    }
}