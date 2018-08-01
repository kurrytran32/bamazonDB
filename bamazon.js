var mysql = require("mysql");
const inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "coding123",
    database: "bamazonDB"
});

let separator = '===================================';

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    viewCatalog();
});
//first Step: viewing inventory item_id, item name and price
function viewCatalog() {
    //setting to show query to make sure we're writing proper sql code
    connection.query("SELECT * FROM products", function (err, res) {
        // console.log(res);

        for (let i = 0; i < res.length; i++) {

            console.log(`${res[i].item_id}: ${res[i].product_name} \nPrice: $${res[i].price}\n`);
            console.log(separator);

        }
    })
    // connection.end();
    //run inquirer for choosing which to buy
    userSelection();
};

function userSelection() {
    connection.query("SELECT * FROM products", function (err, res) {
        let selectionArray = [];
        for (let i = 0; i < res.length; i++) {
            let items = res[i];
            selectionArray.push(items.product_name);
        }
        // console.log(selectionArray);
        inquirer.prompt([
                {
                    name: 'userItem',
                    type: 'rawlist',
                    message: 'Which would you like to purchase?',
                    choices: selectionArray,
                }, 
                {
                    message: 'How many would you like to buy?',
                    type: 'input',
                    name: 'itemAmount'
                }

            ]).then(answers => {
                console.log(answers.userItem);
                console.log(answers.itemAmount);
                let item = answers.userItem;
                let amount = answers.itemAmount;
                
                //starting another connection query to check for info of the item
                connection.query('SELECT * FROM products WHERE ?', {})
            })
    })
    connection.end();
}
