const mysql = require('mysql');
const inquirer = require('inquirer');
const Table = require('cli-table');
 
const table = new Table({
    head: ['Item ID', 'Product Name', 'Department Name', 'Price', 'Stock Quantity']
  , colWidths: [10, 30, 30, 10, 20]
});

var connection = mysql.createConnection({
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
                message: 'What is the ID of the item you would like to bid on?',
                name: 'selectedItem'
            }
        ])
        .then(function (response) {
            if (idArr.includes(parseInt(response.selectedItem)) === false) {
                console.log('That is not a valid item ID.');
                pickToBid(idArr);
            } else {
                console.log(response.selectedItem);
                quantity(response.selectedItem);
            }
        });
}

function quantity(id) {
    connection.query('SELECT * FROM products WHERE item_id = ?', id, function (err, response) {
        if (err) throw err;
        console.log(response);
        connection.end();
    });
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'How many would you like to purchase?',
                name: 'itemQuantity'
            }
        ])
        .then(function (response) {
            console.log(response.itemQuantity);
            if (parseInt(response.itemQuantity) > 0) {
                console.log('working on it');
            }
        });
}

connection.query('SELECT * FROM products', function (err, response) {
    if (err) throw err;
    let databaseIds = [];
    for (let i = 0; i < response.length; i++) {
        table.push([response[i].item_id, response[i].product_name, response[i].department_name, response[i].price.toFixed(2), response[i].stock_quantity]);
        databaseIds.push(response[i].item_id);
    }
    connection.end();
    displayItems(databaseIds);
});



