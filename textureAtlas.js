class textureAtlas{
    constructor(texture,widths,height,offset = []){
      this.texture = texture;
      this.widths = widths;
      this.height = height;
      this.offset = offset;
      if (Array.isArray(widths)) {this.n = widths.lenght};
      if (Array.isArray(height)) {this.m = height.lenght};
    }
    sprite({x,y,i,j = 0,scale,flip})
    {
      if (!flip)
      {
        if (Array.isArray(this.widths))
        {
          if (Array.isArray(this.height))
          {
            var xpos = sumOfArray(this.widths[j],0,i);
            var ypos = sumOfArray(this.height,0,j);
            ctx.drawImage(this.texture,xpos,ypos,this.widths[j][i],this.height[j],x - this.offset[j].x,y - this.offset[j].y,this.widths[j][i]*scale,this.height[j]*scale)
          }
          else 
          {
            var pos = sumOfArray(this.widths,0,i);
            ctx.drawImage(this.texture,pos,0,this.widths[i],this.height,x,y,this.widths[i]*scale,this.height*scale)
          }
        }
        else 
        {
          var pos = (this.widths * pos) % this.n; 
          ctx.drawImage(this.texture,pos,0,this.widths,this.height,x,y,this.widths[i]*scale,this.height*scale)
        }
      }
      else
      {
        if (Array.isArray(this.widths))
        {
          if (Array.isArray(this.height))
          {
            var xpos = sumOfArray(this.widths[j],0,i);
            var ypos = sumOfArray(this.height,0,j);
            ctx.save()
            ctx.scale(-1,1)
            ctx.drawImage(this.texture,xpos,ypos,this.widths[j][i],this.height[j],-(x + player.a + this.offset[j].x) , y - this.offset[j].y,this.widths[j][i]*scale,this.height[j]*scale)
            ctx.restore()
          }
          else 
          {
            var pos = sumOfArray(this.widths,0,i);
            ctx.save()
            ctx.scale(-1,1)
            ctx.drawImage(this.texture,pos,0,this.widths[i],this.height,-(x+this.widths[i]*scale/2),y,this.widths[i]*scale,this.height*scale)
            ctx.restore()
          }
        }
        else 
        {
          var pos = (this.widths * pos) % this.n; 
          ctx.save()
          ctx.scale(-1,1)
          ctx.drawImage(this.texture,pos,0,this.widths,this.height,-(x+this.widths[i]*scale/2),this.widths[i]*scale,this.height*scale)
          ctx.restore()
        }
      }
    }
  }