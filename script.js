"use strict";
window.onload = function() {
  /* Assign DOM elements  */
  const newGamePress = document.getElementById("newgame");
  const startDiv = document.getElementById("startGame");
  const endDiv = document.getElementById("endGame");
  const endnewGamePress = document.getElementById("newgamestart");
  const foodcounter = document.getElementById("foodcount");
  const container1 = document.getElementById("container1");

  const Rows = 20;
  const Columns = 20;

  let snake = {};
  let container = new CoordConstructor();
  let foodLocation = new CoordConstructor(); //position of food "F" in the matrix
  let grid = [];

  let table = display(); //once two dimensional array is created it is converted to table
  document.getElementById("container1").appendChild(table); //y is table that is attached to container1 div element
  document.addEventListener("keydown", keyPressed); //added eventlistener

  function CoordConstructor() {
    this.x = 0;
    this.y = 0;
  }

  function resetSnake() {
    snake = {
      length: 0,
      body: ["0"],
      position: [] //this is the body part of the snake wher small o position is added it is red box in game
    };
  }

  // snake
  let X = 0;
  let Y = 0;

  let right = true;
  let left = true;
  let up = true;
  let down = true;

  let foodEaten = false;
  let setRepeat;
  let count = 0;

  newGamePress.onclick = function(event) {
    event.preventDefault();
    newGame();
  };

  endnewGamePress.onclick = function(event) {
    event.preventDefault();
    newGame();
  };

  function hideDivs() {
    startDiv.style.display = "none"; // hide startdiv on game start
    endDiv.style.display = "none"; // hide enddiv on game start
  }

  function newGame() {
    hideDivs();
    resetSnake(); // initialise snake
    foodposition(); //this random position of food is generated with this method
    resetBoard();

    foodposition(); //this random position of food is generated with this method
    grid[container.x][container.y] = snake.body[0]; //position of snake head
    grid[foodLocation.x][foodLocation.y] = "F"; //position of food F

    redrawTable();

    /* Do not start timer until player is ready to play */
    startTimer();

    /* dirty hack. make snake move right on start */
    keyPressed({ key: "ArrowRight" });
  }

  function redrawTable() {
    let table = display();
    let firstchild1 = container1.firstChild;
    container1.replaceChild(table, firstchild1);
  }

  function startTimer() {
    setRepeat = setInterval(game, 2000 / 10); //setInterval
  }

  function stopTimer() {
    clearInterval(setRepeat);
  }

  //food

  function foodposition() {
    //food "F" appears at random position in matrix using this method

    foodLocation.x = Math.floor(Math.random() * Rows);
    foodLocation.y = Math.floor(Math.random() * Columns);
    if (container.x === foodLocation.x && container.y === foodLocation.y) {
      foodposition();
    }

    if (snake.length > 0) {
      for (let i = 0; i < snake.length; i++) {
        if (
          snake.position[i].x === foodLocation.x &&
          snake.position[i].y === foodLocation.y
        ) {
          foodposition();
        }
      }
    }
  }

  function formgrid(d, c, r) {
    console.log(`d: ${d}, c: ${c}, r: ${r}`);
    grid = []; //step1:  create array

    for (let x = 0; x < c; x++) {
      grid.push([]); //step2: push new array into it it looks like[[]] at index of grid there is []
      for (let y = 0; y < r; y++) {
        grid[x].push(d); //into that index we push values
      }
    }
    console.log(d);
  }

  function display() {
    //convert that two dimensional array into table element

    let table = document.createElement("table");
    table.style.width = 500 + "px";
    table.style.height = 500 + "px";
    // table.style.margin = 8 + 'px';

    for (let i = 0; i < grid.length; i++) {
      let row = table.insertRow();
      for (let j = 0; j < grid[i].length; j++) {
        let cell = row.insertCell();

        if (i === foodLocation.x && j === foodLocation.y) {
          console.log("i j", i, j);
          console.log("foodLocation", foodLocation.x, foodLocation.y);

          //console.log("grid match", i, j);

          grid[i][j] = "";
          cell.appendChild(document.createTextNode(grid[i][j]));
          cell.setAttribute("class", "selectedfood");
          //grid[i][j] = "F";
        } else if (grid[i][j] === "O") {
          grid[i][j] = "";
          cell.appendChild(document.createTextNode(grid[i][j]));
          cell.setAttribute("class", "selectedhead");
        } else if (grid[i][j] === "o") {
          grid[i][j] = "";
          cell.appendChild(document.createTextNode(grid[i][j]));
          cell.setAttribute("class", "selectedbody");
        } else {
          cell.appendChild(document.createTextNode(grid[i][j]));
        }
      }
    }
    return table;
  }

  function overlapIfSnakeOutOfBounds() {
    if (container.y === Rows) {
      //when snake reaches end of the table to comes from the other side
      container.y = 0;
    }

    if (container.y < 0) {
      //when snake reaches end of the table to comes from the other side
      container.y = Rows - 1;
    }
    if (container.x === Rows) {
      //when snake reaches end of the table to comes from the other side
      container.x = 0;
    }
    if (container.x < 0) {
      //when snake reaches end of the table to comes from the other side
      container.x = Rows - 1;
    }
  }

  function setContainerPosition() {
    container.x += X;
    container.y += Y;
  }

  function ifSnakeCrashedEndGame() {
    for (let checkvalue = 0; checkvalue < snake.length; checkvalue++) {
      if (
        container.x == snake.position[checkvalue].x &&
        container.y == snake.position[checkvalue].y
      ) {
        endDiv.style.display = "block";
        stopTimer();
        return;
      }
    }
  }

  function handleLongSnake() {
    let previousX = container.x;
    let previousY = container.y;

    setContainerPosition();
    //check if head touches the snake body part - game over
    ifSnakeCrashedEndGame();

    if (foodEaten === true) {
      formgrid("", 20, 20);
      grid[container.x][container.y] = snake.body[0];
      grid[foodLocation.x][foodLocation.y] = "F";
      for (let prev = 0; prev < snake.length; prev++) {
        grid[snake.position[prev].x][snake.position[prev].y] = "o";
      }

      redrawTable();
      foodEaten = false;
      return;
    }

    //here movement of head and body gets updated
    setHeadAndFoodPosition();

    // draw snake trail to follow path of head
    for (let prev = 0; prev < snake.length; prev++) {
      const tempx = snake.position[prev].x; //next position for next index element
      const tempy = snake.position[prev].y;
      snake.position[prev].x = previousX; //next position for first index element
      snake.position[prev].y = previousY;
      grid[snake.position[prev].x][snake.position[prev].y] = "o";
      previousX = tempx;
      previousY = tempy;
    }

    redrawTable();
  }

  function setHeadAndFoodPosition() {
    // TODO: throws error when snake head overlaps edge of grid. Vertical only.
    formgrid("", Rows, Columns); //only when head part is there
    grid[container.x][container.y] = snake.body[0];
    grid[foodLocation.x][foodLocation.y] = "F";
  }

  /* main logic. Break in to simple functions to carry separate tasks.
    Try to keep things easy to follow */
  function game() {
    overlapIfSnakeOutOfBounds();

    if (snake.length >= 1) {
      handleLongSnake();
    } else {
      setContainerPosition();
      setHeadAndFoodPosition();
      redrawTable();
    }

    eatFood();
  }

  function eatFood() {
    if (container.x === foodLocation.x && container.y === foodLocation.y) {
      let nextx = container.x; //food position and snake head position same
      let nexty = container.y; //food position and snake head position same

      count++;

      foodcounter.innerHTML = count;

      foodEaten = true;

      foodposition(foodLocation); //when snake eats food we need to generate food right foodposition method used
      grid[foodLocation.x][foodLocation.y] = "F"; //this is food position
      snake.body.push("o"); //we push small o that is the body part
      snake.length++; //increase the length by one

      snake.position.unshift({ x: nextx, y: nexty }); //saved food position is moved to first position of position array
    }
  }
  function keyPressed(evt) {
    switch (evt.key) {
      case "ArrowRight":
        if (right === true) {
          Y = 1;
          X = 0;
          left = false;
          up = true;
          down = true;
          console.log("inside key press", container.y);
        }
        break;
      case "ArrowLeft":
        if (left === true) {
          Y = -1;
          X = 0;
          right = false;
          up = true;
          down = true;
        }
        break;
      case "ArrowDown":
        if (down === true) {
          Y = 0;
          X = 1;
          up = false;
          right = true;
          left = true;
        }
        break;
      case "ArrowUp":
        if (up === true) {
          Y = 0;
          X = -1;
          down = false;
          right = true;
          left = true;
        }
        break;
    }
  }

  //this is the first step creating board and snake and food F
  function resetBoard() {
    //this creating two dimensional array with 20 Rows and 20 Columns filling with blank
    formgrid("", Rows, Columns);
    grid[container.x][container.y] = snake.body[0]; //position of snake head
    grid[foodLocation.x][foodLocation.y] = "F"; //position of food F

    container = new CoordConstructor();
    X = 0;
    Y = 0;
    count = 0;
    foodcounter.innerHTML = count;
  }
};
