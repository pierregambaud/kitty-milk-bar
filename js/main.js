let waiter;
let carpet;
let customers = [];
let tables = [];
let dishes = [];
let interactiveElements = [];
let waiterJournal = [];
let customersJournal = [];
let dishesJournal = [];
let gameover;
let money = 0;

const canvas = document.getElementById('game-board');
const canvasLeft = canvas.offsetLeft;
const canvasTop = canvas.offsetTop;
const ctx = document.querySelector('canvas').getContext('2d');
const W = ctx.canvas.width;
const H = ctx.canvas.height;
const menu = [{name: `Chocolate Milkshake`, color:`brown`}, {name: `Vanilla Milkshake`, color:`vanilla`}, {name: `Strawberry Milkshake`, color:`pink`}];

let kitchenTableWidth = W/10;
let kitchenTableHeight = H/4;


// draw canvas
function draw() {

    // ******** DRAWING ********
    // *************************
    ctx.clearRect(0,0,W,H);

    // welcome carpet
    carpet.draw();

    // draw kitchen table
    ctx.fillStyle = `green`;
    ctx.fillRect(W-kitchenTableWidth, H/2-kitchenTableHeight/2, kitchenTableWidth, kitchenTableHeight);

    // draw tables & seats
    tables.forEach(table => table.draw());

    // draw each dish checking its journal position (defaut: its own position)
    drawArray(`dishes`, dishes, dishesJournal);

    // draw each customer checking its journal position (defaut: its own position)
    drawArray(`customers`, customers, customersJournal);

    // draw waiter checking his journal position (defaut: his own position)
    if (waiterJournal.length !== 0) {
        waiter.moveTo(`waiter`, waiterJournal[0].x, waiterJournal[0].y);
    }
    waiter.draw();


    // ******** INTERACTIONS ********
    // ******************************

    // if waiter walks in the interaction zone of the carpet
    if(waiter.x === carpet.interactionX && waiter.y === carpet.interactionY) {
        customers[0].isFollowingWaiter = true; // update the isFollowingWaiter status of the first customer in the queue
    }

    // if customer is following the waiter
    if(customers[0].isFollowingWaiter === true) {
        tables.forEach(function (table) {
            if(waiter.x === table.interactionX && waiter.y === table.interactionY) { // if the waiter reaches the table
                customers[0].isFollowingWaiter = false;
                addToJournal(`customers`,table.chairX,table.chairY); // update the customers journal with the chair coordinates
            }
        })
        
        customers[0].follow(waiter,100);
    }


    // if waiter walks in the interaction zone of the carpet
    if(waiter.x === dishes[0].interactionX && waiter.y === dishes[0].interactionY) {
        dishes[0].isTakenByWaiter = true;
    }

    // if dish is "following" the waiter
    if(dishes[0].isTakenByWaiter === true) {
        tables.forEach(function (table) {
            if(waiter.x === table.interactionX && waiter.y === table.interactionY) { // if the waiter reaches the table
                if(customers[0].x === table.chairX && customers[0].y === table.chairY && dishes[0].name === customers[0].favoriteDish.name) { // check if there is a match between what is ordered (by the customer sitten on the chair of this table) and what is served
                    dishes[0].isTakenByWaiter = false;
                    console.log(`exactly the right table for this dish`);
                    addToJournal(`dishes`,table.dishX,table.dishY); // update the dishes journal with the dish coordinates
                } else {
                    console.log(`not the right table for this dish`);
                }
            }
        });

        dishes[0].follow(waiter,50);
    }
}

// listen to clicks
canvas.addEventListener('click', function(event) {
    var clickX = event.pageX - canvasLeft,
        clickY = event.pageY - canvasTop;
    console.log(`clic x: `,clickX,` y: `,clickY);

    // check if a validated interactive element has been clicked on
    function checkInteration(component,x,y) {
        if(x < component.surfaceRight && x > component.surfaceLeft && y < component.surfaceTop && y > component.surfaceBottom) {
            addToJournal(`waiter`, component.interactionX, component.interactionY);
        }
    }

    interactiveElements.forEach(element => checkInteration(element,clickX,clickY));
    
}, false);


// draw arrays
function drawArray(arrayName, array, journalArray) {
    if (journalArray.length !== 0) {
        array.forEach(function(el) {
            el.moveTo(arrayName,journalArray[0].x,journalArray[0].y);
            el.draw();
        });
    } else {
        array.forEach(function(el) {
            el.draw();
        });
    }
}


// update journal
function addToJournal(component,x,y) {
    switch(component) {
        case `waiter`:
            waiterJournal.push({x: x, y:y});
            break;
        case `customers`:
            customersJournal.push({x: x, y:y});
            break;
        case `dishes`:
            dishesJournal.push({x: x, y:y});
            break;
    }
    console.log(`1 event added to the ${component} journal`);
}

function removeFromJournal(component) {
    switch(component) {
        case `waiter`:
            waiterJournal.shift();
            break;
        case `customers`:
            customersJournal.shift();
            break;
        case `dishes`:
            dishesJournal.shift();
            break;
    }
    console.log(`1 event removed from the ${component} journal`);
}


// animations
let frames = 0;
function animLoop() {
    frames++;

    draw();
  
    if (!gameover) {
        requestAnimationFrame(animLoop);
    }
}


// fill interactive elements array
function pushToInteractivesElements(array) {
    array.forEach(element => interactiveElements.push(element))
}


function startGame() {
    waiter = new Waiter();
    carpet = new Carpet();

    // fill each component array
    customers.push(new Customer());
    tables.push(new Table(W/4, H/5));
    tables.push(new Table(3*W/4, H/5));
    tables.push(new Table(W/4, 4*H/5));
    tables.push(new Table(3*W/4, 4*H/5));
    dishes.push(new Dish(customers[0].favoriteDish));

    // fill interactiveElements array
    interactiveElements.push(waiter);
    interactiveElements.push(carpet);
    pushToInteractivesElements(customers);
    pushToInteractivesElements(tables);
    pushToInteractivesElements(dishes);
    
    requestAnimationFrame(animLoop);
}

startGame();