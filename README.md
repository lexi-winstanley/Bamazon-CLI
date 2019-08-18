# Bamazon CLI

## Description
This is a CLI App that allows users to take actions as a customer, manager or supervisor. As a customer they are able to view products stored in a MySQL database then select a product and quantity to purchase. The application then checks to ensure the quantity requested is in stock, if yes the order goes through and the in stock quantity is updated, the total is displayed to the user and added to the total product sales. If there is insufficient quantity to fill the order the user is alerted and prompted to choose another quantity. As a manager the user is able to view all products for sale, view products with inventory less than 5, add to inventory of a product or add a new product. When the manager adds inventory or a new product the MySQL database  is updated. As a supervisor the user is able to view product sales summed by department and add new departments. Upon launch the application checks to see if the departments table is up-to-date, meaning that all departments listed in the products table are also included in the departments table. If there are missing departments, the user is alerted and has the option to add the missing departments. 

## Organization
This application is organized into 3 JavaScript files, one for each role (customer, manager, supervisor). The NPM package Inquirer is used to handle all user prompts once a file is launched. 

## Instructions
**Notes:** this application requires Node.js and several Node packages. These dependencies can be found in the package.json file and are necessary for Bamazon-CLI to work as described.

From the terminal type one of the following: 

**node bamazonCustomer.js**
You will be presented with the following prompts: 
![Customer Prompts](https://raw.githubusercontent.com/lexi-winstanley/Bamazon-CLI/master/screenshots/customerPrompt.PNG)

Once you select an item ID and quantity to purchase, the application checks for the desired quantity and then the transaction completes: 
![Customer Transaction](https://raw.githubusercontent.com/lexi-winstanley/Bamazon-CLI/master/screenshots/customerTransaction.PNG)

You can then choose to purchase another item or not. If you select no, the following screen will display: 
![Customer Exit](https://raw.githubusercontent.com/lexi-winstanley/Bamazon-CLI/master/screenshots/customerEnd.PNG)

**node bamazonManager.js**
You will be presented with the following prompts: 
![Manager Prompts](https://raw.githubusercontent.com/lexi-winstanley/Bamazon-CLI/master/screenshots/managerPrompt.PNG)

If you select 'View Products for Sale' the following will be prompted/displayed: 
![Manager View All Products](https://raw.githubusercontent.com/lexi-winstanley/Bamazon-CLI/master/screenshots/managerViewProducts.PNG)

If you select 'View Low Inventory' the following will be prompted/displayed: 
![Manager View Low Inventory Products](https://raw.githubusercontent.com/lexi-winstanley/Bamazon-CLI/master/screenshots/managerViewLow.PNG)

If you select 'Add to Inventory' the following will be prompted/displayed: 
![Manager Add Inventory](https://raw.githubusercontent.com/lexi-winstanley/Bamazon-CLI/master/screenshots/managerAddInventory.PNG)

If you select 'Add New Product' the following will be prompted/displayed: 
![Manager Add New Product](https://raw.githubusercontent.com/lexi-winstanley/Bamazon-CLI/master/screenshots/managerAddProduct.PNG)

You can then choose to take another action or not. If you select no, the following screen will display: 
![Manager Exit](https://raw.githubusercontent.com/lexi-winstanley/Bamazon-CLI/master/screenshots/managerEnd.PNG)

**node bamazonSupervisor.js**
You will be presented with the following prompts: 
![Supervisor Prompts](https://raw.githubusercontent.com/lexi-winstanley/Bamazon-CLI/master/screenshots/supervisorPrompt.PNG)

If there are departments in the products table that are not included in the departments table, you will be prompted to add the missing departments: 
![Supervisor Add Missing Departments](https://raw.githubusercontent.com/lexi-winstanley/Bamazon-CLI/master/screenshots/supervisorAddMissing.PNG)

If you select 'View Product Sales by Department' the following will be prompted/displayed: 
![Supervisor View Product Sales by Department](https://raw.githubusercontent.com/lexi-winstanley/Bamazon-CLI/master/screenshots/supervisorView.PNG)

If you select 'Add New Department' the following will be prompted/displayed: 
![Supervisor Add New Department](https://raw.githubusercontent.com/lexi-winstanley/Bamazon-CLI/master/screenshots/supervisorAddNew.PNG)

You can then choose to purchase another item or not. If you select no, the following screen will display: 
![Supervisor Exit](https://raw.githubusercontent.com/lexi-winstanley/Bamazon-CLI/master/screenshots/supervisorEnd.PNG) 

## Technologies Used
**JavaScript**
<br/>**Node.js**

**Node Packages:** 
<br/>mysql, inquirer, cli-table

## Role
Sole developer with functionality requirements provided by UW Coding Bootcamp/Trilogy Education Services.
