const mysql = require('mysql');
const inquirer = require('inquirer');
const Table = require('cli-table');
 
const table = new Table({
    head: ['Item ID', 'Product Name', 'Department Name', 'Price', 'Stock Quantity']
  , colWidths: [10, 30, 30, 10, 20]
});

let connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'nodeuser',
    password: 'password',
    database: 'bamazon'
});

function displayItems(idArr) {
    console.log(table.toString());
    pickToBid(idArr);
}

function pickToBid(idArr) {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the ID of the item you would like to purchase?',
                name: 'selectedItem'
            }
        ])
        .then(function (response) {
            if (idArr.includes(parseInt(response.selectedItem)) === false) {
                console.log('That is not a valid item ID.');
                pickToBid(idArr);
            } else {
                console.log(response.selectedItem);
                getItemDetails(response.selectedItem);
            }
        });
}

function getItemDetails(id) {
    let itemId = {item_id : parseInt(id)};
    connection.query('SELECT * FROM products WHERE ?', itemId, function (err, response) {
        if (err) throw err;
        quantity(response[0].stock_quantity, itemId, response[0].price);
    });
}

function afterPurchase() {
    inquirer
    .prompt([
        {
            type: 'list',
            message: 'Would you like to purchase another item?',
            choices: ['yes', 'no'],
            name: 'anotherPurchase'
        }
    ])
    .then(function (response) {
        if (response.anotherPurchase === 'yes') {
            getProducts();
        } else {
            console.log('Thanks for your business.');
            process.exit();
        }
    });
}

function updateDatabase(updateId, newAmt, updatePrice, bought) {
    let updateItemId = updateId;
    let itemPrice = parseFloat(updatePrice);
    let numberBought = parseInt(bought);
    console.log(updateItemId);
    let storedNewAmt = parseInt(newAmt);
    console.log(newAmt);
    let total = numberBought * itemPrice;
    let updateStock = {stock_quantity : storedNewAmt};
    console.log(updateStock);
    connection.query('UPDATE products SET ? WHERE ?', [updateStock, updateItemId], function (err, response) {
        if (err) throw err;
        console.log(`Your transaction was successful. The total was: ${total.toFixed(2)}.`);
        afterPurchase();
    });
}

function quantity(amt, quantId, quantPrice) {
    let storedId = quantId;
    let available = amt;
    let storedPrice = quantPrice;
    inquirer
        .prompt([
            {
                type: 'number',
                message: 'How many would you like to purchase?',
                name: 'itemQuantity'
            }
        ])
        .then(function (response) {   
            console.log(response.itemQuantity);
            console.log(available);
            if (parseInt(response.itemQuantity) > parseInt(available)) {
                console.log('Insufficient quantity!');
                insufficientQuestion(available);
            } else {
                let newAmt = parseInt(available) - parseInt(response.itemQuantity);
                updateDatabase(storedId, newAmt, storedPrice, response.itemQuantity);
            }
        });
}

function insufficientQuestion(availAmt) {
    let storedAvailable = availAmt;
    inquirer
    .prompt([
        {
            type: 'list',
            message: 'Would you like to purchase a different quantity?',
            choices: ['yes', 'no'],
            name: 'newItemQuantity'
        }
    ])
    .then(function (response) {   
        if (response.newItemQuantity === 'yes') {
            quantity(storedAvailable);
        } else {
            return;
        }
    });
}

function getProducts() {
    connection.query('SELECT * FROM products', function (err, response) {
        if (err) throw err;
        let databaseIds = [];
        for (let i = 0; i < response.length; i++) {
            table.push([response[i].item_id, response[i].product_name, response[i].department_name, response[i].price.toFixed(2), response[i].stock_quantity]);
            databaseIds.push(response[i].item_id);
        }
        displayItems(databaseIds);
    });
}

getProducts();

/*
connection.connect(function(err) {
  if (err) throw err;
  getProducts();
});
*/

//QUESTION : where to end connection?