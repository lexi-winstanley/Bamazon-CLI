const mysql = require('mysql');
const inquirer = require('inquirer');
const Table = require('cli-table');

let table = new Table({
    head: ['Item ID', 'Product Name', 'Department Name', 'Price', 'Stock Quantity']
  , colWidths: [10, 30, 30, 10, 20]
});

let tableLow = new Table({
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

let managerProductIds = [];

function getAllProductIds() {
    connection.query('SELECT * FROM products', function (err, response) {
        if (err) throw err;
        for (let i = 0; i < response.length; i++) {
            managerProductIds.push(response[i].item_id);
        }
    });
}

function anotherAction() {
    inquirer
    .prompt([
        {
            type: 'list',
            message: 'Would you like to take another action?',
            choices: ['yes', 'no'],
            name: 'anotherAction'
        }
    ])
    .then(function (response) {
        if (response.anotherAction === 'yes') {
            menuOptions();
        } else {
            console.log('Thank you for using Bamazon. Goodbye.');
            process.exit();
        }
    });
}

function viewAll() {
    table = new Table({
        head: ['Item ID', 'Product Name', 'Department Name', 'Price', 'Stock Quantity']
      , colWidths: [10, 30, 30, 10, 20]
    });
    managerProductIds = [];
    getAllProductIds();
    connection.query('SELECT * FROM products', function (err, response) {
        if (err) throw err;
        for (let i = 0; i < response.length; i++) {
            table.push([response[i].item_id, response[i].product_name, response[i].department_name, response[i].price.toFixed(2), response[i].stock_quantity]);
            managerProductIds.push(response[i].item_id);
        }
        console.log(table.toString())
        anotherAction();
    });
}

function viewLow() {
    tableLow = new Table({
        head: ['Item ID', 'Product Name', 'Department Name', 'Price', 'Stock Quantity']
      , colWidths: [10, 30, 30, 10, 20]
    });
    connection.query('SELECT * FROM products WHERE stock_quantity <=5', function (err, response) {
        if (err) throw err;
        for (let i = 0; i < response.length; i++) {
            tableLow.push([response[i].item_id, response[i].product_name, response[i].department_name, response[i].price.toFixed(2), response[i].stock_quantity]);
        }
        console.log(tableLow.toString())
        anotherAction();
    });
}

function selectAddMore() {
    getAllProductIds();
    inquirer
        .prompt([
            {
                type: 'number',
                message: 'What is the ID of the item you\'d like to increase inventory for?',
                name: 'addMoreId'
            }
        ])
        .then(function (response) {
            if (managerProductIds.includes(response.addMoreId) === false) {
                console.log('That is not a valid item ID.');
                selectAddMore();
            } else {
                itemDetails(response.addMoreId);
            }
        });
}

function itemDetails(id) {
    let itemId = {item_id : parseInt(id)};
    connection.query('SELECT * FROM products WHERE ?', itemId, function (err, response) {
        if (err) throw err;
        addMore(response[0].stock_quantity, itemId);
    });
}

function addMore(currStock, id) {
    getAllProductIds();
    let itemToUpdate = id;
    let currentStock = parseInt(currStock);
    inquirer
    .prompt([
        {
            type: 'number',
            message: 'How many units are you adding to inventory?',
            name: 'quantityAdded'
        }
    ])
    .then(function (response) {
        let newStock = currentStock + parseInt(response.quantityAdded);
        let updateStock = {stock_quantity : newStock};
        connection.query('UPDATE products SET ? WHERE ?', [updateStock, itemToUpdate], function (err, response) {
            if (err) throw err;
            console.log(`Inventory adjustment was successful. The new quantity in stock is ${newStock}.`);
            anotherAction();
        });
    });
}

function addNew() {
    inquirer
    .prompt([
        {
            type: 'input',
            message: 'What product are you adding?',
            name: 'newProdName'
        }, 
        {
            type: 'input',
            message: 'What is the department for the product you are adding?',
            name: 'newDeptName'
        }, 
        {
            type: 'number',
            message: 'What is the price per unit?',
            name: 'newPrice' 
        }, 
        {
            type: 'number',
            message: 'How many are in stock?',
            name: 'newQuantity'
        }
    ])
    .then(function (response) {
        let newItem = {
            product_name: response.newProdName,
            department_name: response.newDeptName,
            price: response.newPrice,
            stock_quantity: response.newQuantity 
       };
        connection.query('INSERT INTO products SET ?', newItem, function (err, response) {
            if (err) throw err;
            console.log(`The item has been successfully added.`);
            anotherAction();
        });
    });
}


function menuOptions() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What action would you like to take?',
                choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
                name: 'action'
            }
        ])
        .then(function (response) {
            let action = response.action;
            switch (action) {
                case 'View Products for Sale':
                    viewAll();
                    break;
                case 'View Low Inventory':
                    viewLow();
                    break;
                case 'Add to Inventory':
                    selectAddMore();
                    break;
                case 'Add New Product':
                    addNew();
                    break;
                default:
                    console.log('Something went wrong.')
            }
        });
}

menuOptions();
