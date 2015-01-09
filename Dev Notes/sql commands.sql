#**************** COMMENTS *******************

# This comment continues to the end of line
-- This comment continues to the end of line
/* this is an in-line comment */



#**************** Create a Table *******************

CREATE TABLE table_name
(
column_name1 data_type(size),
column_name2 data_type(size),
column_name3 data_type(size),
....
);



#**************** Insert Columns Into A Table *******************

INSERT INTO Level1_Customer
SELECT customer_num, customer_name, balance, credit_limit, rep_num
FROM customer
WHERE credit_limit = 7500;



#**************** Viewing Table Data *******************

SELECT * FROM table name;




#**************** Viewing Duplicate Records ******************* mysql

SELECT DISTINCT(column_name) AS field, COUNT(column_name) AS fieldCount FROM 
table_name GROUP BY column_name HAVING fieldCount > 1




#**************** Deleting Duplicate Records *******************
-- Didn't get to work but I'm sure it's not that hard

DELETE FROM table_name 
USING table_name, table_name AS vtable 
WHERE 
    (table_name.id > vtable.id) 
AND (table_name.req_field=req_field)



# Link: (http://goo.gl/WWBJZz)

#**************** List All Constraints Setup Within Table *******************

Select CONSTRAINT_NAME 
From USER_CONSTRAINTS 
Where TABLE_NAME = ‘CUSTOMER’;



#**************** List All Table Names *******************

SELECT table_name
FROM user_tables;



#**************** List Columns & Data Types  *******************

DESCRIBE branch;
DESCRIBE Publisher;
DESCRIBE BOOK;


#**************** Display All Data From Table *******************

SELECT * FROM branch
SELECT * FROM Publisher;



#**************** Adding A Record / Row Of Data *******************

INSERT INTO branch VALUES
('1', 'Henry Downtown', '16 Riverview', '10');
INSERT INTO branch VALUES
('2', 'Henry On The Hill', '1289 Brentwood', '6');



#**************** Creating A New Table From An Existing Table *******************

INSERT INTO level1_customer
SELECT customer_num, customer_name, balance, credit_limit, rep_num
FROM customer
WHERE credit_limit = 7500;



#**************** Change Existing Data In A  Table *******************

UPDATE Customer  
SET credit_limit = 1200  
WHERE credit_limit = 1000  
AND Balance < Credit_limit;



#**************** COMMANDS *******************

COMMIT; --Updates will SAVE immediately by executing this command.

EXIT; -- Updates become permanent automatically when the DBMS is exited

ROLLBACK; --reverses only changes made to the data, not the table’s structure

DROP TABLE table; --how you delete a table

BETWEEN:  -- can have problems with DATES
Select Customer_Number, Last, First, Balance 
From Customer 
Where Balance BETWEEN 500 AND 1000;


#**************** Deleting Existing Rows From  A Table *******************

DELETE FROM Customer  
WHERE Last = 'Williams';


#**************** Changing a Value in a Column  to Null *******************

UPDATE Customer  
SET street = NULL  
WHERE CustomerNum = ‘895‘; 


#**************** Changing Table Structures *******************

ALTER TABLE table
ADD column CHAR(1);

ALTER TABLE table
MODIFY column NOT NULL;


# NEXT PPT **************** SELECT Command *******************  NEXT PPT

SELECT clause
	Followed by columns to be included in the query

FROM clause
	Followed by name of the table that contains the data to query

WHERE clause (optional)
	Followed by conditions that apply to the data to be retrieved



#**************** Query Example *******************

SELECT customer_num, last, first, balance, credit_limit
FROM customer
WHERE Balance > Credit_limit



#**************** use of LIKE *******************

SELECT customer_num, last, first, street, city, state, zip
FROM customer
WHERE street LIKE %Pine%; -- case sensitive
--WHERE street LIKE Pine%; -- will return everything beginning with Pine
--WHERE street like %Pine; -- will return things ending with Pine
				lower(); -- returns whatever is passed in as lower

customer_num   last    first   street   				city   state    zip
222				cory    bob    123 north Pine ave.		indy	IN      46037
222				cory    bob    215 Pine street	  	    indy	IN      46037
222				cory    bob    987 West Star Pine ln	indy	IN      46037

#**************** use of IN *******************

#Example 1:
Select Customer_Number, Last, First, Credit_Limit 
From Customer 
Where Credit_Limit IN (1000, 1500, 2000); 

#Example 2: (Gives the same result as Example 1)
Select Customer_Number, Last, First, Credit_Limit 
From Customer 
Where Credit_Limit = 1000 
OR Credit_Limit = 1500 
OR Credit_Limit = 2000; 


#**************** sorting with ORDER BY and DESC *******************

Select Customer_Number, Last, First, Credit_Limit 
From Customer 
ORDER BY LAST DESC, Customer_Number;

THIS WILL SORT WITH THE LAST NAMES STARTING WITH 'A' AT THE BOTTOM


#**************** SQL 4 Special Functions *******************

AVG   -- Calculates the average value in a column
COUNT -- Determines the number of rows in a table
MAX   -- Determines the maximum value in a column
MIN   -- Determines the minimum value in a column
SUM   -- Calculates the total of the values in a column
MOD() -- Returns the remainder of the values

SELECT SUM(balance) AS total, AVG(balance) AS average,
MAX(balance) AS maximum, MIN(balance) AS minimum,
COUNT(*)
FROM customer;

TOTAL 	AVERAGE 	MAXIMUM 	MINIMUM 	COUNT(*)
-----	-----		-----		-----		-----
32412	23423		2342342		21.5 		15

#**************** Nesting Queries **************** ppt 26 ***

Two Part Example:
Select Part_Num 
From Part 
Where Class = ‘AP’
 
Select OrderNumber 
From OrderLine 
Where Part_Num IN (‘CD52’,’DR93’,’DW11’,’KL62’,’KT03’);


#**************** Subqueries *******************

Select Order_Num 
From Order_Line 
Where Part_Num IN 
(Select Part_Num 
	From Part 	        #<- Subquery in parenthesis
	Where Class = ‘AP’);


#**************** GROUP BY *******************

#Example 1:
SELECT count(type IS '')
FROM  Customer
GROUP BY Slsrep_Number;

#Example 2: 
SELECT Slsrep_Number, count(*)
FROM  Customer
GROUP BY Slsrep_Number;

#**************** HAVING Clause *******************

HAVING vs. WHERE
WHERE --clause limits rows
HAVING --clause limits groups

#Example:
Select OrderNum, Sum(NumOrdered * QuotedPrice) 
From OrderLine 
Where QuotedPrice > 100 
Group By OrderNum 
Having Sum(NumOrdered * QuotedPrice) > 1000 
Order By OrderNum; 



#**************** NULLS *******************

#Correct Example:
Select Customer_Num, Customer_Name 
From Customer 
Where Street IS NULL;

#Incorrect Example:
Select Customer_Num, Customer_Name 
From Customer 
Where Street = ‘NULL’


#**************** IN CLASS *******************

DESC tableName

this will list all the column Names

NOT, !=, <>   -- all mean not equal


# NEXT PPT **************** Multiple Table Queries ******************* NEXT PPT




#**************** JOINING 2 TABLES *******************

SELECT CustomerNum, CustomerName, Rep.RepNum, LastName, FirstName
FROM Customer, Rep
WHERE Customer.RepNum = Rep.RepNum
AND Customer.City = 'Grove';


#**************** TABLE ALIAS *******************

SELECT CustomerNum, CustomerName, R.RepNum, LastName, FirstName
FROM Customer C, Rep R
WHERE C.RepNum = R.RepNum
AND C.City = 'Grove';


#**************** Joining Several Tables *******************

SELECT CustomerNum, CustomerName, Rep.RepNum, LastName, FirstName
FROM Customer, Rep, Book
WHERE Customer.RepNum = Rep.RepNum
AND Customer.book_num = Book.book_num;


#**************** UNION command *******************
-- The union of two tables is a table containing every row that is in either the first table, the second table, or both tables

SELECT CustomerNum, CustomerName
FROM customer
WHERE RepNum = '65'
	UNION
SELECT Customer.CustomerNum, Customer.CustomerName
FROM Customer, Orders
WHERE Customer.CustomerNum = Orders.CustomerNum;


#**************** INTERSECT command *******************
-- The intersection (intersect) of two tables is a table containing all rows that are in both tables

SELECT CustomerNum, CustomerName
FROM customer
WHERE RepNum = '65'
	INTERSECT
SELECT Customer.CustomerNum, Customer.CustomerName
FROM Customer, Orders
WHERE Customer.CustomerNum = Orders.CustomerNum;


#**************** MINUS command *******************
-- The difference (minus) of two tables is the set of all rows that are in the first table but that are not in the second table 

SELECT CustomerNum, CustomerName
FROM customer
WHERE RepNum = '65'
	MINUS
SELECT Customer.CustomerNum, Customer.CustomerName
FROM Customer, Orders
WHERE Customer.CustomerNum = Orders.CustomerNum;


#**************** NATURAL JOIN *******************

SELECT *
FROM book bk
	NATURAL JOIN publisher pb;


SELECT *
FROM BOOK bk
	NATURAL JOIN PUBLISHER pb;
WHERE city = 'Boston';


#**************** INNER JOIN *******************

SELECT *
FROM book bk
	INNER JOIN publisher pb ON bk.publisher_code = pb.publisher_code;


SELECT bk.TITLE, bk.TYPE, bk.PRICE, pb.PUBLISHER_NAME, pb.CITY, publisher_code
FROM book bk
	INNER JOIN publisher pb ON bk.publisher_code = pb.publisher_code;
WHERE city = 'Boston';


#**************** OUTER JOIN *******************






#**************** CREATING VIEWS *******************

--(creating view code)
CREATE VIEW houseware AS
SELECT part_num, description, on_hand, price
FROM part
WHERE class = 'HW';


--(display view code)
SELECT *
FROM houseware
WHERE on_hand < 25;


--(actual query executed / underlying SQL code)
SELECT part_num, description, on_hand, price
FROM part
WHERE class = 'HW'
AND on_hand > 10;


#**************** GRANT PRIVILEGES *******************

-- retrieve data from the rep table
GRANT SELECT ON rep TO Johnson;

-- Smith and Brown download new parts to the PARTS table
GRANT INSERT ON part TO Smith, Brown;

-- Anderson change name & email address of customers
GRANT UPDATE (customer_name, street) ON customer TO Anderson;

-- Thompson must be able to delete order lines
GRANT DELETE ON order_line TO Thompson;

-- Every user must be able to retrieve part->numbers, descriptions, & item classes
GRANT SELECT (part_num, description, class) ON part TO PUBLIC;

-- Robert must be able to create index on REP table
GRANT INDEX ON rep TO Roberts;

-- Thomas needs to change structure to CUSTOMER table
GRANT ALTER ON customer TO Thomas;

-- Wilson need all privileges on REP table
GRANT ALL ON rep TO Wilson;


#**************** REVOKE PRIVILEGES *******************

-- Johnson no longer allowed to retrieve data from REP table
REVOKE SELECT ON rep FROM Johnson;


#**************** CREATING INDEXES *******************

-- create the BALIND index on the BALANCE column
CREATE INDEX balind ON customer(balance);

-- create the REPNAME index on the LAST_NAME and FIRST_NAME columns
CREATE INDEX repname ON rep(last_name, first_name);



#**************** Something *******************







#**************** CONCATINATION *******************

CONCATINATION is performed with ||

SELECT rep_num, Rtrim(first) || ' ' || Rtrim(last)
FROM rep



#**************** Something *******************







#**************** Something *******************




