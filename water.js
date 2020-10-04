class waterTile{
    constructor({alpha, fillColor = 'blue', r,a,b}){
      this.alpha=alpha;
      this.fillColor=fillColor;
      this.r=r;
      this.a=a;
      this.b=b;
    }
    draw(){
      ctx.globalAlpha = this.alpha;
      drawRectangle(this);
      ctx.globalAlpha = 1;
    }
  
  }
  
  function CollisionWater(player){
    Vol = 0;
    for (i in water){
      plat = water[i];
  
      levo = player.r.x + player.a/2 - plat.r.x;
      gor =  player.r.y + player.b/2 - plat.r.y;
      desno = plat.r.x + plat.a - (player.r.x - player.a/2);
      dol = plat.r.y + plat.b - (player.r.y - player.b/2);
      
      Vx = 0;
      Vy = 0;
      if (levo > 0 && desno > 0) {
          Vx = Math.min(levo,desno,player.a,plat.a)
      }
  
      if (dol > 0 && gor > 0) {
          Vy = Math.min(dol,gor,player.b,plat.b)
      }
  
      Vol += Vy * Vx;
    }
    return Vol
  }