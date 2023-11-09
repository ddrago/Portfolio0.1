let raindropsNumber = 1000;
const rd = [];
let canvas;

function setup() {
  if (window.innerWidth < 1152) {
    canvas = createCanvas(
      window.innerWidth, 
      window.innerHeight
      );
  }
  else {
    canvas = createCanvas(
      window.innerWidth/2, 
      window.innerHeight
      );
  }

  canvas.parent('sketch-container');
  for (let i = 0; i < raindropsNumber; i++) {
    rd[i] = new RainDrop();
  }
}

function draw() {
  background(255);
  for (let i = 0; i < raindropsNumber; i++) {
    rd[i].display();
    rd[i].update();
  }
}

function windowResized() {
  if (window.innerWidth < 1152) {
    document.getElementById("demo").innerHTML = "1";
    resizeCanvas(
      window.innerWidth*2, 
      window.innerHeight
      );
  }
  else {
    document.getElementById("demo").innerHTML = "2";
    resizeCanvas(
      window.innerWidth/2, 
      window.innerHeight
      );
  }

}

class RainDrop {
  
  constructor() {
    this.x = random(width);
    this.y = random(-height, 0);
    this.sizeX = 5;
    this.sizeY = 20;
    this.l = int(random(5.99999));
    this.v = 10.0/(this.l+1.0);
  } 
  
  update() {
    this.y += this.v;
    if (this.y > height) {
      this.y = random(-20, 0); 
    }
  }
  
  display() {
    noStroke();
    switch(this.l){
      case 0:
        fill(200, 0, 200);
        rect(this.x, this.y, this.sizeX-this.l/2, this.sizeY-this.l);
        break;
      case 1:
        fill(200, 80, 200);
        rect(this.x, this.y, this.sizeX-this.l/2, this.sizeY-this.l);
        break;
      case 2:
        fill(200, 120, 200);
        rect(this.x, this.y, this.sizeX-this.l/2, this.sizeY-this.l);
        break;
      case 3: 
        fill(200, 140, 200);
        rect(this.x, this.y, this.sizeX-this.l/2, this.sizeY-this.l);
        break;
      case 4: 
        fill(200, 150, 200);
        rect(this.x, this.y, this.sizeX-this.l/2, this.sizeY-this.l);
        break;
      case 5: 
        fill(200, 155, 200);
        rect(this.x, this.y, this.sizeX-this.l/2, this.sizeY-this.l);
        break;
    }
  } 
}