-- db.sql
CREATE DATABASE inventory_db;
USE inventory_db;

CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    item_cost INT NOT NULL,
    description TEXT,
    quantity INT NOT NULL,
    available INT NOT NULL
);