 function createPlaform({r,tileL,tileC,tileR,tileHeight=30,tileWidth=30,v=V(0,0),a,b=30,m=1,fillColor='gray',edgeColor='black'}){
  plat={    
    r: r,
    v: v,
    a: a-a%tileWidth,
    b: b,
    m: m,
    fillColor: fillColor,
    edgeColor: edgeColor,
    tileL: tileL,
    tileC: tileC,
    tileR: tileR,
    tileN: Math.floor(a/tileWidth) - 2,
    tileM: Math.floor(b/tileHeight),
    tileWidth: tileWidth,
    tileHeight: tileHeight,
    draw(){
      drawRectangle(this)
    },
    move(dt){
      this.r.add(this.v.times(dt))
    },
    drawPlatform(){
      if (this.tileL == this.tileC){
        for (var i = 0; i < this.tileN + 2; i++){
          for(var j = 0; j < this.tileM; j++){
            ctx.drawImage(this.tileC,this.r.x + (i)*this.tileWidth,this.r.y + j * this.tileHeight,tileWidth,tileHeight)
          }
        }
      }
      else 
      {
        ctx.drawImage(this.tileL,this.r.x,this.r.y)
        for (var i = 0; i < this.tileN; i++){
          ctx.drawImage(this.tileC,this.r.x + (i+1)*this.tileWidth,this.r.y,tileWidth,tileHeight)
        }
        ctx.drawImage(this.tileR,this.r.x + (this.tileN+1)*this.tileWidth,this.r.y)
      }
    }
  }
  return plat
}

function checkCollision(player){
  
  for (i in plats){
    plat=plats[i]
    if (i == player.walkState){
      if (( plat.r.x + plat.a <= player.r.x - player.a/2 ) ||
         ( plat.r.x >= player.r.x + player.a/2 )){
        player.walkState = 'air'
        continue
        }
    }
    if ( ( plat.r.x + plat.a <= player.r.x - player.a/2 ) ||
         ( plat.r.x >= player.r.x + player.a/2 ) ||
         ( plat.r.y >= player.r.y + player.b/2  ) ||
         ( plat.r.y + plat.b <= player.r.y - player.b/2)) {continue}
           
    if ( player.v.x > 0 ) {
      if ( player.v.y > 0){
        if (Math.abs( player.r.x + player.a/2 - plat.r.x ) > Math.abs( player.r.y + player.b/2 - plat.r.y)){
          //tla
          player.v.y = 0
          player.r.y = plat.r.y - player.b/2
          player.walkState = i
        }
        else {
          //levi zid
          player.v.x *= odboj
          player.r.x = plat.r.x - player.a/2
        }
      }
      else {
        if (Math.abs( player.r.x + player.a/2 - plat.r.x ) > Math.abs( player.r.y - player.b/2 - plat.r.y - plat.b)){
          //strop          
          player.v.y *= odboj
          player.r.y = plat.r.y + plat.b + player.b/2
        }
        else {
          //levi zid
          player.v.x *= odboj
          player.r.x = plat.r.x - player.a/2
        }
      }
    }
    else {
      if ( player.v.y >= 0){
        if ( Math.abs( player.r.x - player.a/2 - plat.r.x - plat.a ) > Math.abs( player.r.y + player.b/2 - plat.r.y ) ) {
          //tla
          player.v.y = 0
          player.r.y = plat.r.y - player.b/2
          player.walkState = i
        } else {
          //desni zid
          player.v.x *= odboj
          player.r.x = plat.r.x + plat.a + player.a/2
        }
      } else {
        if (Math.abs( player.r.x - player.a/2 - plat.r.x - plat.a ) > Math.abs( player.r.y - player.b/2 - plat.r.y - plat.b)){
          //strop          
          player.v.y *= odboj
          player.r.y = plat.r.y + plat.b + player.b/2      
        } else {

          //desni zid
          player.v.x *= odboj
          player.r.x = plat.r.x + plat.a + player.a/2    
        }
      }
    }
  }
}