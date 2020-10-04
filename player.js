

function createPlayer({r,a,b,v=V(0,0),F=V(0,0),m=1,fillColor='red',edgeColor='black'}){
  let keysPressed = {}
  let keyState = {}
  let keyStateoff = {}

  document.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true
  })

  document.addEventListener('keyup', (event) => {
    keysPressed[event.key] = false
    keyState[event.key] = false
    keyStateoff[event.key] = true
  })
  let player = {
    r: r,
    v: v,
    a: a/2,
    b: b,
    m: m,
    F: F,
    walkTimer : 0,
    walkFrame: 0,
    fillColor: fillColor,
    edgeColor: edgeColor,
    walkState: 'air',
    duckState: false,
    flip: false,
    textAtWalk: new textureAtlas(walk,[84,87,84,87],120),
    textAtJump: new textureAtlas(jump,[48,102,144],153),

    draw(dt){
      
      this.r.subtract(V(this.a/2,this.b/2))
      drawRectangle(this)
      this.r.add(V(this.a/2,this.b/2))
      if (this.walkState != 'air'){
        if (this.v.x == 0){
          drawSprite(stance,V(this.r.x+this.a/2 - (this.flip ? this.a : 0),this.r.y),this.a*2,this.b,this.flip)
        } 
        else {
          this.walkTimer += dt;
          if (this.walkTimer >= 1/walkAniSpeed/Math.abs(v.x)){
            this.walkFrame += 1;
            this.walkTimer = 0;
          }
          this.textAtWalk.sprite({flip:this.flip,x:this.r.x-this.a/2, y:this.r.y-this.b/2, i:this.walkFrame % 4, scale: playerSize })
        }
      }
      else {
        if (v.y < -200){
          this.textAtJump.sprite({flip:this.flip,x:this.r.x-this.a/2+ (this.flip ? this.a/2 : 0), y:this.r.y-this.b/2, i:0, scale: playerSize })
        }
        else if (v.y < 100){
          this.textAtJump.sprite({flip:this.flip,x:this.r.x-this.a*1.6+ (this.flip ? this.a*2.1 : 0), y:this.r.y-this.b/2, i:1, scale: playerSize })
        }
        else{
          this.textAtJump.sprite({flip:this.flip,x:this.r.x-this.a*1.6+ (this.flip ? this.a*1.6 : 0), y:this.r.y-this.b/2, i:2, scale: playerSize })

        }
      }


    },
    move(dt){
      this.r.add(this.v.times(dt))
      if (this.v.x > 0) {this.flip=false}
      else if (this.v.x < 0) {this.flip=true}
      // document.getElementById('boxX').innerHTML=this.r.x.toFixed(2)
      // document.getElementById('boxY').innerHTML=this.r.y.toFixed(2)
      // document.getElementById('boxvX').innerHTML=this.v.x.toFixed()
      // document.getElementById('boxvY').innerHTML=this.v.y.toFixed()
      // document.getElementById('boxFX').innerHTML=this.F.x.toFixed()
      // document.getElementById('boxFY').innerHTML=this.F.y.toFixed()
    },
    force(dt){
      this.v.add(this.F.times(dt/this.m))
      if (this.v.x>0){this.v.x=Math.min(maxxspeed,this.v.x)}
      else {this.v.x=Math.max(-maxxspeed,this.v.x)}
      if (this.v.y>0){this.v.y=Math.min(maxyspeed,this.v.y)}
      else {this.v.y=Math.max(-maxyspeed,this.v.y)}
      // this.F.x=0
    },

    keyPress(){
      Vol = CollisionWater(this);
      if (keysPressed['w'] || keysPressed[' ']){ 
        if (this.walkState != 'air' && (!keyState[' '] || !keyState['w'])){
          //skok
          jump.restart() 
          jump.play()
          this.v.y -= jumpSpeed + vodaJumpSpeed * Vol;
          this.walkState = 'air'
          keyState[' '] = true
          keyState['w'] = true
        } 
      }

      if (keysPressed['s'] && !keyState['s'] && !this.duckState){
        //duck
        this.r.y = this.r.y + this.b/4
        centerLoc.y += this.b/4
        this.b /= 2
        keyState['s']=true
        this.duckState = true
      } 
      else if (keyStateoff['s']) {
        //odduck
        this.b *= 2
        centerLoc.y -= this.b/4
        this.r.y = this.r.y - this.b/4
        keyStateoff['s'] = false
        if (checkCollisonbool()){
          this.r.y = this.r.y + this.b/4
          centerLoc.y += this.b/4
          this.b /= 2
        } else {this.duckState = false}
      }
      if (keysPressed['a']) { 
        if (this.v.x > 0) { 
          if (this.walkState == 'air') {
            this.F.x = -acc*bremzair - Vol * vodaUpor * this.v.x}
          else {this.F.x = -acc*bremz - Vol * vodaUpor * this.v.x}
          }
        else {
          this.F.x = -acc - Vol * vodaUpor * this.v.x} 
      }
      else if (keyStateoff['a'])  {
        this.F.x = 0
        keyStateoff['a'] =  false
        }
      if (keysPressed['d']){ 
        if (this.v.x < 0) { 
          if (this.walkState == 'air') {this.F.x = acc*bremzair - Vol * vodaUpor * this.v.x }
          else {this.F.x = acc*bremz - Vol * vodaUpor * this.v.x }
           }
        else {this.F.x = acc - Vol * vodaUpor * this.v.x}
      } 
      else if (keyStateoff['d']) {
        this.F.x = 0
        keyStateoff['d'] = false
        }


      if (this.walkState != 'air') { 
        this.F.y = 0 
        if (!keysPressed['a'] && !keysPressed['d']){
          if (Math.abs(this.v.x) < 20) { this.v.x = 0 }
          else {this.v.x /= fric}
        }
      }
      else {
        if(keysPressed['w'] || keysPressed[' ']){this.F.y = jumpg - vzgon * Vol - Vol * vodaUpor * this.v.y }
        else {this.F.y = g - vzgon * Vol  - Vol * vodaUpor * this.v.y }
        }
      
    },
    duck(){
      if (!keysPressed['s'] && this.duckState){
        this.b *= 2
        centerLoc.y -= this.b/4
        this.r.y = this.r.y - this.b/4
        if (checkCollisonbool()){
          this.r.y = this.r.y + this.b/4
          centerLoc.y += this.b/4
          this.b /= 2
        } else {this.duckState = false}

      }
    }
  }
  return player
}