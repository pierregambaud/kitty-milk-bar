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
let timedEventsJournal = [];
let gameover;
let frames = 0;
let money = 0;

const canvas = document.getElementById('game-board');
const canvasLeft = canvas.offsetLeft;
const canvasTop = canvas.offsetTop;
const ctx = document.querySelector('canvas').getContext('2d');
const W = ctx.canvas.width;
const H = ctx.canvas.height;
const menu = [{name: `Chocolate Milkshake`, color:`brown`, price:10}, {name: `Vanilla Milkshake`, color:`yellow`, price:12}, {name: `Strawberry Milkshake`, color:`pink`, price:14}];


// draw canvas
function draw() {

    // ******** DRAWING ********
    // *************************
    ctx.clearRect(0,0,W,H);

    // draw score
    drawScore();

    // draw time
    drawTime();

    // draw welcome lobby
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
                        if(customer.x === spot.x && customer.y === spot.y) {
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

                        lobby.customersSpots[0].available = true; // the first spot of the lobby is now available again
                        updateLobbySpots(); // update customers positions in the lobby
                    }
                    break;
                
                // 3. he follows the waiter
                case `isFollowingTheWaiter`:
                    customer.follow(waiter,100);

                    // if the waiter reaches one of the EMPTY tables while customer stops following him and goes for his chair
                    tables.forEach(function (table) {
                        if(waiter.x === table.interactionX && waiter.y === table.interactionY) { 
                            addToJournal(`customers`, customer.id, {x:table.chairX,y:table.chairY}); // update the customers journal with the chair coordinates
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
                            customer.status = `hasReceivedTheMenu`;
                        }
                    });
                    break;

                // 5: he receives the menu
                case `hasReceivedTheMenu`:
                    addToJournal(`events`, customer.id, {type:`isReadingTheMenu`,frames:frames+300}); // reads the menu for 300 frames
                    customer.status = `isReadingTheMenu`;
                    break;
                
                // 6: he reads the menu and then calls the waiter
                case `isReadingTheMenu`:
                    // after 300 frames, call the waiter
                    timedEventsJournal.forEach(function(timedEvent) {
                        if(timedEvent.id === customer.id && timedEvent.type === `isReadingTheMenu`) {
                            if(timedEvent.frames === frames) {
                                customer.status = `isWaitingToOrder`;
                                removeFromJournal(`events`,timedEvent.id);
                            }
                        }
                    });
                    break;
                
                // 7: once decided, he calls the waiter to order
                case `isWaitingToOrder`:
                    // display "call waiter" notification
                    customer.callWaiter();

                    // if the waiter reaches the customer table
                    tables.forEach(function (table) {
                        if(waiter.x === table.interactionX && waiter.y === table.interactionY && customer.x === table.chairX && customer.y === table.chairY) {
                            customer.status = `isPlacingTheOrder`;
                            waiter.status = `isTakingTheCustomerOrder`;
                        }
                    });
                    break;
                
                // 8: once the waiter arrived, he places the order
                case `isPlacingTheOrder`:
                    addToJournal(`events`, customer.id, {type:`cookingTime`,frames:frames+300}); // the dish will be available in 300 frames
                    customer.status = `isWaitingForTheDish`;
                    waiter.status = `isAvailable`;
                    break;

                // 9: once ordered, he waits for the dish
                case `isWaitingForTheDish`:
                    timedEventsJournal.forEach(function(timedEvent) {
                        if(timedEvent.id === customer.id && timedEvent.type === `cookingTime`) {
                            if(timedEvent.frames === frames) {
                                createNew(`dish`,customer); // create and display a new dish
                                removeFromJournal(`events`,timedEvent.id);
                            }
                        }
                    });

                    if(dishes.length !== 0) {
                        dishes.forEach(function(dish) {

                            // when waiter arrives to the interaction coordinates of a dish
                            if(waiter.x === dish.interactionX && waiter.y === dish.interactionY && dish.status === "isReadyToBeServed") { // FIXME
                                dish.status = `isTakenByWaiter`;
                                waiter.status = `isHoldingADish`;

                                servingHatch.dishesSpots.forEach(function(dishSpot) {
                                    if(dishSpot.x === dish.x && dishSpot.y === dish.y) {
                                        dishSpot.available = true; // the dish spot is now available again
                                    }
                                });
                            }
                        
                            if(dish.status === `isTakenByWaiter`) {
                                // when waiter arrives to the interaction coordinates of one of the tables
                                tables.forEach(function (table) {
                                    if(waiter.x === table.interactionX && waiter.y === table.interactionY) { // if the waiter reaches the table
                                        if(customer.x === table.chairX && customer.y === table.chairY && dish.name === customer.favoriteDish.name) { // if there is a match between what is ordered (by the customer sitten on the chair of this table) and what is served
                                            dish.status = `isLaidOnTheRightTable`;
                                            waiter.status = `isAvailable`;
                                            addToJournal(`dishes`, dish.id, {x:table.dishX, y:table.dishY}); // update the dishes journal with the dish coordinates
                                            dish.interactionX = table.interactionX; // update the dish interaction X according to the table it is laid on
                                            dish.interactionY = table.interactionY; // update the dish interaction Y according to the table it is laid on
                                            customer.status = `isReceivingTheDish`;
                                        }
                                    }
                                });
                                if(dish.status !== `isLaidOnTheRightTable`) {
                                    dish.follow(waiter,50);
                                }
                            }
                        })
                    }
                    break;
                
                // 10: he receives the dish and starts eating
                case `isReceivingTheDish`:
                    addToJournal(`events`, customer.id, {type:`isEating`,frames:frames+300}); // the dish will be available in 300 frames
                    customer.status = `isEating`;
                    break;

                // 11: once served, he eats
                case `isEating`:                    
                    timedEventsJournal.forEach(function(timedEvent) {
                        if(timedEvent.id === customer.id && timedEvent.type === `isEating`) {
                            if(timedEvent.frames === frames) {
                                dishes.forEach(function(dish) {
                                    if(dish.id === timedEvent.id) {
                                        dish.status = `isEmpty`;
                                    }

                                    tables.forEach(function(table) {
                                        if(table.interactionX === dish.interactionX && table.interactionY === dish.interactionY && customer.x === table.chairX && customer.y === table.chairY) {
                                            table.hasMoney = true; // display the money on the table
                                        }
                                    })
                                })
                                removeFromJournal(`events`,timedEvent.id);
                                customer.status = `isLeavingRestaurant`;
                                addToJournal(`customers`, customer.id, {x:-50, y:-50});
                            }
                        }
                    });
                    break;
                
                // 12: customer is leaving
                case `isLeavingRestaurant`:
                    // if customer has left the canvas visible area, means he's gone
                    if(Math.sign(customer.x) === -1 && Math.sign(customer.y) === -1) {
                        customer.status = `isGone`;
                    }
                    break;
                
                // 13: the money is collected and the table is cleaned by the 
                case `isGone`:
                    if(dishes.length !== 0) {
                        dishes.forEach(function(dish) {
                            if(waiter.x === dish.interactionX && waiter.y === dish.interactionY && dish.status === `isEmpty`) { // when waiter arrives to the interaction coordinates of an empty dish
                                money+= dish.price;
                                tables.forEach(function(table) {
                                    if(waiter.x === table.interactionX && waiter.y === table.interactionY) {
                                        table.hasMoney = false; // remove the money on the table
                                    }
                                })
                                dishes.splice(dishes.indexOf(dish),1); // remove the dish from the array = makes it disappear
                                customers.splice(customers.indexOf(customer),1); // remove the customer from the array
                            }
                        })
                    }
                    break; 
            }
        });
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
            addToJournal(`waiter`, waiter.id, {x:component.interactionX, y:component.interactionY});
        }
    }

    interactiveElements.forEach(element => checkWaiterInteractionWith(element,clickX,clickY));
    
}, false);


// function to draw arrays
function drawArray(arrayName, array, journalArray) { // ex values: `customers`, customers, customersJournal
    if (journalArray.length !== 0) {
        journalArray.forEach(function(journalEntry){
            array.forEach(function(el) {
                if(el.id === journalEntry.id){ // if there is a journal entry for the element
                    el.moveTo(arrayName, el.id, journalEntry.x, journalEntry.y);
                    el.draw();
                } else { // if the journal entry does not concern the el, draw it anyway
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

// function to display score / money
function drawScore() {
    ctx.font = "50px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(`Cash: $${money}`, W - 180, 90);
}

// function to display time (based on frames)
function drawTime() {
    var time = 6 + Math.floor(frames / 800); 
    ctx.font = "50px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";

    if(time >= 13) { // if 13 reached, no more customers are created
        ctx.fillText(`Diner closed`, 180, 90);
        if(customers.length === 0) { // if there are no customers left
            var tablesAllCleaned = true;
            tables.forEach(function(table){ 
                if(table.hasMoney === true) { // if all tables are cleaned
                    tablesAllCleaned = false;
                }
            });

            if(tablesAllCleaned) { // then game is finished
                gameover = true;
            }
        }
    } else {
        ctx.fillText(`Time: ${time} P.M`, 180, 90);
    }
}


// ********* QUEUE FOR LOBBY AND SERVING HATCH *********
// *****************************************************
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

function multiPush(array1, array2, elementToPush) {
    element = elementToPush;
    array1.push(element);
    array2.push(element);
}

// function to create customer & dish
function createNew(componentName, customer) { // customer for dish only (customer.favoriteDish && customer.id)
    switch(componentName) {
        case `customer`:
            reserveAndDefineAvailableSpotIndex(lobby.customersSpots);

            numberOfCustomersCreated++;
            multiPush(customers,interactiveElements,new Customer(numberOfCustomersCreated)); // create customer and push it to customers & interactiveElements
            addToJournal(`customers`, numberOfCustomersCreated, {x:lobby.customersSpots[availableSpotIndex].x, y:lobby.customersSpots[availableSpotIndex].y}); // add the customer lobby spot destination in the journal
            break;
        case `dish`:
            reserveAndDefineAvailableSpotIndex(servingHatch.dishesSpots);
            availableSpotIndex = availableSpotIndex % servingHatch.dishesSpots.length;
            console.log(availableSpotIndex);
            
            numberOfDishesCreated++;
            multiPush(dishes,interactiveElements,new Dish(servingHatch.dishesSpots[availableSpotIndex].x, servingHatch.dishesSpots[availableSpotIndex].y, numberOfDishesCreated, customer.id, customer.favoriteDish)); // create dish and push it to dishes & interactiveElements         
            break;
    }
    
    // if availability is still false, it means all spots are taken: game over
    if(!availableSpot) { 
        gameover = true;
        console.log(`game over`);
    }

    availableSpot = null;
    availableSpotIndex = null;
}

// function to update customer position in the lobby
function updateLobbySpots() {
    customers.forEach(function(customer) {
        if (customer.status === "isStandingInLine") {
            reserveAndDefineAvailableSpotIndex(lobby.customersSpots); 
            addToJournal(`customers`, customer.id, {x:lobby.customersSpots[availableSpotIndex].x, y:lobby.customersSpots[availableSpotIndex].y}); // add the customer lobby spot destination in the journal
            lobby.customersSpots[availableSpotIndex+1].available = true; // the previous spot is now available
        }
        availableSpot = null;
        availableSpotIndex = null;
    });
}


// ********* JOURNALS *********
// ****************************

// functions to update journals
function addToJournal(componentName,idOfComponent,details) {
    switch(componentName) {
        case `waiter`:
            waiterJournal.push({id:idOfComponent, x:details.x, y:details.y});
            break;
        case `customers`:
            customersJournal.push({id:idOfComponent, x:details.x, y:details.y});
            break;
        case `dishes`:
            dishesJournal.push({id:idOfComponent, x:details.x, y:details.y});
            break;
        case `events`:
            timedEventsJournal.push({id:idOfComponent, type:details.type, frames:details.frames});
            break;
    }
}

function removeFromJournal(componentName, idOfComponent) {
    function removeIdFrom(array) {
        array.forEach(function(el) {
            if(el.id === idOfComponent) {
                array.splice(array.indexOf(el),1); // remove the element from the array if id of the element and id from the journal match
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
        case `events`:
            removeIdFrom(timedEventsJournal);
            break;
    }
}


// animations
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
    createNew(`customer`);
    createNew(`customer`);

    // fill each component array
    tables.push(new Table(W/4, H/5));
    tables.push(new Table(3*W/4, H/5));
    tables.push(new Table(W/4, 4*H/5));
    tables.push(new Table(3*W/4, 4*H/5));

    // fill interactiveElements array
    pushToInteractivesElements(tables);
    
    requestAnimationFrame(animLoop);
}

startGame();