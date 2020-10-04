const zoom = 1.25;
// const width = 700;
// const height = 700;
const width = window.innerWidth/zoom
const height = window.innerHeight/zoom
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.style.transform = `scale(${zoom})`
canvas.style.transformOrigin = 'top left'
var plats = []
const odboj = -0.5
const maxyspeed = 500
const maxxspeed = 400
const bremz = 4
const bremzair = 3
const acc = 300
const g = 2000
const jumpg = 700
const jumpSpeed = 500
const vodaJumpSpeed = -0.05
const fric = 1.025
const playerSize = 0.75
const walkAniSpeed = 2e-2
const vzgon = 0.5;
const vodaUpor = 0.0008;
const handRange = 200;
var inverseParalaksa = false
var jumpState = 0
var centerLoc = V(0,0)
var playerPosold = V(0,0)
// document.body.style.overflow = "hidden"

canvas.width = width
canvas.height = height

var background = {}
var backgroundPos = {}
var paralaksa = {} 
var music
var frontPos = {}
var enemies = []
var water = []
var backTiles = []

function sumOfArray(arr,start,end){
  return arr.slice(start,end).reduce((a,b)=>a+b,0)
}

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
  this.loop = function(){
    this.sound.loop = true
  }
  this.restart = function(){
    this.sound.currentTime = 0
  }
}

function drawFront(dt){
  for (i in frontPos) {
    frontPos[i].add(V(player.v.x*paralaksa[i]*dt,player.v.y*dt))
    if (player.r.x - frontPos[i] > background[i].width) {
      frontPos[i] += background[i].width}
    else if (player.r.x - frontPos[i] < 0) {
      frontPos[i] -= background[i].width
    }
    ctx.drawImage(background[i],frontPos[i].x,frontPos[i].y)
    ctx.drawImage(background[i],frontPos[i].x-background[i].width,frontPos[i].y)
    ctx.drawImage(background[i],frontPos[i].x+background[i].width,frontPos[i].y)
  }
}

function drawBackground(dt){
  for (i in backgroundPos) {
    backgroundPos[i].add(V(player.v.x*paralaksa[i]*dt,player.v.y*dt))
    if (player.r.x - backgroundPos[i] > background[i].width) {
      backgroundPos[i] += background[i].width}
    else if (player.r.x - backgroundPos[i] < 0) {
      backgroundPos[i] -= background[i].width
    }
    ctx.drawImage(background[i],backgroundPos[i].x,backgroundPos[i].y)
    ctx.drawImage(background[i],backgroundPos[i].x-background[i].width,backgroundPos[i].y)
    ctx.drawImage(background[i],backgroundPos[i].x+background[i].width,backgroundPos[i].y)
  }
  
}

function drawSprite(texture,r,a,b,flip=false){
  if (flip){
    ctx.save()
    ctx.scale(-1,1)
    ctx.drawImage(texture,-(r.x-a/2)-a,r.y-b/2,a,b)
    ctx.restore()
  } 
  else {
    ctx.drawImage(texture,r.x-a/2,r.y-b/2,a,b)
  }
}

function createCollisionLine(r,line){
  proj=player.r.minus(r).clampedProj(line)
  return player.r.minus(r.plus(proj))
}

function checkCollisonbool(){
  for (i in plats){
    plat=plats[i]
    if ( !( ( plat.r.x + plat.a <= player.r.x - player.a/2 ) ||
        ( plat.r.x >= player.r.x + player.a/2 ) ||
        ( plat.r.y >= player.r.y + player.b/2  ) ||
        ( plat.r.y + plat.b <= player.r.y - player.b/2) ) ) {return true}
    
  }
  return false
}

function centerScreen(dt){
  ctx.translate(-player.v.x*dt,-player.v.y*dt)
  centerLoc.add(player.v.times(dt))
}

// function centerScreen(dt){
//   ctx.translate(-player.r.x + width/2 + centerLoc,0)
//   centerLoc = player.r.x - width/2
// }

function mod(a,n){
  return (a%n>=0) ? a%n : a%n + n
}

function reset(){
  player.r = V(width/2,200)
  player.v = V(0,0)
  ctx.resetTransform()
  centerLoc = V(0,0)
  for (i in backgroundPos) {
    backgroundPos[i] = 0
  }
  for (i in enemies){
    enemies[i].dead = false
  }
  
}

function loop(){
  player.r.x = mod(player.r.x,width) 
  // player.r.y = mod(player.r.y,height)
}

function drawRectangle({r,a,b,fillColor,edgeColor}){
  ctx.fillStyle = fillColor
  ctx.strokeStyle = edgeColor
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.rect(r.x,r.y,a,b)
  // ctx.stroke()
  ctx.fill()
}

function clearCanvas(){
  console.log(centerLoc.x,centerLoc.y)
  ctx.clearRect(centerLoc.x,centerLoc.y,width,height)
}


function draw(dt){
  clearCanvas()
  drawBackground(dt)
  for (i in backTiles){
    backTiles[i].draw()
  }
  player.draw(dt)
  hand.draw()
  for (i in enemies){
    if (enemies[i].dead) {continue}
    enemies[i].draw()
  }
  for (i in plats){
    plats[i].drawPlatform()
  }
  for (i in water){
    water[i].draw();
  }
  drawFront(dt)
}

function frame(dt){
  player.keyPress()
  player.force(dt)
  player.move(dt)
  centerScreen(dt)
  player.duck()
  for (i in enemies){
    if (enemies[i].dead) {continue}
    enemies[i].force(dt)
    enemies[i].move(dt)
  }
  checkEnemyCollison()
  if (player.r.y > height) {reset()}
  // loop()
  checkCollision(player)
  for (i in enemies){
    checkCollision(enemies[i])
  }
  draw(dt)
}

let previousTime=0
function animate(){
  let now = performance.now()
  let dt = now - previousTime
  previousTime = now
  dt /= 1000
  requestAnimationFrame(animate)
  frame(dt)
}

function setupSound(){
  music = new sound('assets/ambience.mp3')
  // music.play()
  // music.loop()
  jump = new sound('assets/jump.wav')
}

function setupImages(){
  background.back1=document.getElementById('back1')
  backgroundPos.back1 = V(0,0)
  background.back2=document.getElementById('back2')
  backgroundPos.back2 = V(0,0)
  background.back3=document.getElementById('back3')
  backgroundPos.back3 = V(0,0)
  background.back4=document.getElementById('back4')
  backgroundPos.back4 = V(0,0)
  background.front=document.getElementById('front')
  frontPos.front = V(0,0)
  tileR=document.getElementById('tileR')
  tileC=document.getElementById('tileC')
  tileL=document.getElementById('tileL')
  floorTile=document.getElementById('floorTile')
  stance=document.getElementById('stance1')
  walk=document.getElementById('walk')
  crouch=document.getElementById('crouch')
  jump=document.getElementById('jump')
  enemytext=document.getElementById('enemy')
  handtext=document.getElementById('hand')
  zid1=document.getElementById('zid1')

  if (!inverseParalaksa){
    paralaksa.back1 = 0.9
    paralaksa.back2 = 0.8
    paralaksa.back3 = 0.7
    paralaksa.back4 = 0.6
    paralaksa.front = -0.1

  } else {
    paralaksa.back1 = 0.1
    paralaksa.back2 = 0.2
    paralaksa.back3 = 0.3
    paralaksa.back4 = 0.4
    paralaksa.front = 1.1
  }

}
function setupLevel(){
  plats.push(createPlaform({r:V(-800,640),a:5000, b:60,tileWidth:60, tileHeight:60,tileL:floorTile,tileR:floorTile,tileC:floorTile}))
  plats.push(createPlaform({r:V(200,250),a:300,tileL:tileL,tileR:tileR,tileC:tileC}))
  plats.push(createPlaform({r:V(150,400),a:60,tileL:tileL,tileR:tileR,tileC:tileC}))
  plats.push(createPlaform({r:V(500,500),a:60,tileL:tileL,tileR:tileR,tileC:tileC}))
  plats.push(createPlaform({r:V(300,150),a:60,tileL:tileL,tileR:tileR,tileC:tileC}))
  plats.push(createPlaform({r:V(550,300),a:5000,tileL:tileL,tileR:tileR,tileC:tileC}))
  plats.push(createPlaform({r:V(-610,200),a:60, b:300,tileWidth:60, tileHeight:60,tileL:floorTile,tileR:floorTile,tileC:floorTile}))
  plats.push(createPlaform({r:V(-610,500),a:720, b:60,tileWidth:60, tileHeight:60,tileL:floorTile,tileR:floorTile,tileC:floorTile}))
  plats.push(createPlaform({r:V(50,200),a:60, b:300,tileWidth:60, tileHeight:60,tileL:floorTile,tileR:floorTile,tileC:floorTile}))

  backTiles.push(new backTile({tileText: zid1,fillColor: 'black', r: V(-550,140),a:600,b:360}))

  water.push(new waterTile({alpha: 0.5, r: V(-550,200),a:600, b:300}))
}

function setup(){
  player = createPlayer({r:V(width/2,height/2),a:28*3*playerSize,b:40*3*playerSize,fillColor:'black'})
  setupImages()
  setupLevel()
  setupSound()
  hand = new Hand(handtext,60,59)
  // enemies.push( createEnemy({texture: enemy,r:V(500,500), a:110,b:80,v:V(100,0)}) )
  // enemies.push( createEnemy({texture: enemy,r:V(400,500), a:110,b:80,v:V(100,0),flying : true}) )
}


setup()
animate()