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
    var d = this.r.minus(player.r.plus(V(-centerLoc.x,-centerLoc.y)))
    this.r=d.setNorm(Math.min(handRange,d.norm())).plus(player.r).plus(V(-centerLoc.x,-centerLoc.y))
    ctx.save()
    ctx.translate(this.r.x + centerLoc.x,this.r.y + centerLoc.y)
    ctx.rotate(d.angle() + 2.1)
    drawSprite(this.texture,V(0,0),this.a,this.b)
    ctx.restore()
  }
}