DROP DATABASE IF EXISTS saturn;

CREATE DATABASE IF NOT EXISTS saturn;

USE saturn;

CREATE TABLE users(
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `fname` VARCHAR(255) NOT NULL,
    `lname` VARCHAR(255) NOT NULL,
    `uname` VARCHAR(255) NOT NULL,
    `pword` VARCHAR(255) NOT NULL,
    `salt`  VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `ctime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- Creation Time
    `utime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP   -- Last Update Time
);

CREATE TABLE projects(
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `env` ENUM('python', 'c'),
    `owner` VARCHAR(255) NOT NULL,
    `ctime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- Creation Time
    `utime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP   -- Last Update Time
);

CREATE TABLE documents(
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `projectID` INT,
    `ctime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- Creation Time
    `utime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP   -- Last Update Time
);

CREATE TABLE shareDbOps(
  collection varchar(255) not null,
  doc_id varchar(255) not null,
  version int(11) not null,
  operation text not null, -- {v:0, create:{...}} or {v:n, op:[...]}
  _ctime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, -- creation time
  PRIMARY KEY (collection, doc_id, version)
);

CREATE TABLE shareDbSnapShots(
  collection varchar(255) not null,
  doc_id varchar(255) not null,
  doc_type varchar(255) not null,
  version int(11) not null,
  data text not null,
  _ctime datetime DEFAULT NULL, -- creation time
  _mtime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- last modified time
  PRIMARY KEY (collection, doc_id)
);