/*
view product sales by department
    when new products are added? maybe alert as first step that there are new products that fall into new departments and would you like to create new departments? display products that are in those new departments?, the department names used need to come into departments table in department_name, get department_id, set default over_head_costs??
        check current products against departments table?

    needs to aggregate all product_sales (price of item * quantity purchased for each item, added each time more of that item is purchased)
    total_profit column is not stored anywhere, use alias to generate on the fly = product_sales - over_head_costs

add new department
    inquirer--name, over_head_costs
 */

//get all depts from products then populate table
const mysql = require('mysql');
const inquirer = require('inquirer');
const Table = require('cli-table');

const table = new Table({
    head: ['Department ID', 'Department Name', 'Product Sales', 'Overhead Costs', 'Total Profit']
    , colWidths: [10, 30, 30, 10, 20]
});

let connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'nodeuser',
    password: 'password',
    database: 'bamazon'
});

let currDepts = [];
let storedDepts = [];
let missingDepts = [];

function getCurrentDepts() {
    connection.query('SELECT * FROM products', function (err, response) {
        if (err) throw err;
        for (let i = 0; i < response.length; i++) {
            if (currDepts.includes(response[i].department_name) === false) {
                currDepts.push(response[i].department_name);
            }
        }
    });
}

function getStoredDepts() {
    connection.query('SELECT * FROM departments', function (err, response) {
        if (err) throw err;
        for (let i = 0; i < response.length; i++) {
            if (storedDepts.includes(response[i].department_name) === false) {
                storedDepts.push(response[i].department_name.toLowerCase());
            }
        }
        compareDepartments();
    });
}

function compareDepartments() {
    for (let j = 0; j < currDepts.length; j++) {
        if (storedDepts.includes(currDepts[j]) === false) {
            missingDepts.push(currDepts[j]);
        }
    }
    if (missingDepts.length === 0) {
        menuOptions();
    } else {
        addMissing();
    }
}

function addMissing() {
    console.log(`The following departments are missing: \n${missingDepts.join('\n')}`)
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Would you like to add the missing departments at this time?',
                choices: ['yes', 'no'],
                name: 'missingDecision'
            }
        ])
        .then(function (response) {
            if (response.missingDecision === 'yes') {
                missingDeptInfo(missingDepts.length);
            } else {
                console.log('Okay. You will be alerted of the missing departments again the next time you launch this application.');
                menuOptions();
            }
        });
}

function missingDeptInfo(timesToRun) {
    let stillMissing = timesToRun;
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Select department to add: ',
                choices: missingDepts,
                name: 'addDept'
            },
            {
                type: 'number',
                message: 'What are the overhead costs for this department?',
                name: 'newCost'
            }
        ])
        .then(function (response) {
            stillMissing--;
            let missedDept = {
                department_name: response.addDept,
                over_head_costs: response.newCost
            };
            connection.query('INSERT INTO departments SET ?', missedDept, function (err, response) {
                if (err) throw err;
                console.log(`The department has been successfully added.`);
                if (stillMissing === 0) {
                    anotherAction();
                } else {
                    missingDeptInfo(stillMissing);
                }
            });
        });
}

function addNew() {
    getStoredDepts();
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the name of the department to be added?',
                name: 'newDept'
            },
            {
                type: 'number',
                message: 'What are the overhead costs for this department?',
                name: 'newOverhead'
            }
        ])
        .then(function (response) {
            if (storedDepts.includes(response.newDept) === true) {
                console.log('That department already exists.');
                addNew();
            } else {
                let newDept = {
                    department_name: response.newDept,
                    over_head_costs: response.newOverhead
                };
                connection.query('INSERT INTO departments SET ?', newDept, function (err, response) {
                    if (err) throw err;
                    console.log(`The department has been successfully added.`);
                    anotherAction();
                });
            }
        });
}

function viewAll() {
    connection.query(
        `SELECT departments.department_id, 
        departments.department_name, 
        SUM(products.product_sales) as product_sales, 
        MAX(departments.over_head_costs) as over_head_costs, 
        SUM(products.product_sales) - MAX(departments.over_head_costs) as total_profit
        FROM departments
        INNER JOIN products ON departments.department_name = products.department_name
        GROUP BY departments.department_id, departments.department_name;`,
        function (err, response) {
            if (err) throw err;
            for (let i = 0; i < response.length; i++) {
                table.push([response[i].department_id, response[i].department_name, response[i].product_sales.toFixed(2), response[i].over_head_costs.toFixed(2), response[i].total_profit.toFixed(2)]);
            }
            console.log(table.toString())
            anotherAction();
        });
}

function menuOptions() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What action would you like to take?',
                choices: ['View Product Sales by Department', 'Add New Department'],
                name: 'action'
            }
        ])
        .then(function (response) {
            let action = response.action;
            switch (action) {
                case 'View Product Sales by Department':
                    viewAll();
                    break;
                case 'Add New Department':
                    addNew();
                    break;
                default:
                    console.log('Something went wrong.')
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

getCurrentDepts();
getStoredDepts();
