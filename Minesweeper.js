const grid = document.querySelector(".table");
const reset = document.querySelector(".button");
const face = document.querySelector(".face");
const bombsArray = new Array();

let revealedCellsCnt = 0;
let table = new Array(11);
let end = false;
let length = 9;

createTable();

function createTable() {
    for (let i = 0; i < table.length; ++i) {
        table[i] = new Array(11);
    }

    for (let i = 0; i < table.length; ++i) {
        const row = document.createElement("tr");
        for (let j = 0; j < table.length; ++j) {
            table[i][j] = document.createElement("td");
            table[i][j].onclick = function () {displayContent(i, j)};
            table[i][j].oncontextmenu = function () {flag(i , j); return false};  
            if (i > 0 && i < table.length - 1 && j > 0 && j < table.length - 1) {
                row.appendChild(table[i][j]);
            }
        }
        if (i > 0 && i < table.length - 1) {
            grid.appendChild(row);
        }
    }
}

generateBombs(length);


function generateBombs(length) {
    for (let bombCnt = 1; bombCnt <= 16; ++bombCnt) {
        let i = Math.ceil(Math.random() * length);
        let j = Math.ceil(Math.random() * length);
        if (!bombsArray.includes(i * 10 + j)) {
            bombsArray.push(i * 10 + j);
            table[i][j].classList.add("bombCell"); 
        } else {
            --bombCnt;
        }
    }
}

cntNeighbourBombs();

function cntNeighbourBombs() {
    for (let i = 1; i < table.length - 1; ++i) {
        for (let j = 1; j < table.length - 1; ++j) {
            let bombsCnt = 0;
            const line = [i - 1, i - 1, i - 1, i, i, i + 1, i + 1, i + 1];
            const col =  [j - 1, j, j + 1, j - 1, j + 1, j - 1, j, j + 1];
            for (let k = 0; k <= 7; ++k) {
                if (line[k] != 0 && line[k] != table.length - 1 && col[k] != 0 && col[k] != table.length - 1) {
                    if (table[line[k]][col[k]].classList.contains("bombCell")) {
                        ++bombsCnt;
                    }   
                }
            }
            if (!table[i][j].classList.contains("bombCell") && bombsCnt != 0) {
                table[i][j].id = bombsCnt;
                table[i][j].classList.add("digit"); 
            }
        }
    }
}

function flag(i , j) {
    if (!table[i][j].classList.contains("clicked") && 
    !table[i][j].classList.contains("flagged") && !end) {
        table[i][j].innerHTML = "<img src = 'flag.png' class = 'flag'/>";
        table[i][j].classList.add("flagged");
    } else if (!table[i][j].classList.contains("clicked") && !end) {
        table[i][j].innerHTML = "";
        table[i][j].classList.remove("flagged");
    }
}

function displayContent(i, j) {
    if (!end && !table[i][j].classList.contains("flagged") && !table[i][j].classList.contains("clicked")) {
        table[i][j].innerHTML = "";
        table[i][j].classList.add("clicked");
        if (table[i][j].classList.contains("bombCell")) {
            gameOver();
            table[i][j].style.backgroundColor = "red";
            const bombs = document.getElementsByClassName("bombCell");
            for (let k = 0; k < bombs.length; ++k) {
                if (!bombs[k].classList.contains("flagged")) {
                    bombs[k].innerHTML = "<img src = 'bomb.png' class = 'bomb'/>"; 
                    bombs[k].classList.add("clicked");
                }
            }
            const flags = document.getElementsByClassName("flagged");
            for (let k = 0; k < flags.length; ++k) {
                if (!flags[k].classList.contains("bombCell")){
                    flags[k].style.backgroundColor = "rgb(255, 153, 153)";
                }
            }
        } else if (table[i][j].classList.contains("digit")) {
            table[i][j].innerText = table[i][j].id;
            ++revealedCellsCnt;
        } else {
            table[i][j].classList.add("empty");
            displayEmptyCells(i, j);
            ++revealedCellsCnt;
        } 
    }
    if (revealedCellsCnt === 65) {
        gameWon();
    }  
}

function displayEmptyCells(x, y) {
    let endDisplay = false, axisCnt = 1;
    let axisLine = [x];
    let axisCol = [y];
    while (!endDisplay) {
        let emptyNeighbCnt = 0;
        const emptyNeighbLine = new Array (), emptyNeighbCol = new Array();
        for (let g = 0; g < axisCnt; ++g) {
            let i = axisLine[g], j = axisCol[g];
            const line = [i - 1, i, i + 1, i + 1, i + 1, i, i - 1, i - 1];
            const col =  [j - 1, j - 1, j - 1, j, j + 1, j + 1, j + 1, j];
            for (let k = 0; k < 8; ++k) {
                if (line[k] != 0 && line[k] != table.length - 1 && col[k] != 0 && col[k] != table.length - 1 
                    && !table[line[k]][col[k]].classList.contains("clicked")) {
                        table[line[k]][col[k]].classList.add("clicked");
                        ++revealedCellsCnt;
                        if (table[line[k]][col[k]].classList.contains("flagged")) {
                            table[i][j].classList.remove("flagged");
                        }
                        if (table[line[k]][col[k]].classList.contains("digit")) {
                            table[line[k]][col[k]].innerText = table[line[k]][col[k]].id;
                        }
                }
            }  
            for (let k = 0; k < 8; ++k) {
                if (line[k] != 0 && line[k] != table.length - 1 && col[k] != 0 && col[k] != table.length - 1 
                    && !table[line[k]][col[k]].classList.contains("digit") 
                    && !table[line[k]][col[k]].classList.contains("empty")) {
                        table[line[k]][col[k]].classList.add("empty");
                        ++emptyNeighbCnt;
                        emptyNeighbLine.push(line[k]);
                        emptyNeighbCol.push(col[k]);
                }
            }
            if (g === axisCnt - 1) {
                axisCnt = emptyNeighbCnt;
                axisLine = emptyNeighbLine.slice();
                axisCol = emptyNeighbCol.slice();
            }   
        }
        if (axisCnt === 0) {
            endDisplay = true;
        }
    }
}

function gameOver () {
    end = true;
    face.src = "sad.png";
}

function gameWon() {
    end = true;
    face.src = "winner.png";
    const bombs = document.getElementsByClassName("bombCell");
    for (let k = 0; k < bombs.length; ++k) {
        if (!bombs[k].classList.contains("flagged")) {
            bombs[k].innerHTML = "<img src = 'flag.png' class = 'flag'/>";
        }
    }
}

function resetGame() {
    window.location.reload();
}

reset.addEventListener("click", resetGame);