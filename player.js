

function createPlayer({r,a,b,v=V(0,0),F=V(0,0),m=1,fillColor='red',edgeColor='black'}){
  var keysPressed = {}
  var keyState = {}
  var keyStateoff = {}

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
    a: 140*playerSize,
    b: 332*playerSize,
    m: m,
    F: F,
    walkTimer : 0,
    walkFrame: 0,
    fillColor: fillColor,
    edgeColor: edgeColor,
    walkState: 'air',
    duckState: false,
    flip: false,
    text: new textureAtlas(playertext,[new Array(8).fill(316),new Array(5).fill(285),new Array(3).fill(201),new Array(8).fill(201)], [341,341,314,395], [V(72,7),V(97,7),V(35,-18),V(46,0)]  ),

    draw(dt){
      
      // this.r.subtract(V(this.a/2,this.b/2))
      // drawRectangle(this)
      // this.r.add(V(this.a/2,this.b/2))
      if (this.walkState != 'air'){
        if (this.v.x == 0){
          this.text.sprite({x:this.r.x - this.a/2, y:this.r.y - this.b/2, i:0, j:0, scale:playerSize, flip:this.flip})
          this.walkFrame = 0;
          this.walkTimer = 0;
        } 
        else {
          this.walkTimer += dt;
          if (this.walkTimer >= 1/walkAniSpeed/Math.abs(this.v.x/maxxspeed))
          {
            this.walkFrame += 1;
            this.walkTimer = 0;
          }
          this.text.sprite({flip:this.flip,x:this.r.x - this.a/2, y:this.r.y - this.b/2, i:this.walkFrame % 6 + 2 , j:0 , scale: playerSize })
        }
      }
      else {
        if (v.y < -200){
          this.text.sprite({flip:this.flip,x:this.r.x-this.a/2, y:this.r.y-this.b/2, i:0, j:3, scale: playerSize })
        }
        else if (v.y < 100){
          this.text.sprite({flip:this.flip,x:this.r.x-this.a/2, y:this.r.y-this.b/2, i:1, j:3, scale: playerSize })
        }
        else{
          this.text.sprite({flip:this.flip,x:this.r.x-this.a/2, y:this.r.y-this.b/2, i:2, j:3, scale: playerSize })

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
      
      if (keysPressed['w'] || keysPressed[' '])
      { 
        if (this.walkState != 'air' && (!keyState[' '] || !keyState['w']))
        {
          //skok
          jump.restart() 
          jump.play()
          this.v.y = -jumpSpeed - vodaJumpSpeed * Vol;
          this.walkState = 'air'
          keyState[' '] = true
          keyState['w'] = true
        }
        else if (leftWallJump && (!keyState[' '] || !keyState['w']) )
        {
          jump.restart() 
          jump.play()
          this.v.x = -wallJump.x
          this.v.y = wallJump.y
          leftWallJump = false
          keyState[' '] = true
          keyState['w'] = true
        } 
        else if (rightWallJump && (!keyState[' '] || !keyState['w']) ) 
        {
          jump.restart() 
          jump.play()
          this.v.x = wallJump.x
          this.v.y = wallJump.y
          rightWallJump = false
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
      else if (keyStateoff['s']) 
      {
        //odduck
        this.b *= 2
        centerLoc.y -= this.b/4
        this.r.y = this.r.y - this.b/4
        keyStateoff['s'] = false

        if (checkCollisonbool())
        {
          this.r.y = this.r.y + this.b/4
          centerLoc.y += this.b/4
          this.b /= 2
        } 
        else {this.duckState = false}
      }

      
      if (keysPressed['a']) { 
        if (this.v.x > 0) 
        { 
          if (this.walkState == 'air') {this.F.x = -acc*bremzair - Vol * vodaUpor * this.v.x}
          else {this.F.x = -acc*bremz - Vol * vodaUpor * this.v.x}
        }
        else {this.F.x = -acc - Vol * vodaUpor * this.v.x} 
      }
      else if (keyStateoff['a'])  
      {
        this.F.x = 0
        keyStateoff['a'] =  false
      }

      if (keysPressed['d'])
      { 
        if (this.v.x < 0) 
        { 
          if (this.walkState == 'air') {this.F.x = acc*bremzair - Vol * vodaUpor * this.v.x }
          else {this.F.x = acc*bremz - Vol * vodaUpor * this.v.x }
        }
        else {this.F.x = acc - Vol * vodaUpor * this.v.x}
      }
      else if (keyStateoff['d']) 
      {
        this.F.x = 0
        keyStateoff['d'] = false
      }


      if (this.walkState != 'air') 
      { 
        this.F.y = 0 
        if (!keysPressed['a'] && !keysPressed['d'])
        {
          if (Math.abs(this.v.x) < 20) { this.v.x = 0 }
          else {this.v.x /= fric}
        }
      }
      else 
      {
        if(keysPressed['w'] || keysPressed[' ']) {this.F.y = jumpg - vzgon * Vol - Vol * vodaUpor * this.v.y }
        else {this.F.y = g - vzgon * Vol  - Vol * vodaUpor * this.v.y }
      }
    },

    duck(){
      if (this.duckState && !keysPressed['s'])
      {
        this.b *= 2
        centerLoc.y -= this.b/4
        this.r.y = this.r.y - this.b/4
        if (checkCollisonbool())
        {
          this.r.y = this.r.y + this.b/4
          centerLoc.y += this.b/4
          this.b /= 2
        } 
        else {this.duckState = false}
      }
    },
    Jumpfunc(dt){
      if ((keysPressed[' '] || keysPressed['w']) && (!keyState[' '] || !keyState['w']))
      {
        JumpTimer += dt
        if (JumpTimer > jumpTime)
        {
          keyState[' '] = true
          keyState['w'] = true
          JumpTimer = 0
        }  
      }
      if (leftWallJump || rightWallJump)
      {
        wallJumpTimer += dt
        if (wallJumpTimer > wallJumpTime)
        {
          leftWallJump = false
          rightWallJump = false
          wallJumpTimer = 0
        }
      }
      if (offEdgeJump)
      {
        offEdgeJumpTimer += dt
        if (keysPressed['w'] || keysPressed[' '])
        { 
          if ((!keyState[' '] || !keyState['w']))
          {
            //skok
            jump.restart() 
            jump.play()
            this.v.y = -jumpSpeed - vodaJumpSpeed * Vol;
            keyState[' '] = true
            keyState['w'] = true
            offEdgeJump = false
            offEdgeJumpTimer = 0
          }
        }
        if (offEdgeJumpTimer > offEdgeJumpTime)
        {
          offEdgeJump = false
          offEdgeJumpTimer = 0
        }
      }
    }
  }
  return player
}