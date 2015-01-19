// CreepsGroup = function (game) {

//     Phaser.Group.call(this, game);
//     var sprite = this.create(0, 0, 'creep');

// };

function preload() {
	game.load.image('creep', 'img/zergling.png');
    game.load.image('marine', 'img/tower_sized.png');
    game.load.image('background', 'img/background.jpg');
    game.load.image('path', 'img/path.png');
    game.load.image('button', 'img/start_button.png')
    game.load.image('end', 'img/command_center.png')
}

function create() {
	//  We're going to be using physics, so enable the Arcade Physics system
    //game.stage.scale.startFullScreen();
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    window.path = [];
    window.placed = [];

    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    // var scalex = 1920/screen.width;
    // var scaley = 1080/screen.height;

    // //  A simple background for our game
    background = game.add.sprite(0, 0, 'background');
    //background.scale.setTo(scalex, scaley);

    end = game.add.sprite(1920, 540, 'end');
    
    marine = game.add.sprite(1920, 1080, 'marine');
 
    ends = game.add.group();
    ends.enableBody = false;

    points = game.add.group();
    points.enableBody = false;

    //Setting Creeps group properties
    creeps = game.add.group();
    creeps.enableBody = true;
    creeps.physicsBodyType = Phaser.Physics.ARCADE;

    //Setting Towers group properties
    towers = game.add.group();
    towers.enableBody = true;
    //towers.body.immovable = true;
    towers.physicsBodyType = Phaser.Physics.ARCADE;
    
    button1 = game.add.button(game.world.centerX - 95, 400, 'button', actionOnClick, this, 2, 1, 0);

    button2 = game.add.button(game.world.centerX - 95, 100, 'button', search, this, 2, 1, 0);

    //Setting the onClick method
    game.input.onDown.add(placeTower, this);

    xLength = 16;
    yLength = 8;

    xMult = 120;
    yMult = 135;

    xCoords = new Array();
    yCoords = new Array();

    gridBackup = new PF.Grid(16, 8);

    //Creating grid coords
    for( i=0; i < yLength + 1; i++){
        yCoords.push(i * yMult);
    }

    for( i=0; i < xLength + 1; i++){
        xCoords.push(i * xMult);
    }
}

function search(){
    console.log("eh");
    var grid = gridBackup.clone();
    var finder = new PF.BestFirstFinder();
    finder.allowDiagonal = true;
    finder.dontCrossCorners = true;
    window.path = finder.findPath(0, 0, 15, 3, grid);
    window.pathAdj = Array(window.path.length);

    //console.log(path.length);
    for(i=0; i<path.length; i++){
        
        var end = ends.create(window.path[i][0]*xMult, window.path[i][1]*yMult, 'end');
        window.pathAdj[i] = window.path[i];

        window.pathAdj[i][0] = (xMult*path[i][0]);// + xMult/2;
        window.pathAdj[i][1] = (yMult*path[i][1]);// + yMult/2;
        console.log("ok");
    }
}

function update() {
    //game.physics.arcade.collide(creeps, creeps, collisionHandlerCC, null, this);
    //game.physics.arcade.collide(towers, creeps, collisionHandlerTC, null, this);
    
    creeps.forEachAlive(function(creep){

        tol = 10;

        if(creep.p >= window.pathAdj.length - 1){

            creep.kill();
        }
        else{
            if(Math.abs(creep.point[0] - creep.body.x) < tol){
                creep.body.x = creep.point[0];
            }
            if(Math.abs(creep.point[1] - creep.body.y) < tol){
                creep.body.y = creep.point[1];
            }
            if( Math.abs(creep.point[0] - creep.body.x) < tol && Math.abs( creep.point[1] - creep.body.y) < tol ){
                creep.p+=1;
                creep.point[0] = window.pathAdj[creep.p][0];
                creep.point[1] = window.pathAdj[creep.p][1];    
            }

            this.physics.arcade.moveToXY(creep, creep.point[0], creep.point[1], 500);
        }
    }, this);

    //this.physics.arcade.moveToXY(creep, point[0], point[1], 500);
}

function placeTower( pointer ){
    xLoc = 0;
    yLoc = 0;

    x = 0;
    y = 0;

    i=0;
    while( i < xCoords.length){
        if(pointer.x < xCoords[i]){
            x = i - 1;
            xLoc = xCoords[i-1];
            i=xCoords.length;
        }
        i++;
    }

    i=0;
    while( i < yCoords.length){
        if(pointer.y < yCoords[i]){
            y = i - 1;
            yLoc = yCoords[i-1];
            i=yCoords.length;
        }
        i++;
    }

    //if(){
        var tower = towers.create(xLoc, yLoc, 'marine');
        gridBackup.setWalkableAt(x, y, false);
        tower.body.immovable = true;
    //}
}

function actionOnClick () {
     for(i=0; i<yCoords.length; i++){
        var creep = creeps.create(0, i*yMult, 'creep');
        creep.body.velocity.x = 300;
        creep.body.collideWorldBounds = true;
        creepInit(creep);
    }
}

function creepInit(creep){
    dist = 9999;
    var point = [0,0];
    var p = 0;

    for(i=0; i<window.pathAdj.length; i++){
        
        x = window.pathAdj[i][0];
        y = window.pathAdj[i][1];
        a = Math.sqrt(x*x + y*y);

        if( a < dist){
            dist = a;
            point[0] = x;
            point[1] = y;
            p = i;
        }
    }
    creep.point = point;
    creep.p = p;
}

function collisionHandlerCC (creep1, creep2) {
    //creep1.body.bounce.setTo(1, .5);
    //creep2.body.bounce.setTo(1, .5);
}

function collisionHandlerTC (creep1, creep2) {
    
}

// CreepsGroup.prototype = Object.create(Phaser.Group.prototype);
// CreepsGroup.prototype.constructor = CreepsGroup;
var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
//var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update});

var game = new Phaser.Game(width, height, Phaser.AUTO, '', { preload: preload, create: create, update: update });
//game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT

