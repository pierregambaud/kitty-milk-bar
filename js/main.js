let waiter;
let lobby;
let servingHatch;
let tables = [];
let customers = [];
let numberOfCustomersCreated = 0;
let dishes = [];
let numberOfDishesCreated = 0;
let interactiveElements = [];
let waiterJournal = [];
let customersJournal = [];
let dishesJournal = [];
let gameover;
let timer = 0;
let money = 0;

const canvas = document.getElementById('game-board');
const canvasLeft = canvas.offsetLeft;
const canvasTop = canvas.offsetTop;
const ctx = document.querySelector('canvas').getContext('2d');
const W = ctx.canvas.width;
const H = ctx.canvas.height;
const menu = [{name: `Chocolate Milkshake`, color:`brown`}, {name: `Vanilla Milkshake`, color:`vanilla`}, {name: `Strawberry Milkshake`, color:`pink`}];


// draw canvas
function draw() {

    // ******** DRAWING ********
    // *************************
    ctx.clearRect(0,0,W,H);

    // welcome lobby
    lobby.draw();

    // draw serving hatch
    servingHatch.draw();

    // draw tables & seats
    tables.forEach(table => table.draw());

    // draw each dish checking its journal position (defaut: its own position)
    drawArray(`dishes`, dishes, dishesJournal);

    // draw each customer checking its journal position (defaut: its own position)
    drawArray(`customers`, customers, customersJournal);

    // draw waiter checking his journal position (defaut: his own position)
    if (waiterJournal.length !== 0) {
        waiter.moveTo(`waiter`, waiter.id, waiterJournal[0].x, waiterJournal[0].y);
    }
    waiter.draw();


    // ******** CUSTOMER JOURNEY ********
    // **********************************
    if(customers.length !== 0) { // if there is a least one customer
        customers.forEach(function(customer) {
            switch(customer.status) {
                // 1: he arrives on the red lobby
                case `isEnteringTheRestaurant`: 
                    // if the customer reaches his spot in the lobby
                    lobby.customersSpots.forEach(function(spot) {
                        if(spot.available && customer.x === spot.x && customer.y === spot.y) {
                            customer.status = `isStandingInLine`;
                        }
                    });
                    break;
                
                // 2. he waits for the waiter to seat him
                case `isStandingInLine`:
                    // if waiter walks in the interaction zone of the customer
                    if(waiter.x === customer.interactionX && waiter.y === customer.interactionY && waiter.status === "isAvailable") {
                        customer.status = `isFollowingTheWaiter`;
                        waiter.status = `isTakingCustomerToATable`;
                    }
                    break;
                
                // 3. he follows the waiter
                case `isFollowingTheWaiter`:
                    customer.follow(waiter,100);
                    lobby.customersSpots[0].available = true; // the first spot of the lobby is now available again

                    // if the waiter reaches one of the EMPTY tables while customer stops following him and goes for his chair
                    tables.forEach(function (table) {
                        if(waiter.x === table.interactionX && waiter.y === table.interactionY) { 
                            addToJournal(`customers`,customer.id,table.chairX,table.chairY); // update the customers journal with the chair coordinates
                            customer.status = `isSeating`;
                            waiter.status = `isAvailable`;
                            customer.interactionX = table.interactionX; // update the customer interaction X according to the table he is seaten
                            customer.interactionY = table.interactionY; // update the customer interaction Y according to the table he is seaten
                        }
                    });
                    break;
                
                // 4. he seats at the table
                case `isSeating`:
                    // when the customer reaches his chair
                    tables.forEach(function (table) {
                        if(customer.x === table.chairX && customer.y === table.chairY) {
                            customer.status = `isReadingTheMenu`;
                        }
                    });
                    break;
                
                // 5: he reads the menu
                case `isReadingTheMenu`:
                    // after 5 seconds, call the waiter
                    if(timer <= 300) {
                        timer++;
                    } else { 
                        customer.status = `isWaitingToOrder`;
                        timer = 0;
                    };
                    break;
                
                // 6: once decided, he calls the waiter to order
                case `isWaitingToOrder`:
                    // display "call waiter" notification
                    customer.callWaiter();

                    // if the waiter reaches the customer table
                    tables.forEach(function (table) {
                        if(waiter.x === table.interactionX && waiter.y === table.interactionY && customer.x === table.chairX && customer.y === table.chairY) {
                            customer.status = `isWaitingForTheDish`;
                            waiter.status = `isTakingTheCustomerOrder`;
                        }
                    });
                    break;
                
                // 7: once ordered, he waits for the dish
                case `isWaitingForTheDish`:
                    waiter.status = `isAvailable`;
                    // transmit to the kitchen the order
                    if(dishes.length === 0) {
                        if(timer <= 300) {
                            timer++;
                        } else { // display the dish
                            createNew(`dish`,customer.favoriteDish); // create and display a new dish

                            timer = 0;
                        }
                    } else {
                        // when waiter arrives to the interaction coordinates of the dish
                        if(waiter.x === dishes[0].interactionX && waiter.y === dishes[0].interactionY) {
                            dishes[0].status = `isTakenByWaiter`;
                            waiter.status = `isHoldingADish`;
                        }

                        if(dishes[0].status === `isTakenByWaiter`) {
                            // when waiter arrives to the interaction coordinates of one of the tables
                            tables.forEach(function (table) {
                                if(waiter.x === table.interactionX && waiter.y === table.interactionY) { // if the waiter reaches the table
                                    if(customer.x === table.chairX && customer.y === table.chairY && dishes[0].name === customer.favoriteDish.name) { // if there is a match between what is ordered (by the customer sitten on the chair of this table) and what is served
                                        dishes[0].status = `isLaidOnTheRightTable`;
                                        waiter.status = `isAvailable`;
                                        addToJournal(`dishes`, dishes[0].id, table.dishX, table.dishY); // update the dishes journal with the dish coordinates
                                        dishes[0].interactionX = table.interactionX; // update the dish interaction X according to the table it is laid on
                                        dishes[0].interactionY = table.interactionY; // update the dish interaction Y according to the table it is laid on
                                        customer.status = `isEating`;
                                    }
                                }
                            });
                            dishes[0].follow(waiter,50);
                        }
                    }
                    break;
                
                // 8: once served, he eats
                case `isEating`:
                    if(timer <= 350) {
                        timer++;
                    } else { // once dish eaten, the customer pays and leaves
                        dishes[0].status = `isEmpty`;
                        customer.status = `isLeavingRestaurant`;
                        addToJournal(`customers`, customer.id, -50, -50);
                        timer = 0;
                    };
                    break;
                
                // 9: customer is leaving
                case `isLeavingRestaurant`:
                    // if customer has left the canvas visible area, means he's gone
                    if(Math.sign(customer.x) === -1 && Math.sign(customer.y) === -1) {
                        customer.status = `isGone`;
                    }
                    break;
                
                // 10: the money is collected and the table is cleaned by the 
                case `isGone`:
                    console.log('customer is gone');
                    break; 
            }
        });
    } else {
        // create firt customer
        createNew(`customer`);
        createNew(`customer`);
    }
}


// listen to clicks
canvas.addEventListener('click', function(event) {
    var clickX = event.pageX - canvasLeft,
        clickY = event.pageY - canvasTop;

    // check if a validated interactive element has been clicked on
    function checkWaiterInteractionWith(component,x,y) {
        // defines interactive area for each component based on its actual property
        var surfaceTop = component.y + component.h;
        var surfaceRight = component.x + component.w;
        var surfaceBottom = component.y - component.h;
        var surfaceLeft = component.x - component.w;

        if(x < surfaceRight && x > surfaceLeft && y < surfaceTop && y > surfaceBottom) {
            addToJournal(`waiter`, waiter.id, component.interactionX, component.interactionY);
        }
    }

    interactiveElements.forEach(element => checkWaiterInteractionWith(element,clickX,clickY));
    
}, false);


// function to draw arrays
function drawArray(arrayName, array, journalArray) {
    if (journalArray.length !== 0) {
        journalArray.forEach(function(journalEntry){ // FIXME later
            array.forEach(function(el) {
                if(el.id === journalEntry.id){
                    el.moveTo(arrayName, el.id, journalEntry.x, journalEntry.y);
                    console.log(arrayName, el.id, journalEntry.x, journalEntry.y);
                    el.draw();
                }
            });
        });
    } else {
        array.forEach(function(el) {
            el.draw();
        });
    }
}


// function to create customer
function createNew(componentName, extra) { // extra if for dish only
    var availableSpot = null;
    var availableSpotIndex = null;

    function reserveAndDefineAvailableSpotIndex(array) { // reserve and define availableSpotIndex var
        array.forEach(function(spot) { // find the first customer spot available in the lobby
            if(!availableSpot) {
                if(spot.available === true) {
                    availableSpot = true;
                    availableSpotIndex = array.indexOf(spot);
                    array[availableSpotIndex].available = false; // spot no longer available
                }
            }
        });
    }

    switch(componentName) {
        case `customer`:
            reserveAndDefineAvailableSpotIndex(lobby.customersSpots);

            numberOfCustomersCreated++;
            customers.push(new Customer(numberOfCustomersCreated)); // create customer
            pushToInteractivesElements(customers);
            addToJournal(`customers`, numberOfCustomersCreated, lobby.customersSpots[availableSpotIndex].x, lobby.customersSpots[availableSpotIndex].y); // add the customer lobby spot destination in the journal
            break;
        case `dish`:
            reserveAndDefineAvailableSpotIndex(servingHatch.dishesSpots);
            
            numberOfDishesCreated++;
            dishes.push(new Dish(servingHatch.dishesSpots[availableSpotIndex].x, servingHatch.dishesSpots[availableSpotIndex].y, numberOfDishesCreated, extra)); // create dish
            pushToInteractivesElements(dishes);            
            break;
    }
    
    // if availability is still false, it means all spots are taken: game over
    if(!availableSpot) { 
        gameover = true;
    }
}


// functions to update journals
function addToJournal(componentName,id,x,y) {
    switch(componentName) {
        case `waiter`:
            waiterJournal.push({id:id, x:x, y:y});
            break;
        case `customers`:
            customersJournal.push({id:id, x:x, y:y});
            break;
        case `dishes`:
            dishesJournal.push({id:id, x:x, y:y});
            break;
    }
}

function removeFromJournal(componentName, id) {
    function removeIdFrom(array) {
        array.forEach(function(el) {
            if(el.id === id) {
                array.splice(array.indexOf(id),1); // remove the ID element
            };
        });
    }

    switch(componentName) {
        case `waiter`:
            removeIdFrom(waiterJournal);
            break;
        case `customers`:
            removeIdFrom(customersJournal);
            break;
        case `dishes`:
            removeIdFrom(dishesJournal);
            break;
    }
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


// function to fill interactive elements array
function pushToInteractivesElements(array) {
    array.forEach(element => interactiveElements.push(element))
}


function startGame() {
    waiter = new Waiter();
    lobby = new Lobby();
    servingHatch = new ServingHatch();

    // fill each component array
    tables.push(new Table(W/4, H/5));
    tables.push(new Table(3*W/4, H/5));
    tables.push(new Table(W/4, 4*H/5));
    tables.push(new Table(3*W/4, 4*H/5));

    // fill interactiveElements array
    pushToInteractivesElements(customers);
    pushToInteractivesElements(tables);
    
    requestAnimationFrame(animLoop);
}

startGame();