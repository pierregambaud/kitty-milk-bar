let waiter;
let carpet;
let customers = [];
let tables = [];
let dishes = [];
let interactiveElements = [];
let waiterJournal = [];
let customersJournal = [];
let dishesJournal = [];
let timer = 0;
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


    // ******** CUSTOMER JOURNEY ********
    // **********************************
    if(customers[0]) {
        console.log(timer);
        switch(customers[0].status) {
            // 1: he arrives on the red carpet
            case `isEnteringTheRestaurant`: 
                customers[0].status = `isStandingInLine`;
                break;
            
            // 2. he waits for the waiter to seat him
            case `isStandingInLine`:
                // if waiter walks in the interaction zone of the carpet
                if(waiter.x === carpet.interactionX && waiter.y === carpet.interactionY) {
                    customers[0].status = `isFollowingTheWaiter`;
                }
                break;
            
            // 3. he follows the waiter
            case `isFollowingTheWaiter`:
                customers[0].follow(waiter,100);

                // if the waiter reaches one of the EMPTY tables while customer stops following him and goes for his chair
                tables.forEach(function (table) {
                    if(waiter.x === table.interactionX && waiter.y === table.interactionY) { 
                        addToJournal(`customers`,table.chairX,table.chairY); // update the customers journal with the chair coordinates
                        customers[0].status = `isSeating`;
                    }
                })
                break;
            
            // 4. he seats at the table
            case `isSeating`:
                // when the customer reaches his chair
                if(customers[0].x === tables[0].chairX && customers[0].y === tables[0].chairY) {
                    customers[0].status = `isReadingTheMenu`;
                } 
                break;
            
            // 5: he reads the menu
            case `isReadingTheMenu`:
                // after 5 seconds, call the waiter
                if(timer <= 300) {
                    timer++;
                } else { 
                    customers[0].status = `isWaitingToOrder`;
                    timer = 0;
                };
                break;
            
            // 6: once decided, he calls the waiter to order
            case `isWaitingToOrder`:
                // display "call waiter" notification
                customers[0].callWaiter();

                // if the waiter reaches the customer table
                if(waiter.x === tables[0].interactionX && waiter.y === tables[0].interactionY && customers[0].x === tables[0].chairX && customers[0].y === tables[0].chairY) {
                    customers[0].status = `isWaitingForTheDish`;
                }
                break;
            
            // 7: once ordered, he waits for the dish
            case `isWaitingForTheDish`:  
                // transmit to the kitchen the order
                if(dishes.length === 0) {
                    if(timer <= 300) {
                        timer++;
                    } else { // display the dish
                        dishes.push(new Dish(customers[0].favoriteDish));
                        pushToInteractivesElements(dishes);
                        timer = 0;
                    };
                } else {
                    // when waiter arrives to the interaction coordinates of the dish
                    if(waiter.x === dishes[0].interactionX && waiter.y === dishes[0].interactionY) {
                        dishes[0].status = `isTakenByWaiter`;
                    }

                    if(dishes[0].status === `isTakenByWaiter`) {
                        // when waiter arrives to the interaction coordinates of one of the tables
                        tables.forEach(function (table) {
                            if(waiter.x === table.interactionX && waiter.y === table.interactionY) { // if the waiter reaches the table
                                if(customers[0].x === table.chairX && customers[0].y === table.chairY && dishes[0].name === customers[0].favoriteDish.name) { // check if there is a match between what is ordered (by the customer sitten on the chair of this table) and what is served
                                    dishes[0].status = `isLaidOnTheRightTable`;
                                    console.log(`exactly the right table for this dish`);
                                    addToJournal(`dishes`,table.dishX,table.dishY); // update the dishes journal with the dish coordinates
                                } else {
                                    console.log(`not the right table for this dish`);
                                }
                            }
                        });
                        dishes[0].follow(waiter,50);
                    }

                    // when the plate is in front of the customer
                    if(dishes[0].x === tables[0].dishX && dishes[0].y === tables[0].dishY) {
                        customers[0].status = `isEating`;
                    } 
                }
                break;
            
            // 8: once served, he eats
            case `isEating`:
                if(timer <= 300) {
                    timer++;
                } else { // once dish eaten, the customer pays and leaves
                    dishes[0].status = `isEmpty`;
                    customers[0].status = `isLeavingRestaurant`;
                    addToJournal(`customers`,-50,-50);
                    timer = 0;
                };
                break;
            
            // 9: customer is leaving
            case `isLeavingRestaurant`:
                console.log('customer leaves table');
                if(customers[0].x === -50 && customers[0].y === -50) {
                    customers[0].status = `isGone`;
                    removeFromJournal();
                } 
                break;
            
            // 10: the money is collected and the table is cleaned by the 
            case `isGone`:
                console.log('customer is gone');
                break; 
        }
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

    // fill interactiveElements array
    interactiveElements.push(waiter);
    interactiveElements.push(carpet);
    pushToInteractivesElements(customers);
    pushToInteractivesElements(tables);
    
    requestAnimationFrame(animLoop);
}

startGame();