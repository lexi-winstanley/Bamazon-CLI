# Bamazon CLI

## Description
This is a CLI App that allows users to take actions as a customer, manager or supervisor. As a customer they are able to view products stored in a MySQL database then select a product and quantity to purchase. The application then checks to ensure the quantity requested is in stock, if yes the order goes through and the in stock quantity is updated, the total is displayed to the user and added to the total product sales. If there is insufficient quantity to fill the order the user is alerted and prompted to choose another quantity. As a manager the user is able to view all products for sale, view products with inventory less than 5, add to inventory of a product or add a new product. When the manager adds inventory or a new product the MySQL database  is updated. As a supervisor the user is able to view product sales summed by department and add new departments. Upon launch the application checks to see if the departments table is up-to-date, meaning that all departments listed in the products table are also included in the departments table. If there are missing departments, the user is alerted and has the option to add the missing departments. 

## Organization
This application is organized into 3 JavaScript files, one for each role (customer, manager, supervisor). The NPM package Inquirer is used to handle all user prompts once a file is launched. 

## Instructions
**Notes:** this application requires Node.js and several Node packages. These dependencies can be found in the package.json file and are necessary for Bamazon-CLI to work as described.


## Technologies Used
**JavaScript**
<br/>**Node.js**

**Node Packages:** 
<br/>mysql, inquirer, cli-table

## Role
Sole developer with functionality requirements provided by UW Coding Bootcamp/Trilogy Education Services.
