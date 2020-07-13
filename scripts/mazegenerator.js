//Script inicial
var alt = Math.floor((window.innerHeight / 10) * 0.7);
var lar = Math.floor(document.getElementById("maze").clientWidth / 10 - 2);
if (lar % 2 == 0) {
  lar--;
}
if (alt % 2 == 0) {
  alt--;
}
const compass = new Map([["up", [0, -2]], ["down", [0, 2]], ["left", [-2, 0]], ["right", [2, 0]]]);

var block = new Array(alt);
for (let i = 0; i < block.length; i++) {
  block[i] = new Array(lar);
}

const maze = document.getElementById('maze');
const table = document.createElement('table');
maze.appendChild(table);

for (let i = 0; i < alt; i++) {
  let row = document.createElement('tr');
  for (let j = 0; j < lar; j++) {
    block[i][j] = document.createElement('td');
    block[i][j].classList.add('block', 'wall', 'unvisited');
    row.appendChild(block[i][j]);
  }
  table.appendChild(row);
}
//fim do script inicial

window.onload = gerarLabirinto;
document.getElementById('gerarNovo').onclick = function() {
  limpaLabirinto();
  gerarLabirinto();
};
document.getElementById('mostrarCaminho').onclick = function() {
  encontraCaminho();
}

function gerarLabirinto() {
  let x = oddrand(lar);
  let y = oddrand(alt);
  visit(x, y);
  breakTheWall(x, y, lookAround(x, y));
  for (let i = 0; i < alt; i++) {
    if (block[i][1].classList.contains('path')) {
      block[i][1].classList.add('inicio');
      break;
    }
  }
  for (let i = alt-1; i > 0; i--) {
    if (block[i][lar-2].classList.contains('path')) {
      block[i][lar-2].classList.add('fim');
      break;
    }
  }
}

function limpaLabirinto() {
  for (let i = 0; i < alt; i++) {
    for (let j = 0; j < lar; j++) {
      block[i][j].classList.add('wall', 'unvisited');
      block[i][j].classList.remove('path', 'visited', 'inicio', 'fim', 'deadEnd', 'caminho');
    }
  }
}

function visit(x, y) {
  block[y][x].classList.remove('wall', 'unvisited');
  block[y][x].classList.add('path', 'visited');
}

function lookAround(x, y) {
  let count = 0;
  let ways = [];
  let hitWall;
  for (let [key, value] of compass) {
    if (x + value[0] < 1 || x + value[0] > lar -2 || y + value[1] < 1 || y + value[1] > alt -2) {
      hitWall = true;
    }else {
      hitWall = false;
    }

    if (!hitWall && block[y + value[1]][x + value[0]].classList.contains('unvisited')) {
      ways[count++] = key;
    }
  }
  return ways;
}

function breakTheWall(x, y, paths) {
  if (paths.length == 0) {
    return;
  }
  let path = paths[Math.floor(paths.length * Math.random())];
  for (let d of [2, 1]) {
    visit(x + compass.get(path)[0]/d, y + compass.get(path)[1]/d)
  }

  breakTheWall(x + compass.get(path)[0], y + compass.get(path)[1], lookAround(x + compass.get(path)[0], y + compass.get(path)[1]));
  breakTheWall(x + compass.get(path)[0], y + compass.get(path)[1], lookAround(x + compass.get(path)[0], y + compass.get(path)[1]));
}

function oddrand(max) {
  let a;
  do {
    a = Math.floor(max * Math.random());
  } while (a % 2 == 0);
  return a;
}

//Dead-end filling algorithm
function encontraCaminho() {
  let notDoneYet;
  do {
    notDoneYet = false;
    for (let i = 1; i < alt - 1; i++) {
      for (let j = 1; j < lar - 1; j++) {
        if (block[i][j].classList.contains('wall') || block[i][j].classList.contains('inicio') || block[i][j].classList.contains('fim') || block[i][j].classList.contains('deadEnd')) {
          continue;
        }else {
          block[i][j].classList.add('caminho');
        }
        let count = 0;
        for (let k of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
          if (block[i + k[0]][j + k[1]].classList.contains('wall') || block[i + k[0]][j + k[1]].classList.contains('deadEnd')) {
            count++;
          }
        }
        if (count == 3) {
          block[i][j].classList.add('deadEnd');
          block[i][j].classList.remove('caminho');
          notDoneYet = true;
        }
      }
    }
  } while (notDoneYet);
}
