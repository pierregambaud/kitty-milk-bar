class Component {    
    constructor(w,h,x,y,iX,iY) {
        this.w = w;
        this.h = h;
        this.x = x;
        this.y = y;
        this.interactionX = iX;
        this.interactionY = iY;
        this.surfaceTop = this.y + this.h;
        this.surfaceRight = this.x + this.w;
        this.surfaceBottom = this.y - this.h;
        this.surfaceLeft = this.x - this.w;
    }
}