class Hand{
  constructor(texture,a,b){
    this.r = V(0,0)
    this.v = V(0,0)
    this.texture = texture;
    document.addEventListener('mousemove',(e) =>{
    this.r.x = e.clientX/zoom;
    this.r.y = e.clientY/zoom;
    })
    this.a = a;
    this.b = b;
  }
  draw()
  {
    var d = this.r.minus(player.r.plus(V(-centerLoc,0)))
    this.r=d.setNorm(Math.min(handRange,d.norm())).plus(player.r).plus(V(-centerLoc,0))
    ctx.save()
    ctx.translate(this.r.x + centerLoc,this.r.y)
    ctx.rotate(d.angle() + 2.1)
    drawSprite(this.texture,V(0,0),this.a,this.b)
    ctx.restore()
  }
}