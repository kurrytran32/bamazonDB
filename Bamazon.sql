DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;
USE bamazonDB;

CREATE TABLE products(
	item_id INT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50),
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT(10) NOT NULL
    
)