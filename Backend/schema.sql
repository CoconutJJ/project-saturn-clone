DROP DATABASE IF EXISTS saturn;

CREATE DATABASE IF NOT EXISTS saturn;

USE saturn;

CREATE TABLE users(
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `fname` VARCHAR(255) NOT NULL,
    `lname` VARCHAR(255) NOT NULL,
    `uname` VARCHAR(255) NOT NULL,
    `pword` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `ctime` INT NOT NULL DEFAULT UNIX_TIMESTAMP(),  -- Creation Time
    `utime` INT NOT NULL DEFAULT UNIX_TIMESTAMP()   -- Last Update Time
)
