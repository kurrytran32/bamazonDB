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

            console.log(`ID: ${res[i].item_id} \nProduct Name: ${res[i].product_name} \nPrice: $${res[i].price}\n`);
            console.log(separator);

        }
    })
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
         inquirer.prompt([
            {
                name: 'userItem',
                type: 'input',
                message: 'Which would you like to purchase?'
            },
            {
                message: 'How many would you like to buy?',
                type: 'input',
                name: 'itemAmount'
            }

        ]).then(answers => {
            let item = answers.userItem;
            let amount = answers.itemAmount;

            //starting another connection query to check for info of the item
            connection.query('SELECT * FROM products WHERE ?', [
                {
                    item_id: item
                }
            ], function (err, response){
                if(err) throw err;
                let inventory = response[0].stock_quantity;
                let proName = response[0].product_name;
                if(amount <= inventory){
                    console.log(`Successfully spent money! \nYou bought ${proName}!`);
                    console.log('Updating quantity~~~');
                    connection.query('UPDATE products SET ? WHERE ?', [
                        {
                            stock_quantity: inventory - amount
                        },
                        {
                            item_id: item
                        }
                    ], function(err, res){
                        console.log(`${proName}: ${inventory} left in stock`);
                        spendMore();
                    }) 
                } else {
                    console.log(`Not enough in stock :-( only ${inventory} left...`)
                    // buy something else
                    spendMore();
                }
                
                
            })
        })
    })
}

//Buy something else function to reloop 
function spendMore() {
    inquirer.prompt([
        {
            type:'confirm',
            name: 'repeat',
            message: 'Would you like to buy something else?'
        }
    ]).then(answer => {
        
        if(answer.repeat){
            console.log(`Great! Time to spend more money!`);
            viewCatalog();
        } else {
            console.log('Okay! Please come again soon!');
            connection.end();
        }
    })
}