//COSTANTS 
const imageFrameBuffer = 100; //buffer space from window edge
let G;
const maxInitVelocity = 1; //maximum initial speed of each planet
const minmass = 5;
const maxmass = 10;

let newtonianCanvas;

let opacity;
let colorBank = new Array(3); //maybe it should be let, not const
let minBodiesNumber = 2;
let maxBodiesNumber = 8;

let system;
let bodiesNumber; //number of planets

function setup(){
    // contstants
    G = -random() * (1 - 0.5) + 0.5;
    opacity = random() * (10 - 2) + 2;
    bodiesNumber = floor(random() * (maxBodiesNumber - minBodiesNumber + 1)) + minBodiesNumber;

    generateColours();

    frameRate(30);
    system = new System(bodiesNumber);

    if (window.innerWidth < 1152) {
    rainCanvas = createCanvas(
        window.innerWidth, 
        window.innerHeight
        );
    }
    else {
    rainCanvas = createCanvas(
        window.innerWidth/2, 
        window.innerHeight
        );
    }

    rainCanvas.parent('newtonian-container');
    drawBackground(false);
}

function draw(){
    drawBackground(true);  //draw a background with a slight transparency to it
    push();
    translate(-system.centerOfMass().x+width/2, -system.centerOfMass().y+height/2);  //translate center of the canvas such that 
    //the center of mass is at the center
    system.update();  
    pop();
}

// function keyPressed(){
//     if(key == ' '){
//         generateColours();
//         bodiesNumber = int(random(minBodiesNumber, maxBodiesNumber));
//         system = new System(bodiesNumber);
//         drawBackground(false);
//     }
// }

function drawBackground(seethrough) {
    if (seethrough) {
        let backgroundColor = color(red(colorBank[0]), green(colorBank[0]), blue(colorBank[0]), opacity);
        background(backgroundColor);
    } else {
        background(colorBank[0]);
    }
    // canvasContext.fillRect(0, 0, canvas.width, canvas.height);
}

function randomAssign(colorBank, color1, color2, color3){
    let bodiesNumber = floor(random() * 2);
    switch(floor(random() * 3)){
    case 0: 
        colorBank[0] = color1;
        if(bodiesNumber == 0){
            colorBank[1] = color2;
            colorBank[2] = color3;
        }
        else {
            colorBank[1] = color3;
            colorBank[2] = color2;
        }
        break;
    case 1: 
        colorBank[0] = color2;
        if(bodiesNumber == 0){
            colorBank[1] = color1;
            colorBank[2] = color3;
        }
        else {
            colorBank[1] = color3;
            colorBank[2] = color1;
        }
        break;
    case 2: 
        colorBank[0] = color3;
        if(bodiesNumber == 0){
            colorBank[1] = color2;
            colorBank[2] = color1;
        }
        else {
            colorBank[1] = color1;
            colorBank[2] = color2;
        }
        break;
    }
}

function generateColours(){
    let colour1 = color(random(230, 255), random(50, 150), random(50, 150)); //random(100, 255), random(100, 255), random(100, 255)};
    let colour2 = color(random(230, 255), random(230, 255), random(20, 50)); //colour1[1], colour1[2], colour1[0]};
    let colour3 = color(random(20, 50), random(150, 220), random(230, 255)); //colour1[2], colour1[0], colour1[1]};
    
    randomAssign(colorBank, colour1, colour2, colour3);
}

class Body{
    
    constructor(choords, velocity, mass, size){
        this.choords = choords;
        this.velocity = velocity;
        this.acceleration = createVector(0, 0);
        this.mass = mass;
        this.radius = size; //make the radius proportional to the mass of the body
        this.gforcemag;
        this.gforcedir;
    }
    
    applyForce(force){
        // A = F/M
        this.acceleration.add(p5.Vector.div(force, this.mass));
    }
    
    gravitate(body){
        let force = p5.Vector.sub(this.choords, body.choords); 
        let distanceSquared = constrain(force.magSq(), 100, 1000); 
        //F = G*(M1*M2)/|D|^2
        force.setMag( G*this.mass*body.mass/distanceSquared );
        //print("distsq: ", distSq, ", force: ", G*this.mass*b.mass/distSq ,"\n");
        this.applyForce(force);
    }
    
    move(){
        this.velocity.add(this.acceleration);
        this.choords.add(this.velocity);
        this.acceleration.set(0, 0); 
    }
    
    display(){
        push();
        fill(colorBank[1]);
        stroke(colorBank[2]);
        circle(this.choords.x, this.choords.y, this.radius);
        pop();
    }
    
    update(body){
        this.gravitate(body);
        this.move();
    }
    
    printInfo(){
        print("x: ", this.choords[0], ", y: ", this.choords[1], ", mass: ", this.mass, ", r: ", this.radius, "\n");
    }
    
}

class System{
    
    constructor(n){
        this.bodies = new Array(n);
        const size = 70;

        for (let i = 0; i < n; i++){
            const mass = random(minmass, maxmass);
            const position = createVector(
                random(-width/2 + imageFrameBuffer, width/2 - imageFrameBuffer),
                random(-height/2 + imageFrameBuffer, height/2 - imageFrameBuffer));
            const velocity = createVector(
                random(-maxInitVelocity, maxInitVelocity), 
                random(-maxInitVelocity, maxInitVelocity));

            this.bodies[i] = new Body(position, velocity, mass, size);
        }
    }
    
    update() {
        for (let i = 0; i < this.bodies.length; i++){
            push();
            this.bodies[i].display();
            pop();
            for (let j = 0; j < this.bodies.length; j++){
            this.bodies[i].update(this.bodies[j]);
            }
        }
    }
    
    centerOfMass() {
        let Xsum = 0;
        let Ysum = 0;
        let Msum = 0;
        for (let i = 0; i < this.bodies.length; i++){
            let b = this.bodies[i];
            Xsum += b.mass*b.choords.x;
            Ysum += b.mass*b.choords.y;
            Msum += b.mass;
        }
        let COMx = Xsum/Msum;
        let COMy = Ysum/Msum;
        return createVector(COMx, COMy);
    }
}