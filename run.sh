#!/bin/sh

service mysql start
mysql -uroot < Backend/mysql-setup.sql
mysql -uroot -p1234 < Backend/schema.sql
cd Backend/
echo "Saturn running on PORT 8080, this port has been exposed, you should be able to connect directly via localhost in your browser"
node server.js