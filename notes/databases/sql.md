# SQL Notes


### SQL Syntax
```
   .- Data
  /.- Definition
 //.- Language
///
DDL: DDL stands for data definition language which deals with special keywords that create and modify tables and create 	 and modify databases. In other words--DDL deals with schema.

   .- Data
  /.- Manipulation
 //.- Language
///
DML: DML stands for data manipulation language, and that deals with the CRUD operations in a database-- creating, 
	 reading, updating, and deleting data.
```

### Data Types


-- Character Type:
	
	VARCHAR2

	CHAR

-- Date Data Type

-- LOB Data Type

-- Number Data Type:

	Integer

	Fixed-Point (precision, scale)

	Floating-Point


Varchar2(10) Entering the word Bill
	-Storing the word Bill = Bill (The Space is Reallocated from 10 to 4 characters) 

Char(10) Entering the word Bill
	-Storing the word Bill = Bill###### where # = Added Spaces (The Space is not reallocated, it takes up all 10 spaces) 

Number(Precision, Scale)
	-Precision = Total Number of Digits
	 Scale = Total Number of Digits to the right of the decimal place.  

	Ex:

	 Integer =  Number(5) 		- Biggest number would be 99999
	 
	Fixed point = Number(5,2) 	- Biggest number would be 999.99 
	
	Floating Point = Number 	- Could be 99.9 or 99999 or 9.999










Editing Commands: -------------------------------------------------------------------------------------

LIST  					  : Run the command currently in the buffer  (L) 

<line number> 			  : Changes the current line and displays the number.  

APPEND <text> 			  : Add text at the end of the current line (A) 

CHANGE /old text/new text : Change text in current line (C) 

DELETE 					  :  Delete the current line (DEL) 

INSERT <text>			  : Insert line following current line (I)  

LIST <line number>  	  : Shows the indicated line number text. (L) 

/ 						  :  Executes the contents of the edit buffer








Integrity Rules: -------------------------------------------------------------------------------------

Integrity Constraints are used to apply business rules for the database tables.


Syntax:
	
	TableName_ColumnName_ConstraintID 


The Constraint IDs are as follows:
	
	Primary Key  		= PK
	
	Foreign Key  		= FK
	
	Not Null  			= NN
	
	Legal Values (Check)= CK
	
	Unique  			= UN


	Ex:

	CREATE TABLE employee  			 .- Primary key integrity constraint
	( 				|---------------'---------------------|
		id number(5) CONSTRAINT employee_id_pk PRIMARY KEY, 
		 name char(20),
		 dept char(10), 
		age number(2),
		 salary number(10),
		 location char(10)
	 );

This constraint identifies any column referencing the PRIMARY KEY in another table. It establishes a relationship between two columns in the same table or between different tables. For a column to be defined as a Foreign Key, it should be defined as a Primary Key in the table which it is referring.

	Ex:

	CREATE TABLE items 
	( 
		order_id number(5) CONSTRAINT items_od_id_pk PRIMARY KEY,   	
							|------------------------------------|-.
		product_id number(5) CONSTRAINT items_pd_id_fk REFERENCES,  '- Foreign Key integrity constraint
		product(product_id),   <------------------------------------ -- This is the table and field that is being 
		product_name char(20), 										   referenced
		 supplier_name char(20),
		 unit_price number(10)
	); 


	Ex:

	CREATE TABLE employee 							.- Not Null integrity Constraint
	( 							   |---------------'--------------------|
		id number(5),  name char(20) CONSTRAINT employee_name_nn Not Null, 
		dept char(10),
		 age number(2), 
		salary number(10), 
		location char(10) 
	);

This constraint ensures all rows in the table contain a definite value for the column which is specified as not null. This means a null value is not allowed in that field.


	Ex:

	CREATE TABLE employee 
	( 
		id number(5),  
		name char(20),
		 dept char(10),
		 age number(2),					 	 .- Unique integrity constraint
		 salary number(10), |----------------'--------------------|
		 location char(10)  CONSTRAINT employee_location_un Unique 
	);

This constraint ensures that a column or a group of columns in each row have a distinct value. The column(s) can have null values but the values cannot be duplicated.


	Ex:

	CREATE TABLE employee
	 ( 
		id number(5), 
		 name char(20),
		 dept char(10),									.- Check integrity Constraint
		 age number(2), |-------------------------------'--------------------|
		 gender char(1) CONSTRAINT emp_gender_ck Check (gender in (‘M’, ‘F’)),
		 salary number(10),
		 location char(10)
	);

This constraint defines a business rule on a column. All the rows must satisfy this rule. The constraint can be applied for a single column or a group of columns. 









Adding Rows To A Table: -------------------------------------------------------------------------------------

Once tables are created in a database, data can be loaded into them by using the INSERT command
The INSERT command adds rows to a table
To use this command:
Type INSERT INTO followed by the name of the table into which data is being added
Type the VALUES command followed by the specific values to be inserted in parentheses
To enter a null value into a table, a special format of the INSERT command must be used
Identify the names of the columns that will accept non-null values, and then list only these non-null values after the VALUES command 

	Ex:

	INSERT INTO Location 
	VALUES (53, ‘BUS’, ‘424’, 1);


	Ex:

	INSERT INTO Faculty  (fid, flname, ffname, fmi, locid) 
	VALUES (1, ‘Cox’, ‘Kim’, ‘J’, 53);


	Ex:

	INSERT INTO Student 
	VALUES (101, ‘Umato’, ‘Brian’, ‘D’, ‘454 St. John’’s Street’, ‘Eau Claire’, ‘WI’, ‘54702’, ‘7155552345’, ‘SR’);









Viewing Table Data: -------------------------------------------------------------------------------------

Use SELECT command
Can display all the rows and columns in a table
SELECT * FROM followed by the name of the table and end with a semicolon
Select * From Employee;


Information about tables in the database is kept in the system catalog or the data dictionary
The system catalog is a relational database
Information can be retrieved by using the same types of queries which are used to retrieve data in a relational database 
The DBMS updates the system catalog automatically
Users should not use SQL queries to update the catalog directly because this might produce inconsistent information


	Ex: 		(List all Constraints that you set up in your tables)

	Select CONSTRAINT_NAME 
	From USER_CONSTRAINTS 
	Where TABLE_NAME =‘CUSTOMER’; 	<-- TABLE NAME NEEDS TO BE ALL UPPER CASE
					  ^._
 					     '- MAKE SURE THERE'S NO SPACES BETWEEN = AND THE TABLE NAME

	Ex: 		(List all Table Names that you created in your database)

	Select TABLE_NAME 
	From USER_TABLES;


	Ex: 		(List the Columns and data types, along with all other table structures that are set up on a particular
	 			 Table  that you set up in your database)

	DESCRIBE  Customer;








JOINS---
http://goo.gl/guE4hd
























