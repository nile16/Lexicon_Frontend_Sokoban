var currentPos = {
    x: false,
    y: false,
};

var steps;

document
    .getElementById("restartGameBtn")
    .addEventListener("click", initilizeGame);

function initilizeGame() {
    var board = document.getElementById("board");

    document.addEventListener("keydown", keyPressed);

    document.getElementById("popup").style.display = "none";
    document.getElementById("stepCounterField").innerHTML = "0";

    steps = 0;
    board.innerHTML = "";
    board.style.height = tileMap01.height * 50 + "px";
    board.style.width = tileMap01.width * 50 + "px";

    for (var y = 0; y < tileMap01.height; y++) {
        for (var x = 0; x < tileMap01.width; x++) {
            var newDiv = document.createElement("div");

            newDiv.id = x + "_" + y;
            newDiv.classList.add("tile");

            switch (tileMap01.mapGrid[y][x][0]) {
                case " ": {
                    newDiv.classList.add("tile-Space");
                    break;
                }
                case "W": {
                    newDiv.classList.add("tile-Wall");
                    break;
                }
                case "B": {
                    newDiv.classList.add("tile-Space");
                    newDiv.classList.add("entity-block");
                    break;
                }
                case "G": {
                    newDiv.classList.add("tile-Goal");
                    break;
                }
                case "P": {
                    newDiv.classList.add("tile-Space");
                    newDiv.classList.add("entity-player");
                    currentPos.x = x;
                    currentPos.y = y;
                    break;
                }
            }

            board.appendChild(newDiv);
        }
    }
}

function keyPressed(event) {
    event.preventDefault();

    switch (event.key) {
        case "ArrowUp": {
            tryToMove({ x: 0, y: -1 });
            break;
        }
        case "ArrowDown": {
            tryToMove({ x: 0, y: 1 });
            break;
        }
        case "ArrowRight": {
            tryToMove({ x: 1, y: 0 });
            break;
        }
        case "ArrowLeft": {
            tryToMove({ x: -1, y: 0 });
            break;
        }
    }
}

function isWall(pos) {
    return tileClassList(pos).contains("tile-Wall");
}

function isBlock(pos) {
    return (
        tileClassList(pos).contains("entity-block") ||
        tileClassList(pos).contains("entity-block-goal")
    );
}

function isGoal(pos) {
    return tileClassList(pos).contains("tile-Goal");
}

function isFree(pos) {
    return !isWall(pos) && !isBlock(pos);
}

function targetPosPlayer(move) {
    return { x: currentPos.x + move.x, y: currentPos.y + move.y };
}

function targetPosBlock(move) {
    return { x: currentPos.x + move.x * 2, y: currentPos.y + move.y * 2 };
}

function tileClassList(pos) {
    return document.getElementById(pos.x + "_" + pos.y).classList;
}

function movePlayer(move) {
    tileClassList(currentPos).remove("entity-player", "entity-player-goal");
    
    if (isGoal(targetPosPlayer(move))) {
        tileClassList(targetPosPlayer(move)).add("entity-player-goal");
    } else {
        tileClassList(targetPosPlayer(move)).add("entity-player");
    }

    currentPos = targetPosPlayer(move);

    incSteps();
}

function moveBlock(move) {
    tileClassList(targetPosPlayer(move)).remove(
        "entity-block",
        "entity-block-goal"
    );

    if (isGoal(targetPosBlock(move))) {
        tileClassList(targetPosBlock(move)).add("entity-block-goal");
    } else {
        tileClassList(targetPosBlock(move)).add("entity-block");
    }
}

function incSteps() {
    document.getElementById("stepCounterField").innerHTML = ++steps;
}

function isGameWon() {
    return document.getElementsByClassName("entity-block").length == 0;
}

function displayWin() {
    document.removeEventListener("keydown", keyPressed);
    document.getElementById("popup").style.display = "block";
}

function tryToMove(move) {
    if (isFree(targetPosPlayer(move))) {
        movePlayer(move);
    } else if (isBlock(targetPosPlayer(move)) && isFree(targetPosBlock(move))) {
        moveBlock(move);
        movePlayer(move);
        if (isGameWon()) {
            displayWin("You Won!!!");
        }
    }
}

initilizeGame();
