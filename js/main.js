let waiter;
let carpet;
let customers = [];
let tables = [];
let plates = [];
let interactiveElements = [];
let customerJournal = [];
let waiterJournal = [];
let gameover;
let money = 0;

const canvas = document.getElementById('game-board');
const canvasLeft = canvas.offsetLeft;
const canvasTop = canvas.offsetTop;
const ctx = document.querySelector('canvas').getContext('2d');
const W = ctx.canvas.width;
const H = ctx.canvas.height;

let kitchenTableWidth = W/10;
let kitchenTableHeight = H/4;


// draw canvas
function draw() {
    ctx.clearRect(0,0,W,H);

    // *********************
    // STATIC ELEMENTS
    // *********************

    // welcome carpet
    carpet.draw();

    // draw kitchen table
    ctx.fillStyle = `green`;
    ctx.fillRect(W-kitchenTableWidth, H/2-kitchenTableHeight/2, kitchenTableWidth, kitchenTableHeight);


    // *********************
    // INTERACTIVE ELEMENTS
    // *********************

    // draw tables & seats
    tables.forEach(table => table.draw());

    // draw plates
    plates.forEach(plate => plate.draw());

    // draw customer
    if (customerJournal.length !== 0) {
        customers.forEach(function(customer) {
            customer.moveTo(`customer`,customerJournal[0].x,customerJournal[0].y);
            customer.draw();
        });
    } else {
        customers.forEach(function(customer) {
            customer.draw();
        });
    }

    // draw waiter    
    if (waiterJournal.length !== 0) {
        waiter.moveTo(`waiter`, waiterJournal[0].x, waiterJournal[0].y);
    }
    waiter.draw();

    // if waiter walks in the interaction zone of the carpet
    if(waiter.x === carpet.interactionX && waiter.y === carpet.interactionY) {
        waiter.seatCustomer();
    }

    // if customer is following the waiter
    if(customers[0].isFollowingWaiter === true) {
        tables.forEach(function (table) {
            if(waiter.x === table.interactionX && waiter.y === table.interactionY) {
                customers[0].isFollowingWaiter = false;
                customers[0].sitAtTheTable(table);
            }
        })
        
        customers[0].followWaiter();
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


// journal
function addToJournal(component,x,y) {
    switch(component) {
        case `waiter`:
            waiterJournal.push({x: x, y:y});
            break;
        case `customer`:
            customerJournal.push({x: x, y:y});
            break;
    }
    console.log(`1 event added to the ${component} journal`);
}

function removeFromJournal(component) {
    switch(component) {
        case `waiter`:
            waiterJournal.shift();
            break;
        case `customer`:
            customerJournal.shift();
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
    plates.push(new Plate());

    // fill interactiveElements array
    interactiveElements.push(waiter);
    interactiveElements.push(carpet);
    pushToInteractivesElements(customers);
    pushToInteractivesElements(tables);
    pushToInteractivesElements(plates);
    
    requestAnimationFrame(animLoop);
}

startGame();