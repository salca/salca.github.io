function createEnemy({r,a,b,texture,flying=false,v=V(0,0),F=V(0,g),m=1,fillColor='red',edgeColor='black'}){

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
      texture: texture,
      draw(){
        // this.r.subtract(V(this.a/2,this.b/2))
        // drawRectangle(this)
        // this.r.add(V(this.a/2,this.b/2))
        drawSprite(this.texture,this.r,this.a,this.b)
      },
      move(dt){
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