function createEnemy2({r,a,b,texture,flying=false,v=V(0,0),F=V(0,g),m=1,fillColor='red',edgeColor='black'}){

    let enemy = {
      r: r,
      v: v,
      a: a,
      b: b,
      m: m,
      F: F,
      fillColor: fillColor,
      edgeColor: edgeColor,
      dead: false,
      flying: flying,
      text: new textureAtlas(texture, new Array(4).fill(182), 316),
      walkTimer : 0,
      walkFrame: 0,
      flip: false,
      draw(dt){
        // this.r.subtract(V(this.a/2,this.b/2))
        // drawRectangle(this)
        // this.r.add(V(this.a/2,this.b/2))
        if(this.v.x ==0)
        {
            this.walkFrame = 0;
            this.walkTimer = 0;
            this.text.sprite({x:this.r.x - this.a/2, y:this.r.y - this.b/2, i:0, j:0, scale:playerSize, flip:!this.flip})
        }
        else
        {
          this.walkTimer += dt;
          if (this.walkTimer >= 1/walkAniSpeed/Math.abs(this.v.x/maxxspeed))
          {
            this.walkFrame += 1;
            this.walkTimer = 0;
          }
          this.text.sprite({flip:!this.flip,x:this.r.x - this.a/2, y:this.r.y - this.b/2, i:this.walkFrame % 3 + 1 , j:0 , scale: playerSize })
        }
        // drawSprite(this.texture,this.r,this.a,this.b)
      },
      move(dt){
        if (this.v.x > 0) {this.flip=false}
        else if (this.v.x < 0) {this.flip=true}
        this.r.add(this.v.times(dt))
  
      },
      force(dt){
        if (this.flying){
          this.F = player.r.minus(enemy.r).setNorm(acc)
        } else {
          if (player.r.x > this.r.x && this.v.x < 0){
            this.F.x = acc
  
          } else if (player.r.x < this.r.x && this.v.x > 0){
            this.F.x =  -acc
          }
        }
  
        this.v.add(this.F.times(dt/this.m))
        if (this.v.x>0){this.v.x=Math.min(maxxspeed,this.v.x)}
        else {this.v.x=Math.max(-maxxspeed,this.v.x)}
        if (this.v.y>0){this.v.y=Math.min(maxyspeed,this.v.y)}
        else {this.v.y=Math.max(-maxyspeed,this.v.y)}
        // this.F.x=0
      },
  
    }
    return enemy
  }
  

  
  function checkEnemyCollison(){
    for (i in enemies){
      enemy = enemies[i]
      if (enemy.dead) {continue}
      if ( ( enemy.r.x + enemy.a/2 <= player.r.x - player.a/2 ) ||
          ( enemy.r.x - enemy.a/2 >= player.r.x + player.a/2 ) ||
          ( enemy.r.y - enemy.b/2 >= player.r.y + player.b/2  ) ||
          ( enemy.r.y + enemy.b/2 <= player.r.y - player.b/2)) {continue}
      if ( player.r.y + player.b/2 < enemy.r.y && player.v.y > 0)  {
        enemy.dead = true
        player.v.y = -jumpSpeed
      } else {reset()}
      
    }
  
  }