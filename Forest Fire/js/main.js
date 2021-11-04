const game = new Phaser.Game(3200, 3200, Phaser.CANVAS, 'He_Yuqi_PCC-CA', {
    preload: preload,
    create: create,
    update: update,
    render: render
});
const baseAlphaIncSpeed = 1;

// LOGIC FRAME
let frameCounter = LOGIC_FRAME_GAP;
let mode = GameMode.AUTO;
let keyDown = false;

let iterationID = 0,
    forest = [[]],
    forestBuf = [[]],
    isForest = true, // manipulate forest if true
    probLighting = 0.15,
    probBurn = 0.125,
    probGrowth = 0.9;


function preload() {
    game.load.spritesheet('cell', 'assets/images/states_(10x10).png', 10, 10);
}


function create() {

    // Set Cursor and Space Bar to interact
    cursors = game.input.keyboard.createCursorKeys();
    space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    let line;
    let bufLine;
    let cell;
    for (let i = 0; i < 30; i++) {
        line = [];
        bufLine = [];
        for (let j = 0; j < 30; j++) {
            line[j] = new Cell();
            bufLine[j] = new Cell();

            cell = game.add.sprite(70 + (10 + 3) * i, 20 + (10 + 3) * j, 'cell', 2);
            cell.animations.add('empty', [2], 10, true);
            cell.animations.add('tree', [0], 10, true);
            cell.animations.add('burn', [1], 10, true);

            cell.Pos_X = i;
            cell.Pos_Y = j;
        }

        forest[i] = line;
        forestBuf[i] = bufLine;
    }
}

function forestFireEvent() {
    if(cursors.up.isDown && !keyDown){
        if(mode === GameMode.AUTO){
            mode = GameMode.MANUAL;
        }else{
            mode = GameMode.AUTO;
        }
    }
  
    switch(mode){
        case GameMode.AUTO : iterate(); break;
        case GameMode.MANUAL : manualItr(); break;
    }

   

    displayBuffer(forest);
}

function manualItr(){
    if(cursors.down.isDown && !keyDown){
        iterate();
        keyDown = true;
    }

    if(!cursors.down.isDown && !cursors.up.isDown){
        keyDown = false;
    }
}

function iterate(){
    iterationID++;
    
    game.world.forEach(function() {
        const writeBuf = isForest ? forest : forestBuf;
        const readBuf = isForest ? forestBuf : forest;
        isForest = !isForest;

        let cellState;
        for (let row = 0; row < ROW; row++) {
            for (let col = 0; col < COL; col++) {
                cellState = writeBuf[row][col].state;

                switch (cellState) {
                    case Cellstate.EMPTY : {
                        if (growTree()) {
                            writeBuf[row][col].state = Cellstate.TREE;
                        }

                    }
                        break;

                    case Cellstate.TREE : {
                        if (lighting()) {
                            writeBuf[row][col].state = Cellstate.BURN;
                            writeBuf[row][col].burnRound = 3;
                        }

                        // Count Burning neighbour
                        let num = checkBurningTrees(readBuf, row, col);

                        if (catchOnFire(num)) {
                            writeBuf[row][col].state = Cellstate.BURN;
                            writeBuf[row][col].burnRound = 3;
                        }
                    }
                        break;

                    case Cellstate.BURN : {
                        if (writeBuf[row][col].burnRound === 0) {
                            writeBuf[row][col].state = Cellstate.EMPTY;
                        } else {
                            writeBuf[row][col].burnRound--;
                        }

                    }
                        break;
                }

            }
        }
    });
}

function growTree(){
    return Math.random() < probGrowth;
}

function catchOnFire(num){
    return Math.random() < probBurn * num;
}

function lighting(){
    return Math.random() < probLighting;
}

function checkBurningTrees(arr, row, col) {
    let neighborBurn = 0;
    for(let i = row - 1; i <= row + 1; i++){
        for(let j = col - 1; j <= col + 1 ; j++){
            if(i !== -1 && j !== -1 && i !== ROW && j !== COL){
                neighborBurn += arr[i][j].state === Cellstate.BURN ? 1 : 0;
            }
        }
    }

    return neighborBurn * probBurn;
}

function update() {
    if(frameCounter !== 0){
        frameCounter -- ;
    }else{
        frameCounter = LOGIC_FRAME_GAP;
        forestFireEvent();
    }

}


function render() {

    game.debug.text('Iteration ID: ' + iterationID, 180, 425);
    game.debug.text('Press “UP” button to switch on or off the manual mode.',9, 450);
    game.debug.text('Then press “Down” button to start iteration manually.',10, 470);
}


function displayBuffer(arr){
    game.world.forEach(function(cell) {
        let row = cell.Pos_X;
        let col = cell.Pos_Y;

        let state = arr[row][col].state;

        switch(state){
            case Cellstate.EMPTY : cell.animations.play('empty'); break;
            case Cellstate.TREE : cell.animations.play('tree'); break;
            case Cellstate.BURN : cell.animations.play('burn'); break;
        }
    });
}
