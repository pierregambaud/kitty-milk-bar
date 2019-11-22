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
let numberOfJournalEntryCreated = 0;
let gameover = {status:false};
let frames = 0;
let moneyTarget = 120;
let money = 0;
let customersFlux;
let raf;

// game mecanism
const $canvas = document.querySelector('canvas');
const ctx = $canvas.getContext('2d');
const W = $canvas.width;
const H = $canvas.height;

// const canvasLeft = $canvas.offsetLeft;
// const canvasTop = $canvas.offsetTop;

// game settings
const menu = [{name: `Chocolate Milkshake`, price:10}, {name: `Strawberry Milkshake`, price:12}, {name: `Vanilla Milkshake`, price:14}];


// draw canvas
function draw() {

    // ******** DRAWING ********
    // *************************
    ctx.clearRect(0,0,W,H);

    // draw background
    drawBackground();

    // draw score
    drawScore();

    // draw time
    drawTime();

    // draw each customer checking its journal position (defaut: its own position)
    if(numberOfCustomersCreated === 0) {
        createNew(`customer`); // first customer
        setCustomerTimeout(); // set quick timeout for the second
    } else if (frames % 500 === 0 && lobby.customersSpots[lobby.customersSpots.length-1].available === true) { // set longer timeout for the rest of them & checking if there's a spot available in the lobby line
        setCustomerTimeout();
    } 
    drawArray(`customers`, customers, customersJournal);

    // draw tables & seats
    tables.forEach(table => table.draw());

    // draw waiter checking his journal position (defaut: his own position)
    if (waiterJournal.length !== 0) {
        waiter.moveTo(`waiter`, waiterJournal[0].id, waiterJournal[0].componentX, waiterJournal[0].componentY);
    }
    waiter.draw();

    // draw serving hatch
    servingHatch.draw();

    // draw each dish checking its journal position (defaut: its own position)
    drawArray(`dishes`, dishes, dishesJournal);

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
                    if(waiter.x === customer.interactionX && waiter.y === customer.interactionY && waiter.status === `isAvailable`) {
                        var oneTableIsAvailable = false;
                        tables.forEach(function(table) {
                            if(table.available === true) {
                                oneTableIsAvailable = true;
                            }
                        });

                        if(oneTableIsAvailable) {
                            customer.status = `isFollowingTheWaiter`;
                            waiter.status = `isTakingCustomerToATable`;
                            addToJournal(`events`, waiter.id, {frames:frames+50,eventType:`sayHello`,componentName:`waiter`});
                        } else if(customer.x === lobby.customersSpots[0].x && customer.y === lobby.customersSpots[0].y) { // only the fist customer of the line says it
                            customer.showNoMoreTableAvailable();
                        }
                    } else if (customer.x === lobby.customersSpots[0].x && customer.y === lobby.customersSpots[0].y) {
                        customer.sayHello(); // display speech bubble
                    }
                    break;
                
                // 3. he follows the waiter
                case `isFollowingTheWaiter`:
                    customer.follow(waiter,numberOfJournalEntryCreated++,customer.w + 20);
                    
                    // during 100 frames, waiter.sayHello() then customer.sayHello() 
                    timedEventsJournal.forEach(function(timedEvent) {
                        if(timedEvent.componentName === `waiter` && timedEvent.eventType === `sayHello`) {
                            if(timedEvent.frames <= frames) {
                                removeFromJournal(`events`,timedEvent.id); // remove waiter sayHello event
                            } else {
                                waiter.sayHello(); // display speech bubble
                            }
                        }
                    });
                    
                    
                    

                    // if the waiter reaches one of the EMPTY tables while customer stops following him and goes for his chair
                    tables.forEach(function (table) {
                        if(waiter.x === table.interactionX && waiter.y === table.interactionY && table.available === true) {
                            // we are sure that the customer is arrived to its table => update lobby spots
                            lobby.customersSpots[0].available = true; // the first spot of the lobby is now available again
                            updateLobbySpots(); // update customers positions in the lobby

                            // sit the customer
                            addToJournal(`customers`, customer.id, {componentX:table.chairX,componentY:table.chairY}); // update the customers journal with the chair coordinates
                            customer.status = `isSeating`;
                            waiter.status = `isAvailable`;
                            table.available = false;
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
                            customer.tableId = tables.indexOf(table); // fill tableId in customer profile
                            table.x = table.chairX; // move the table if front of the customer
                        }
                    });
                    break;

                // 5: he receives the menu
                case `hasReceivedTheMenu`:
                    addToJournal(`events`, customer.id, {frames:frames+300,eventType:`isReadingTheMenu`}); // reads the menu for 300 frames
                    customer.status = `isReadingTheMenu`;
                    break;
                
                // 6: he reads the menu and then calls the waiter
                case `isReadingTheMenu`:
                    // after 300 frames, call the waiter
                    timedEventsJournal.forEach(function(timedEvent) {
                        if(timedEvent.componentId === customer.id && timedEvent.eventType === `isReadingTheMenu`) {
                            if(timedEvent.frames === frames) {
                                customer.status = `isWaitingToOrder`;
                                removeFromJournal(`events`,timedEvent.id);
                            }
                        }
                    });
                    break;
                
                // 7: once decided, he calls the waiter to order
                case `isWaitingToOrder`:
                    // display `call waiter` notification
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
                    addToJournal(`events`, customer.id, {frames:frames+300,eventType:`cookingTime`,dish:customer.favoriteDish}); // the dish will be available in 300 frames
                    customer.status = `isWaitingForTheDish`;
                    waiter.status = `isAvailable`;
                    break;

                // 9: once ordered, he waits for the dish
                case `isWaitingForTheDish`:
                    customer.showOrderedDish();

                    timedEventsJournal.forEach(function(timedEvent) {
                        if(timedEvent.eventType === `cookingTime` && timedEvent.frames === frames) { // FIXME replace customer by name of dish in "hard" to prevent null customer if other plate served to him
                            createNew(`dish`,timedEvent.dish); // create and display a new dish 
                            removeFromJournal(`events`,timedEvent.id);
                        }
                    });

                    if(dishes.length !== 0) {
                        dishes.forEach(function(dish) {

                            // when waiter arrives to the interaction coordinates of a dish
                            if(waiter.x === dish.interactionX && waiter.y === dish.interactionY && dish.status === `isReadyToBeServed` && waiter.status === `isAvailable`) {
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
                                        if(customer.x === table.chairX && customer.y === table.chairY && dish.name === customer.favoriteDish.name) { // if there is a match between what is ordered (by the customer sitten on the chair of this table) and what is served    && dish.customerId === customer.id
                                            customer.servedDishId = dish.id;
                                            dish.status = `isLaidOnTheRightTable`;
                                            waiter.status = `isAvailable`;
                                            addToJournal(`dishes`, customer.servedDishId, {componentX:table.dishX, componentY:table.dishY}); // update the dishes journal with the dish coordinates
                                            dish.interactionX = table.interactionX; // update the dish interaction X according to the table it is laid on
                                            dish.interactionY = table.interactionY; // update the dish interaction Y according to the table it is laid on
                                            customer.status = `isReceivingTheDish`;
                                            addToJournal(`events`, customer.id, {frames:frames+300,eventType:`isEating`,dish:dish}); // the customer will finish eating in 300 frames
                                        }
                                    }
                                });
                                if(dish.status !== `isLaidOnTheRightTable`) {
                                    dish.follow(waiter,numberOfJournalEntryCreated++,5);
                                }
                            }
                        })
                    }
                    break;
                
                // 10: he receives the dish and starts eating
                case `isReceivingTheDish`:
                    customer.status = `isEating`;
                    break;

                // 11: once served, he eats
                case `isEating`:                    
                    timedEventsJournal.forEach(function(timedEvent) {
                        if(timedEvent.eventType === `isEating` && timedEvent.frames === frames && dishes.length !== 0) { // if an isEating event is reached and one dish is at least created 
                            dishes.forEach(function(dish) {
                                if(timedEvent.dish.id === dish.id && timedEvent.dish.id === customer.servedDishId) {
                                    dish.status = `isEmpty`;
                                    tables[customer.tableId].x = tables[customer.tableId].emptyTableX; // move the table to its initial position
                                    dish.x = tables[customer.tableId].emptyTableX; // move the dish on the new position of the table
                                    tables[customer.tableId].hasMoney = true; // display the money on the table
                                    
                                    removeFromJournal(`events`,timedEvent.id);
                                    customer.status = `isReachingTheExitDoor`;
                                    addToJournal(`customers`, customer.id, {componentX:700, componentY:690}); // same y as lobby.y
                                }
                            })
                        }
                    });
                    break;
                
                // 12: customer is reaching the center of the canvas before exit door
                case `isReachingTheExitDoor`:
                    if(customer.x === 700 && customer.y === 690 && customer.status === "isReachingTheExitDoor") { // same x & y as in the journal in isEating case
                        customer.status = `isLeavingRestaurant`;
                        addToJournal(`customers`, customer.id, {componentX:W+100, componentY:690});
                    }
                    break;

                // 13: customer is leaving
                case `isLeavingRestaurant`:
                    // if customer has left the canvas visible area, means he's gone
                    if(customer.x === W+100 && customer.y === 690) { // same x & y as in the journal in isReachingTheExitDoor case
                        customer.status = `isGone`;
                    }
                    break;
                
                // 14: the money is collected and the table is cleaned by the 
                case `isGone`:
                    if(dishes.length !== 0) {
                        dishes.forEach(function(dish) {
                            if(waiter.x === dish.interactionX && waiter.y === dish.interactionY && dish.status === `isEmpty`) { // when waiter arrives to the interaction coordinates of an empty dish
                                money+= dish.price;
                                tables.forEach(function(table) {
                                    if(waiter.x === table.interactionX && waiter.y === table.interactionY) {
                                        table.hasMoney = false; // remove the money on the table
                                        table.available = true; // table is now available again
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


// IMPORTANT FOR RESPONSIVE: convert clic according to canvas height and width
let x0;
let y0;
let w;
let h;

function dims() {
  const bbox = $canvas.getBoundingClientRect();
  x0 = bbox.left;
  y0 = bbox.top;
  w = bbox.right - bbox.left;
  h = bbox.bottom - bbox.top;
}
dims();
window.onresize = dims;


// listen to clicks
document.addEventListener('click', function(event) {
    var clickX = event.pageX;
    var clickY = event.pageY;
   
    clickX -= x0;
    clickY -= y0;
    clickX *= W / w;
    clickY *= H / h;

    // check if a validated interactive element has been clicked on
    function checkWaiterInteractionWith(component,x,y) {
        // defines interactive area for each component based on its actual property
        var surfaceTop;
        var surfaceRight;
        var surfaceBottom;
        var surfaceLeft;

        if(component.chairW) { // if it is a table
            surfaceTop = component.chairY;
            surfaceBottom = component.y + component.h / 2;

            if(component.x < W/2) { // if the table is on the left part
                surfaceRight = component.chairX + component.chairW / 2;
                surfaceLeft = component.x - component.w / 2;
            } else {
                surfaceRight = component.x + component.w / 2;
                surfaceLeft = component.chairX - component.w / 2;
            }
        } else if (component.price) { // if it is a dish
            surfaceTop = component.y - servingHatch.h / 2;
            surfaceRight = component.x + servingHatch.w / 5 / 2;
            surfaceBottom = component.y + servingHatch.h / 2;
            surfaceLeft = component.x - servingHatch.w / 5 / 2;   
        } else if (component.favoriteDish) { // if it is a customer
            surfaceTop = component.y - component.h / 2;
            surfaceRight = component.x + component.w / 2;
            surfaceBottom = component.y + component.h / 2;
            surfaceLeft = component.x - component.w / 2;   
        }

        if(x < surfaceRight && x > surfaceLeft && y > surfaceTop && y < surfaceBottom) {
            addToJournal(`waiter`, waiter.id, {componentX:component.interactionX, componentY:component.interactionY});
        }
    }

    interactiveElements.forEach(element => checkWaiterInteractionWith(element,clickX,clickY));

    // specific event after gameover screen is displayed
    if(gameover.status === true) {
        reset();
        startGame();
    }
    
}, false);


// function to draw arrays
function drawArray(arrayName, array, journalArray) { // ex values: `customers`, customers, customersJournal
    if (journalArray.length !== 0) {
        journalArray.forEach(function(journalEntry){
            array.forEach(function(el) {
                if(el.id === journalEntry.componentId){ // if there is a journal entry for the element
                    el.moveTo(arrayName, journalEntry.id, journalEntry.componentX, journalEntry.componentY);
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

// function to display background
const backgroundImage = document.createElement('img');
backgroundImage.onload = () => {
}
backgroundImage.src = './img/background.png';

function drawBackground() {
    var backgroundW = W;
    var backgroundH = H;
    var backgroundX = 0;
    var backgroundY = 0;

    ctx.drawImage(backgroundImage, backgroundX, backgroundY, backgroundW, backgroundH);
}

// function to display score / money
function drawScore() {

    // target
    ctx.font = "bold 32px Open Sans";
    ctx.fillStyle = "#ff7272";
    ctx.textAlign = "right";
    ctx.fillText(`${moneyTarget}`, 945, 1178);

    // real
    ctx.font = "bold 32px Open Sans";
    ctx.fillStyle = "#4ee660";
    ctx.textAlign = "right";
    ctx.fillText(`${money}`, 945, 1223);
}

// function to display time (based on frames)
function drawTime() {
    var time = 6 + Math.floor(frames / 800); 
    ctx.font = "bold 28px Open Sans";
    ctx.fillStyle = "#ff7272";
    ctx.textAlign = "center";

    if(time >= 12) { // if 13 reached, no more customers are created
        clearTimeout(customersFlux); // stop customersFlux timeout
        ctx.fillText(`CLOSED`, W/2, 35);
        if(customers.length === 0) { // if there are no customers left
            var tablesAllCleaned = true;
            tables.forEach(function(table){ 
                if(table.hasMoney === true) { // if all tables are cleaned
                    tablesAllCleaned = false;
                }
            });

            if(tablesAllCleaned) { // then game is finished
                gameover = {status:true};
            }
        }
    } else {
        ctx.fillText(`${time} P.M.`, W/2, 35);
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
function createNew(componentName, dish) { // customer for dish only (customer.favoriteDish && customer.id)
    switch(componentName) {
        case `customer`:
            reserveAndDefineAvailableSpotIndex(lobby.customersSpots);

            numberOfCustomersCreated++;
            multiPush(customers,interactiveElements,new Customer(numberOfCustomersCreated)); // create customer and push it to customers & interactiveElements
            addToJournal(`customers`, numberOfCustomersCreated, {componentX:lobby.customersSpots[availableSpotIndex].x, componentY:lobby.customersSpots[availableSpotIndex].y}); // add the customer lobby spot destination in the journal
            break;
        case `dish`:
            reserveAndDefineAvailableSpotIndex(servingHatch.dishesSpots);
            availableSpotIndex = availableSpotIndex % servingHatch.dishesSpots.length;
            
            numberOfDishesCreated++;
            multiPush(dishes,interactiveElements,new Dish(servingHatch.dishesSpots[availableSpotIndex].x, servingHatch.dishesSpots[availableSpotIndex].y, numberOfDishesCreated, dish)); // create dish and push it to dishes & interactiveElements         
            break;
    }
    
    // if availability is still false, it means all spots are taken: game over
    if(!availableSpot) { 
        gameover = {status:true, reason:`spotAvailability`, component:componentName};
    }

    availableSpot = null;
    availableSpotIndex = null;
}

// function to time the creation of new customers
function setCustomerTimeout() {
    var randomDelay = Math.floor(Math.random() * 2000) + 1000; // between 2000 and 4000 (+ 500 frames)

    customersFlux = setTimeout(function(){createNew(`customer`)},randomDelay); 
}

// function to update customer position in the lobby
function updateLobbySpots() {
    customers.forEach(function(customer) {
        if (customer.status === `isStandingInLine`) {
            reserveAndDefineAvailableSpotIndex(lobby.customersSpots); 
            addToJournal(`customers`, customer.id, {componentX:lobby.customersSpots[availableSpotIndex].x, componentY:lobby.customersSpots[availableSpotIndex].y}); // add the customer lobby spot destination in the journal
            lobby.customersSpots[availableSpotIndex+1].available = true; // the previous spot is now available
        }
        availableSpot = null;
        availableSpotIndex = null;
    });
}


// ********* JOURNALS *********
// ****************************

// functions to update journals
function addToJournal(componentName,componentId,details) {
    switch(componentName) {
        case `waiter`:
            waiterJournal.push({id:numberOfJournalEntryCreated++, componentId:componentId, componentX:details.componentX, componentY:details.componentY});
            break;
        case `customers`:
            customersJournal.push({id:numberOfJournalEntryCreated++, componentId:componentId, componentX:details.componentX, componentY:details.componentY});
            break;
        case `dishes`:
            dishesJournal.push({id:numberOfJournalEntryCreated++, componentId:componentId, componentX:details.componentX, componentY:details.componentY});
            break;
        case `events`:
            timedEventsJournal.push({id:numberOfJournalEntryCreated++, componentId:componentId, frames:details.frames, eventType:details.eventType, componentName:details.componentName, dish:details.dish});
            break;
    }
}

function removeFromJournal(componentName, journalEntryId) {
    function removeIdFrom(array) {
        array.forEach(function(el) {
            if(el.id === journalEntryId) {
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
  
    if (!gameover.status) { // {status:true, reason:`time`, component:`customer OR dish`}
        raf = requestAnimationFrame(animLoop);
    } else {
        var profit = money - moneyTarget;

        if(!gameover.reason && Math.sign(profit) === -1) {
            gameover = {status:true, reason:`money`}
        }

        // write the message
        if(gameover.reason) {
            // background color
            ctx.fillStyle = '#f0c9c9';
            ctx.fillRect(0,0,W,H);

            // text
            ctx.font = "bold 80px Open Sans";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(`A SAD DAY`, W/2, 340);
    
            switch(gameover.reason) {
                case `money`:
                    ctx.font = "bold 50px Open Sans";
                    ctx.textAlign = "center";
                    ctx.fillStyle = "#feeded";
                    ctx.fillText(`NEEDED: ${moneyTarget}€`, W/2, 530);
                    ctx.fillStyle = "#f4faf3";
                    ctx.fillText(`EARNED: ${money}€`, W/2, 590);
                    ctx.fillStyle = "#feeded";
                    ctx.font = "bold 60px Open Sans";
                    ctx.fillText(`LOSS: ${Math.abs(profit)}€`, W/2, 730);
                    break;
                case `spotAvailability`:
                    ctx.font = "bold 50px Open Sans";
                    ctx.textAlign = "center";
                    ctx.fillStyle = "#feeded";
                    ctx.fillText(`REASON: TOO SLOW`, W/2, 530);
                    ctx.fillStyle = "#f4faf3";
                    ctx.font = "bold 60px Open Sans";
                    ctx.fillText(`BE FASTER TO SERVE THE CUSTOMERS`, W/2, 730);
                    break;
            }
        } else {
            // background color
            ctx.fillStyle = '#bad7df';
            ctx.fillRect(0,0,W,H);

            // text
            ctx.font = "bold 80px Open Sans";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(`A SUCCESSFUL DAY!`, W/2, 340);

            ctx.font = "bold 50px Open Sans";
            ctx.textAlign = "center";
            ctx.fillStyle = "#feeded";
            ctx.fillText(`NEEDED: ${moneyTarget}€`, W/2, 530);
            ctx.fillStyle = "#f4faf3";
            ctx.fillText(`EARNED: ${money}€`, W/2, 590);
            ctx.font = "bold 60px Open Sans";
            ctx.fillText(`PROFIT: ${profit}€`, W/2, 730);
        }
        
        // reset game
        ctx.font = "bold 30px Open Sans";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(`PLAY AGAIN?`, W/2, 900);
    }
}


// function to fill interactive elements array
function pushToInteractivesElements(array) {
    array.forEach(element => interactiveElements.push(element))
}

// function startgame
function startGame() {
    // cancel animation if game has already been started before
    if (raf) {
        cancelAnimationFrame(raf);
    }

    // fill each component array
    var table1Coordinates = {x: 200, y: 510, chairX: 100+205, chairY: 410+10};
    var table2Coordinates = {x: W-200, y: 510, chairX: W-200-100-5, chairY: 410+10};
    var table3Coordinates = {x: 150, y: 1025, chairX: 50+190, chairY: 925+10};
    var table4Coordinates = {x: W-150, y: 1025, chairX: W-200-50, chairY: 925+10};

    tables.push(new Table(table1Coordinates));
    tables.push(new Table(table2Coordinates));
    tables.push(new Table(table3Coordinates));
    tables.push(new Table(table4Coordinates));

    // fill interactiveElements array
    pushToInteractivesElements(tables);
    
    raf = requestAnimationFrame(animLoop);
}

// function reset
function reset() {
    waiter = new Waiter();
    lobby = new Lobby();
    servingHatch = new ServingHatch();
    tables.length = 0;
    customers.length = 0;
    numberOfCustomersCreated = 0;
    dishes.length = 0;
    numberOfDishesCreated = 0;
    interactiveElements.length = 0;
    waiterJournal.length = 0;
    customersJournal.length = 0;
    dishesJournal.length = 0;
    timedEventsJournal.length = 0;
    numberOfJournalEntryCreated = 0;
    gameover = {status:false};
    frames = 0;
    moneyTarget = 120;
    money = 0;
    clearTimeout(customersFlux);
}

// listen to #star-button to launch the game
const $start = document.getElementById("start-button");
$start.onclick = function() {
    reset();
    startGame();
};