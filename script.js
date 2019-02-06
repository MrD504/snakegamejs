window.onload = function () {


    var container = {
        x: 0,
        y: 0
    }


    var foodsite = new Object();
    foodsite.x = 0;    //position of food "F" in the matrix
    foodsite.y = 0;

    var grid = [];

    var player = new Array();  //snake in our game - I named player - it is array
    player[0] = "O";    //the head portion of the snake - that is the blue box in game
    var playerlength = 0;
    position = [];  //this is the body part of the snake wher small o position is added it is red box in game



    rows = 20;
    columns = 20;


    let X = 0;
    let Y = 0;

    let right = true;
    let left = true;
    let up = true;
    let down = true;

    let foodEaten = false;


    let setRepeat;


    let count = 0;


    //keypress = [37, 38, 39, 40];




    let newGamePress = document.getElementById("newgame");
    let startDiv = document.getElementById("startGame");
    let endDiv = document.getElementById("endGame");
    let endnewGamePress = document.getElementById("newgamestart");
    let foodcounter = document.getElementById("foodcount");
    // let paragraph = document.getElementById("para");

    // let textAdd = `<p` + ` ` + `class=` + "highlight" + `>` + "this is testing" + `</p > `;

    // paragraph.innerHTML = textAdd;


    newGamePress.onclick = function () {
        beginGame();
    }

    endnewGamePress.onclick = function () {
        beginNewGame();
    }


    function beginGame() {
        startDiv.style.display = "none";
    }


    function beginNewGame() {
        endDiv.style.display = "none";
        container.x = 0;
        container.y = 0;
        position = [];
        playerlength = 0;
        X = 0;
        Y = 0;
        count = 0;
        foodcounter.innerHTML = count;


        foodposition(); //this random position of food is generated with this method
        formgrid("", rows, columns);//this creating two dimensional array with 20 rows and 20 columns filling with blank
        grid[container.x][container.y] = player[0]; //position of snake head
        grid[foodsite.x][foodsite.y] = "F"; //position of food F
        console.log(grid);

        let t = display();
        let firstchild1 = document.getElementById('container1').firstChild;
        let container1 = document.getElementById('container1');
        container1.replaceChild(t, firstchild1);

        startTimer();

    }


    function startTimer() {
        setRepeat = setInterval(game, 2000 / 10); //setInterval
    }


    function stopTimer() {
        clearInterval(setRepeat);
    }


    //food

    function foodposition() { //food "F" appears at random position in matrix using this method

        foodsite.x = Math.floor((Math.random()) * rows);
        foodsite.y = Math.floor((Math.random()) * columns);
        if (container.x === foodsite.x && container.y === foodsite.y) {
            foodposition();
        }

        if (playerlength > 0) {

            for (let i = 0; i < playerlength; i++) {
                if (position[i].x === foodsite.x && position[i].y === foodsite.y) {
                    foodposition();
                }
            }
        }
    }



    function formgrid(d, c, r) {
        grid = []; //step1:  create array

        for (var x = 0; x < c; x++) {
            grid.push([]);    //step2: push new array into it it looks like[[]] at index of grid there is []
            for (var y = 0; y < r; y++) {
                grid[x].push(d);          //into that index we push values
            }
        }
        console.log(d);
    }



    function display() {  //convert that two dimensional array into table element        

        var containertable = document.getElementById("container1");

        var table = document.createElement("table");
        table.style.width = 500 + 'px';
        table.style.height = 500 + 'px';
        // table.style.margin = 8 + 'px';

        for (var i = 0; i < grid.length; i++) {
            var row = table.insertRow();
            for (var j = 0; j < grid[i].length; j++) {
                var cell = row.insertCell();

                if (i === foodsite.x && j === foodsite.y) {

                    console.log("i j", i, j);
                    console.log("foodsite", foodsite.x, foodsite.y);

                    //console.log("grid match", i, j);

                    grid[i][j] = "";
                    cell.appendChild(document.createTextNode(grid[i][j]));
                    cell.setAttribute("class", "selectedfood");
                    //grid[i][j] = "F";

                } else if (grid[i][j] === 'O') {

                    grid[i][j] = "";
                    cell.appendChild(document.createTextNode(grid[i][j]));
                    cell.setAttribute("class", "selectedhead");
                } else if (grid[i][j] === 'o') {

                    grid[i][j] = "";
                    cell.appendChild(document.createTextNode(grid[i][j]));
                    cell.setAttribute("class", "selectedbody");
                } else {

                    cell.appendChild(document.createTextNode(grid[i][j]));
                }

            }

        }
        return table;

        // containertable.appendChild(table);
    }




    function game() { //setInterval

        if (container.y === rows) {  //when snake reaches end of the table to comes from the other side
            container.y = 0;
        }

        if (container.y < 0) {  //when snake reaches end of the table to comes from the other side
            container.y = rows - 1;
        }
        if (container.x === rows) {  //when snake reaches end of the table to comes from the other side
            container.x = 0;
        }
        if (container.x < 0) {  //when snake reaches end of the table to comes from the other side
            container.x = rows - 1;
        }


        if (playerlength >= 1) {  //when body part is added this executes


            let previousX = container.x;
            let previousY = container.y;


            container.x += X;
            container.y += Y;



            //to check if head touches the snake body part - game over
            for (let checkvalue = 0; checkvalue < playerlength; checkvalue++) {

                if (container.x == position[checkvalue].x && container.y == position[checkvalue].y) {
                    endDiv.style.display = "block";
                    stopTimer();
                    return;
                }
            }

            if (foodEaten === true) {

                formgrid("", 20, 20);
                grid[container.x][container.y] = player[0];
                grid[foodsite.x][foodsite.y] = "F";
                for (let prev = 0; prev < playerlength; prev++) {
                    // grid[position[prev].x][position[prev].y] = "o";
                    //let tempx = position[prev].x; //body0
                    //let tempy = position[prev].y;
                    grid[position[prev].x][position[prev].y] = "o";
                    //position[prev].x = previousX;
                    //position[prev].y = previousY;
                    //previousX = tempx;//head
                    //previousY = tempy;
                }

                let t = display();
                let firstchild1 = document.getElementById('container1').firstChild;
                let container1 = document.getElementById('container1');
                container1.replaceChild(t, firstchild1);
                foodEaten = false;
                return;

            }


            //here movement of head and body gets updated
            formgrid("", 20, 20);
            grid[container.x][container.y] = player[0];
            grid[foodsite.x][foodsite.y] = "F";
            for (let prev = 0; prev < playerlength; prev++) {
                // grid[position[prev].x][position[prev].y] = "o";
                let tempx = position[prev].x; //next position for next index element
                let tempy = position[prev].y;
                //grid[position[prev].x][position[prev].y] = "o";
                position[prev].x = previousX; //next position for first index element
                position[prev].y = previousY;
                grid[position[prev].x][position[prev].y] = "o";
                previousX = tempx;
                previousY = tempy;
            }

            let t = display();
            let firstchild1 = document.getElementById('container1').firstChild;
            let container1 = document.getElementById('container1');
            container1.replaceChild(t, firstchild1);


        } else {

            container.x += X;
            container.y += Y;
            console.log("I am working");
            console.log("snake y", container.y);
            formgrid("", rows, columns);   //only when head part is there 
            //formgrid means form two dimensional array with 20 rows and 20 columns and fill the cell with ""
            grid[container.x][container.y] = player[0];
            //console.log("grid", grid);
            grid[foodsite.x][foodsite.y] = "F";
            let t = display(); //new position of player
            let firstchild1 = document.getElementById('container1').firstChild; //previous position of player
            let container1 = document.getElementById('container1');
            container1.replaceChild(t, firstchild1);  //previous position replaced with new - ok           


        }

        //if (grid[container.x][container.y] == grid[foodsite.x][foodsite.y])
        if (container.x === foodsite.x && container.y === foodsite.y) {

            let nextx = container.x; //food position and snake head position same
            let nexty = container.y; //food position and snake head position same


            count = count + 1;


            foodcounter.innerHTML = count;

            foodEaten = true;

            foodposition(foodsite);//when snake eats food we need to generate food right foodposition method used
            grid[foodsite.x][foodsite.y] = "F";//this is food position
            player.push("o"); //we push small o that is the body part
            playerlength++; //increase the length by one

            //grid[nextx][nexty] = 'o';
            position.unshift({ x: nextx, y: nexty });//saved food position is moved to first position of position array


            // grid[container.x][container.y] = player[0];

            //grid[position[0].x][position[0].y] = 'o';

            // let t = display();
            // let firstchild1 = document.getElementById('container1').firstChild;
            // let container1 = document.getElementById('container1');
            // container1.replaceChild(t, firstchild1);




            console.log("position", position);
            console.log("palyer", player);
            console.log("grid after loop", grid);

        }
        // formgrid("", rows, columns);//this creating two dimensional array with 20 rows and 20 columns filling with blank
        // grid[container.x][container.y] = player[0]; //position of snake head
        // grid[foodsite.x][foodsite.y] = "F"; //position of food F
        // let t = display();
        // let firstchild1 = document.getElementById('container1').firstChild;
        // let container1 = document.getElementById('container1');
        // container1.replaceChild(t, firstchild1);
    }



    function keyPush(evt) {
        switch (evt.key) {
            case "ArrowRight":
                if (right === true) {
                    Y = 1; X = 0;
                    left = false;
                    up = true;
                    down = true;
                    console.log("inside key press", container.y);
                }
                break;
            case "ArrowLeft":
                if (left === true) {
                    Y = -1; X = 0;
                    right = false;
                    up = true;
                    down = true;
                }
                break;
            case "ArrowDown":
                if (down === true) {
                    Y = 0; X = 1;
                    up = false;
                    right = true;
                    left = true;
                }
                break;
            case "ArrowUp":
                if (up === true) {
                    Y = 0; X = -1;
                    down = false;
                    right = true;
                    left = true;
                }
                break;
        }

    }

    //this is the first step creating board and snake and food F

    foodposition(); //this random position of food is generated with this method
    formgrid("", rows, columns);//this creating two dimensional array with 20 rows and 20 columns filling with blank
    grid[container.x][container.y] = player[0]; //position of snake head
    grid[foodsite.x][foodsite.y] = "F"; //position of food F
    console.log(grid);
    var y = display();  //once two dimensional array is created it is converted to table
    var container1 = document.getElementById('container1');//div element in html container1
    container1.appendChild(y);//y is table that is attached to container1 div element    
    document.addEventListener("keydown", keyPush);//added eventlistener
    startTimer();

}







//var x = grid;






