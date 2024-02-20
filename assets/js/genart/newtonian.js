//COSTANTS 
const imageFrameBuffer = 5; //buffer space from window edge
let G;
const maxInitVelocity = 1; //maximum initial speed of each planet
const minmass = 5;
const maxmass = 10;

let newtonianCanvas;

let opacity = 2;
let colorBank = new Array(3); //maybe it should be let, not const
let minBodiesNumber = 2;
let maxBodiesNumber = 6;
let windowWidth;
let windowHeight;

let system;
let maximumSystemSize = 500;
let bodiesNumber; //number of planets

// TODO
// It would be cool if the system reacted to the mouse being close to the planets. 
// So if the mouse hovers over the canvas, the planets are also react to its gravity! Which maybe could be "heavier". 

// TODO
// Every time a user presses the right button on the mouse while over the art or touches the art on a touchscreen the animation should re-start. 

function setup(){
    // contstants
    G = -random(0.5, 1);
    bodiesNumber = floor(random(minBodiesNumber, maxBodiesNumber));

    generateColours();

    frameRate(30);
    system = new System(bodiesNumber);

    if (window.innerWidth < 1152) {
        rainCanvas = createCanvas(
            window.innerWidth, 
            window.innerHeight
            );
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight
    }
    else {
    rainCanvas = createCanvas(
        window.innerWidth/2, 
        window.innerHeight
        );
        windowWidth = window.innerWidth/2;
        windowHeight = window.innerHeight
    }

    rainCanvas.parent('newtonian-container');
    drawBackground(false);
}

function draw(){
    drawBackground(true);  //draw a background with a slight transparency to it
    push();
    translate(windowWidth/2-system.centerOfMass().x, windowHeight/2-system.centerOfMass().y);  //translate center of the canvas such that 
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
    // canvasContext.fillRect(0, 0, canvas.windowWidth, canvas.windowHeight);
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
    let colour1 = color(27,200,254); //random(100, 255), random(100, 255), random(100, 255)};
    let colour2 = color(246,102,122); //colour1[1], colour1[2], colour1[0]};
    let colour3 = color(245,232,57); //colour1[2], colour1[0], colour1[1]};
    
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
        const size = 100;

        for (let i = 0; i < n; i++){
            const mass = random(minmass, maxmass);
            const position = createVector(
                random(0, maximumSystemSize),
                random(0, maximumSystemSize));
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