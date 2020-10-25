class Hand{
  constructor(texture,a,b){
    this.r = V(player.r.x,player.r.y)
    this.v = V(0,0)
    this.texture = texture;
    this.a = a;
    this.b = b;
    this.rad = 30;
    this.grab = false;
    this.d = V(0,0);
    this.collcheck = 0;
    this.mmovex = 0;
    this.mmovey = 0;
    canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
    canvas.onclick = function() {
      if (!(document.pointerLockElement === canvas ||
        document.mozPointerLockElement === canvas) )
      {
        canvas.requestPointerLock();
      }
    };
    document.addEventListener('pointerlockchange', this.lockChangeAlert, false);
    document.addEventListener('mozpointerlockchange', this.lockChangeAlert, false);
  }
  
  lockChangeAlert() 
  {
    if (document.pointerLockElement === canvas ||
        document.mozPointerLockElement === canvas) 
    {
      // console.log('The pointer lock status is now locked');
      document.addEventListener("mousemove", hand.mousemove, true);
    } 
    else 
    {
      // console.log('The pointer lock status is now unlocked');  
      document.removeEventListener("mousemove", hand.mousemove, true);
    }
  }

  mousemove(e){
    hand.mmovex += e.movementX
    hand.mmovey += e.movementY
  }

  move(dt)
  {
    rx = this.r.x
    ry = this.r.y

    this.r.x += dr.x
    this.r.y += dr.y

    this.r.x += this.mmovex
    this.r.y += this.mmovey
    this.d = this.r.minus(player.r)
    this.r = this.d.setNorm(Math.min(handRange,this.d.norm())).plus(player.r)
    this.collcheck = Math.ceil(this.r.minus(V(rx,ry)).norm() / 30)
    // this.v.add(player.v)
    let hdr = this.r.minus(V(rx,ry))
    this.v = hdr.dividedBy(dt*this.collcheck)
    
    let rrx = this.r.x
    let rry = this.r.y

    if (this.collcheck != 0)
    {
      checkHandCollision(this,dt,rx,ry);
    }
    else 
    {
      this.v = V(0,0)
    }
    hdr = this.r.minus(V(rrx,rry))
    this.v = hdr.dividedBy(dt)
    // this.v = this.r.minus(V(rx,ry)).dividedBy(dt)
    // this.v.add(player.v)
    // this.v.x += dr.x/dt
    // this.v.y += dr.y/dt
    if (this.grab)
    {
      console.log(hdr,dr)
      player.walkState = 'air'
      // player.r.add(hdr.times(-1))
      player.v = hdr.times(-1);
      // player.v = V(this.mmovex,this.mmovey).dividedBy(-dt)
      player.move(dt)
      player.v = V(0,0)
      this.r.x = rx;
      this.r.y = ry;
      this.grab = false
    }
    this.mmovex = 0;
    this.mmovey = 0;
  }
  draw()
  {
    ctx.save()
    ctx.translate(this.r.x,this.r.y)
    ctx.rotate(hand.d.angle() + 2.1)
    drawSprite(this.texture,V(0,0),this.a,this.b)
    ctx.restore()
  }
}

function checkHandCollision(hand,dt,rx,ry){
  hand.r.x = rx
  hand.r.y = ry
  do
  {

    hand.r.add(hand.v.times(dt))
    hand.collcheck -= 1
    // console.log(hand.v)
    for (i in plats){
      plat=plats[i]
      if ( ( plat.r.x + plat.a <= hand.r.x - hand.a/2 ) ||
          ( plat.r.x >= hand.r.x + hand.a/2 ) ||
          ( plat.r.y >= hand.r.y + hand.b/2  ) ||
          ( plat.r.y + plat.b <= hand.r.y - hand.b/2)) {continue}
            
      if ( hand.v.x > 0 ) 
      {
        if ( hand.v.y >= 0)
        {
          if (Math.abs( hand.r.x + hand.a/2 - plat.r.x ) > Math.abs( hand.r.y + hand.b/2 - plat.r.y))
          {
            //tla
            hand.r.y = plat.r.y - hand.b/2
            hand.grab = true
          }
          else 
          {
            //levi zid
            hand.r.x = plat.r.x - hand.a/2
            hand.grab = true
          }
        }
        else 
        {
          if (Math.abs( hand.r.x + hand.a/2 - plat.r.x ) > Math.abs( hand.r.y - hand.b/2 - plat.r.y - plat.b))
          {
            //strop          
            hand.r.y = plat.r.y + plat.b + hand.b/2
            hand.grab = true
          }
          else 
          {
            //levi zid
            hand.r.x = plat.r.x - hand.a/2
            hand.grab = true
          }
        }
      }
      else 
      {
        if ( hand.v.y >= 0)
        {
          if ( Math.abs( hand.r.x - hand.a/2 - plat.r.x - plat.a ) > Math.abs( hand.r.y + hand.b/2 - plat.r.y ) ) 
          {
            //tla
            hand.r.y = plat.r.y - hand.b/2
            hand.grab = true
          } 
          else 
          {
            //desni zid
            hand.r.x = plat.r.x + plat.a + hand.a/2
            hand.grab = true
          }
        } 
        else 
        {
          if (Math.abs( hand.r.x - hand.a/2 - plat.r.x - plat.a ) > Math.abs( hand.r.y - hand.b/2 - plat.r.y - plat.b))
          {
            //strop          
            hand.r.y = plat.r.y + plat.b + hand.b/2      
            hand.grab = true
          } 
          else 
          {

            //desni zid
            hand.r.x = plat.r.x + plat.a + hand.a/2    
            hand.grab = true
          }
        }
      }
    }
    break;
  }
  while (hand.collcheck != 0);
}