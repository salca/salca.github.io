class textureAtlas{
    constructor(texture,widths,height){
      this.texture = texture;
      this.widths = widths;
      this.height = height;
      if (Array.isArray(widths)) {this.n = widths.lenght};
    }
    sprite({x,y,i,scale,flip}){
      if (!flip){
        if (Array.isArray(this.widths)){
          var pos = sumOfArray(this.widths,0,i);
          ctx.drawImage(this.texture,pos,0,this.widths[i],this.height,x,y,this.widths[i]*scale,this.height*scale)
        }
        else {
          var pos = (this.widths * pos) % this.n; 
          ctx.drawImage(this.texture,pos,0,this.widths,this.height,x,y,this.widths[i]*scale,this.height*scale)
        }
      }
      else{
        if (Array.isArray(this.widths)){
          var pos = sumOfArray(this.widths,0,i);
          ctx.save()
          ctx.scale(-1,1)
          ctx.drawImage(this.texture,pos,0,this.widths[i],this.height,-(x+this.widths[i]*scale/2),y,this.widths[i]*scale,this.height*scale)
          ctx.restore()
        }
        else {
          var pos = (this.widths * pos) % this.n; 
          ctx.save()
          ctx.scale(-1,1)
          ctx.drawImage(this.texture,pos,0,this.widths,this.height,-(x+this.widths[i]*scale/2),this.widths[i]*scale,this.height*scale)
          ctx.restore()
        }
      }
    }
  }