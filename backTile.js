class backTile{
  constructor({tileText,fillColor = 'blue', r,a,b,tileHeight=60,tileWidth=60}){
    this.fillColor=fillColor;
    this.r = r;
    this.a = a - a % tileWidth;
    this.b = b - b % tileHeight;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.tileX = a/tileWidth;
    this.tileY = b/tileHeight;
    this.tileText = tileText;
  }
  draw(){
    for (var i = 0; i < this.tileX; i++){
      for(var j = 0; j < this.tileY; j++){
        ctx.drawImage(this.tileText,this.r.x + i*this.tileWidth,this.r.y + j * this.tileHeight,this.tileWidth,this.tileHeight)
      }
    }
  }
}