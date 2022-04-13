const express = require('express'); //Line 1
const app = express(); //Line 2
const port = process.env.PORT || 5000; //Line 3

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

db.serialize(function() {
  db.run("CREATE TABLE PRODUCT (P_SKU varchar(13) PRIMARY KEY, P_Name varchar(20) NOT NULL, P_Size varchar(20) NOT NULL, P_Color varchar(20) NOT NULL, P_Unit_Pallet int(11) NOT NULL, P_Sqft_Pallet int(10) NOT NULL, P_Pallet_Weight int(10) NOT NULL, P_Price decimal(5,2) NOT NULL, P_Pallets_Count int(11) DEFAULT 0 NOT NULL)");

  let product = db.prepare("INSERT INTO PRODUCT VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)");
  product.run('co-gax-351', 'Coastal', '6x12', 'Galaxy', 144, 108, 3160, 3.25, 200);
  product.run('do-nat-151', 'Dorado 60MM', '6x6', 'Natural', 432, 108, 2894, 2.82, 300);
  product.run('ma-nat-111', 'Manhattan Slabs 50MM', '12 x 24', 'Natural', 44, 88, 2112, 7.88, 30);
  product.run('st-char-002', 'Standard Pavers 60MM', '225mmx112.5mm', 'Charcoal', 360, 98, 2800, 2.72, 530);
  product.run('ur-char-210', 'Urban Series 60MM', '6x6', 'Charcoal', 432, 108, 3020, 3.25, 145);
  product.run('vi-wint-410', 'Village Series', '6x6', 'Winter Sky', 432, 108, 3020, 3.55, 13);
  product.finalize();

  db.run("CREATE TABLE SALESPERSON (S_SalespersonID int(11) PRIMARY KEY, S_First_Name varchar(30) NOT NULL, S_Last_Name varchar(30) NOT NULL, S_Phone_Number varchar(30), S_Email varchar(255) NOT NULL)");

  let salesperson = db.prepare("INSERT INTO SALESPERSON VALUES(?, ?, ?, ?, ?)");
  salesperson.run(1, 'Dniren', 'Olensby', '922-754-3848', 'dolensby0@youtube.com');
  salesperson.run(2, 'Steward', 'Walczak', '933-200-8638', 'swalczak1@sina.com.cn');
  salesperson.run(3, 'Christye', 'Tenman', '419-611-3926', 'ctenman2@typepad.com');
  salesperson.finalize()

  db.run("CREATE TABLE CUSTOMER (C_CustomerID int(11) PRIMARY KEY,C_Name varchar(30) NOT NULL,C_Phone_Number varchar(20) NOT NULL,C_Street_Number int(11) NOT NULL,C_Street_Name varchar(30) NOT NULL,C_City varchar(30) NOT NULL,C_Province varchar(30) NOT NULL,C_Postal_Code varchar(10) DEFAULT 'XXX XXX' NOT NULL,C_Email varchar(255) NOT NULL,C_Score int(11) NOT NULL)");
  
  let customer = db.prepare("INSERT INTO CUSTOMER (C_CustomerID, C_Name, C_Phone_Number, C_Street_Number, C_Street_Name, C_City, C_Province, C_Email, C_Score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
  customer.run(1, 'Avrom', '961-203-9925', '6', 'Shoshone', 'Saint-Sauveur', 'Québec', 'anisbith0@ow.ly', 79);
  customer.run(2, 'Hailee', '674-246-8601', '23335', 'Hayes', 'Rayside-Balfour', 'Ontario', 'hkillock1@livejournal.com', 98);
  customer.run(3, 'Birgit', '441-701-9150', '4', 'Thompson', 'Barrie', 'Ontario', 'baylen2@engadget.com', 79);
  customer.run(4, 'Hunfredo', '461-237-7717', '19779', 'Florence', 'Woodstock', 'Ontario', 'hhollows3@symantec.com', 16);
  customer.run(5, 'Mel', '678-609-3894', '1', 'Beilfuss', 'Marathon', 'Ontario', 'mstockwell4@buzzfeed.com', 84);
  customer.finalize()

  db.run("CREATE TABLE QUANTITY (Q_SKU varchar(13) NOT NULL REFERENCES `PRODUCT` (`P_SKU`), Q_PO_Num int(11) NOT NULL REFERENCES `PURCHASE_ORDER` (`PO_Num`), Q_Order_Quantity int(6) NOT NULL, PRIMARY KEY (Q_SKU, Q_PO_Num))");

  let quantity = db.prepare("INSERT INTO QUANTITY (Q_SKU, Q_PO_Num, Q_Order_Quantity) VALUES (?, ?, ?)");
  quantity.run('co-gax-351', 1, 20);
  quantity.run('do-nat-151', 1, 30);
  quantity.run('st-char-002', 2, 200);
  quantity.run('vi-wint-410', 3, 40);
  quantity.run('st-char-002', 3, 120);
  quantity.run('do-nat-151', 3, 80);
  quantity.run('ma-nat-111', 4, 20);
  quantity.run('ur-char-210', 4, 40);
  quantity.run('st-char-002', 5, 100);
  quantity.run('ur-char-210', 5, 20);
  quantity.run('co-gax-351', 6, 60);
  quantity.run('st-char-002', 7, 100);
  quantity.run('st-char-002', 8, 40);
  quantity.run('do-nat-151', 8, 20);
  quantity.finalize()

  db.run("CREATE TABLE PURCHASE_ORDER (PO_Num int(11) PRIMARY KEY, PO_Date varchar(15) NOT NULL, PO_SalespersonID int(11), PO_CustomerID int(11), FOREIGN KEY (PO_SalespersonID) REFERENCES SALESPERSON(S_SalespersonID),FOREIGN KEY (PO_CustomerID) REFERENCES CUSTOMER(C_CustomerID))")
  
  let purchase_order = db.prepare("INSERT INTO PURCHASE_ORDER (PO_Num, PO_Date, PO_SalespersonID, PO_CustomerID) VALUES (?, ?, ?, ?)");
  purchase_order.run(1, '2021-12-23', 2, 2);
  purchase_order.run(2, '2021-12-10', 2, 2);
  purchase_order.run(3, '2021-11-18', 2, 4);
  purchase_order.run(4, '2021-12-29', 1, 1);
  purchase_order.run(5, '2021-11-24', 1, 3);
  purchase_order.run(6, '2021-11-17', 2, 4);
  purchase_order.run(7, '2021-11-04', 2, 5);
  purchase_order.run(8, '2021-11-06', 3, 5);
  purchase_order.finalize()

  db.run("CREATE TABLE INVOICE (I_InvoiceID int(11) NOT NULL, I_Invoiced_Amount float NOT NULL, I_Date DATE NOT NULL, I_status varchar(30) NOT NULL, I_PO_Num int(11) NOT NULL, PRIMARY KEY (I_InvoiceID), FOREIGN KEY (I_PO_Num)  REFERENCES PURCHASE_ORDER(PO_Num))")

  let invoice = db.prepare("INSERT INTO INVOICE (I_InvoiceID, I_Invoiced_Amount, I_Date, I_status, I_PO_Num) VALUES (?, ?, ?, ?, ?)")
  invoice.run(1, 1540.04, '2022-01-14','paid' ,1);
  invoice.run(2, 629.46, '2022-01-02', 'paid', 2);
  invoice.run(3, 1376.21, '2022-01-20','unpaid', 3);
  invoice.run(4, 347.3, '2022-01-01','paid', 4);
  invoice.run(5, 394.54, '2022-01-07', 'unpaid',5);
  invoice.run(6, 1001.73, '2022-01-18','unpaid', 6);
  invoice.run(7, 1146.28, '2022-01-22','paid', 7);
  invoice.run(8, 492.28, '2022-01-03', 'unpaid', 8);
  invoice.finalize();

  // View for query 16 and 17
  db.run("CREATE VIEW Qty_Group AS SELECT SUM(Q_Order_Quantity) AS Total_Quantity, Q_SKU FROM QUANTITY GROUP BY Q_SKU;")

  // View for query 18 and 19
  db.run("Create View I_PO_Dates AS SELECT PO_Date, I_Date FROM INVOICE INNER JOIN PURCHASE_ORDER ON INVOICE.I_InvoiceID = PURCHASE_ORDER.PO_Num;")

  // View for query 20
  db.run("CREATE VIEW Walc_POs AS SELECT PO_Num FROM PURCHASE_ORDER WHERE PO_SalespersonID = (SELECT S_SalesPersonID FROM SALESPERSON WHERE S_Last_Name = 'Walczak');")


});


// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`));


//1 Show product SKU with the highest amount of order
app.get('/query1', (req, res) => {
  db.serialize(function () {
    db.all("SELECT Q_SKU FROM QUANTITY WHERE Q_ORDER_QUANTITY = ( SELECT MAX(Q_ORDER_QUANTITY) FROM QUANTITY)", function (err,row) {
      res.send(row);
    });
  });
});

// 2 Show the product name wigh the previously selected hugh sku
app.get('/query2', (req, res) => {
  db.serialize(function () {
    db.all("SELECT PRODUCT.P_Name FROM PRODUCT, (SELECT Q_SKU, Q_ORDER_QUANTITY FROM QUANTITY WHERE Q_ORDER_QUANTITY = ( SELECT MAX(Q_ORDER_QUANTITY) FROM QUANTITY)) maxt WHERE maxt.Q_SKU = PRODUCT.P_SKU;", function (err,row) {
      res.send(row);
    });
  });
});

// 3 Sum up Quantity ordered for the Q-SKU  with highest order
app.get('/query3', (req, res) => {
  db.serialize(function () {
    db.all("SELECT SUM(Q_ORDER_QUANTITY) FROM QUANTITY WHERE Q_SKU = (SELECT Q_SKU FROM QUANTITY WHERE Q_ORDER_QUANTITY = ( SELECT MAX(Q_ORDER_QUANTITY) FROM QUANTITY));", function (err,row) {
      res.send(row);
    });
  });
});


// 4 Total number of unpaid invoices 
app.get('/query4', (req, res) => {
  db.serialize(function () {
    db.all("select Count (I_INVOICEID)  from INVOICE WHERE I_status = 'unpaid';", function (err,row) {
      res.send(row);
    });
  });
});

//5 Now calculate the total amount of unpaid invoices
app.get('/query5', (req, res) => {
  db.serialize(function () {
    db.all("select sum (I_Invoiced_Amount) as total_unpaid from INVOICE WHERE I_status = 'unpaid';", function (err,row) {
      res.send(row);
    });
  });
});

//6 Name of customer with highest score so discount can be applied
app.get('/query6', (req, res) => {
  db.serialize(function () {
    db.all("Select C_Name from  CUSTOMER WHERE C_Score = (select MAX(C_Score) from CUSTOMER );", function (err,row) {
      res.send(row);
    });
  });
});

// 7 How much $ amount of DORADO 6X6 is in inventory
app.get('/query7', (req, res) => {
  db.serialize(function () {
    db.all("select (P_Sqft_Pallet * P_Pallets_Count * P_Price) as inv_on_hand from PRODUCT WHERE P_Name = 'Dorado 60MM' AND P_Size = '6x6';", function (err,row) {
      res.send(row);
    });
  });
});

// 8 Find total invoice amount of Hailee (cuz highest score) and then apply 10% discount
app.get('/query8', (req, res) => {
  db.serialize(function () {
    db.all("SELECT (round(sum(INVOICE.I_Invoiced_Amount)*.9)) from INVOICE, (SELECT PO_Num FROM PURCHASE_ORDER WHERE PO_CustomerID = (select C_CUSTOMERID from CUSTOMER where C_name = 'Hailee')) pos where pos.PO_NUM = INVOICE.I_PO_Num;", function (err,row) {
      res.send(row);
    });
  });
});

// 9 select invoice with the highest invoiced amount 
app.get('/query9', (req, res) => {
  db.serialize(function () {
    db.all("select max(I_Invoiced_Amount) as 'Largest Single Invoice Amount' from INVOICE;", function (err,row) {
      res.send(row);
    });
  });
});

// 10 select all the customers person with salespersonID 1 has sold to
app.get('/query10', (req, res) => {
  db.serialize(function () {
    db.all("select CUSTOMER.C_Name from (select PO_CustomerID from PURCHASE_ORDER where PO_SalespersonID = 1) cus, CUSTOMER where cus.PO_CustomerID = CUSTOMER.C_CustomerID;", function (err,row) {
      res.send(row);
    });
  });
});

// 11 select the customer with the invoice with the highest amount
app.get('/query11', (req, res) => {
  db.serialize(function () {
    db.all("SELECT C_Name FROM CUSTOMER WHERE C_CustomerID = (SELECT PO_CustomerID FROM PURCHASE_ORDER WHERE PO_Num = (SELECT i_PO_Num FROM INVOICE WHERE I_Invoiced_Amount = (SELECT Max(I_Invoiced_Amount) FROM INVOICE)));", function (err,row) {
      res.send(row);
    });
  });
});

// 12 select all customers residing in Ontario
app.get('/query12', (req, res) => {
  db.serialize(function () {
    db.all("SELECT C_Name FROM CUSTOMER WHERE C_Province = 'Ontario';", function (err,row) {
      res.send(row);
    });
  });
});

// 13 find the total sales for each salesperson
app.get('/query13', (req, res) => {
  db.serialize(function () {
    db.all("select sales.S_Last_Name as 'salesPerson', amounts.sales from (select sum(table1.I_Invoiced_Amount) as 'sales', table2.PO_SalespersonID as 'SalesPersonID' from INVOICE table1 join PURCHASE_ORDER table2 on table1.I_PO_Num = table2.PO_Num group by PO_SalespersonID) as amounts join SALESPERSON sales on sales.S_SalespersonID = amounts.SalesPersonID order by amounts.sales DESC;", function (err,row) {
      res.send(row);
    });
  });
});

// 14 find the best salesperson
app.get('/query14', (req, res) => {
  db.serialize(function () {
    db.all("select t.salesPerson from (select sales.S_Last_Name as 'salesPerson', amounts.sales from ( select sum(table1.I_Invoiced_Amount) as 'sales', table2.PO_SalespersonID as 'SalesPersonID' from INVOICE table1 join PURCHASE_ORDER table2 on table1.I_PO_Num = table2.PO_Num group by PO_SalespersonID ) as amounts join SALESPERSON sales on sales.S_SalespersonID = amounts.SalesPersonID) as t order by t.sales DESC Limit 1;", function (err,row) {
      res.send(row);
    });
  });
});

// 15 return the total amount ($) sold to each customer from highest to lowest
app.get('/query15', (req, res) => {
  db.serialize(function () {
    db.all("select t.customer, sum(t.sales) as 'amount sold' from (select sales.S_Last_Name as 'salesPerson', amounts.sales, amounts.customer from (select table1.I_Invoiced_Amount as 'sales', table2.PO_SalespersonID as 'SalesPersonID', table3.C_Name as 'customer' from INVOICE table1 join PURCHASE_ORDER table2 on table1.I_PO_Num = table2.PO_Num join CUSTOMER table3 on table2.PO_CustomerID = table3.C_CustomerID) as amounts join SALESPERSON sales on sales.S_SalespersonID = amounts.SalesPersonID) as t group by t.customer order by sum(t.sales) Desc;", function (err,row) {
      res.send(row);
    });
  });
});

// 16 Which colors are the most popular? (in terms of units of product sold) - High level question
app.get('/query16', (req, res) => {
  db.serialize(function () {
    db.all("SELECT P_Color, SUM(Total_Quantity) AS Qty_Color FROM PRODUCT INNER JOIN Qty_Group ON PRODUCT.P_SKU = Qty_Group.Q_SKU GROUP BY P_Color;", function (err,row) {
      res.send(row);
    });
  });
});

// 17 What are the products that will be out-of-stock (OOS)? P_Pallets_Count < Total_Quantity (re-use view from #16)
app.get('/query17', (req, res) => {
  db.serialize(function () {
    db.all("SELECT P_SKU, Total_Quantity, P_Pallets_Count, Total_Quantity>P_Pallets_Count AS OOS  FROM PRODUCT INNER JOIN Qty_Group ON PRODUCT.P_SKU = Qty_Group.Q_SKU WHERE (Total_Quantity>P_Pallets_Count) = 1;", function (err,row) {
      res.send(row);
    });
  });
});


// 18 - Average Days Between PO_Date and I_date ? to know how many days it takes to write  a PO after an invoice is created. 
// in DB-fiddle 
//SELECT AVG(DATEDIFF(I_Date, PO_Date )) AS AVG_DateDiff
//FROM I_PO_Dates;

app.get('/query18', (req, res) => {
  db.serialize(function () {
    db.all("SELECT AVG(JULIANDAY(I_Date) - JULIANDAY(PO_Date)) AS AVG_DateDiff FROM I_PO_Dates;", function (err,row) {
      res.send(row);
    });
  });
});

// 19 Which are the 3 most ordered products? 
app.get('/query19', (req, res) => {
  db.serialize(function () {
    db.all("SELECT P_SKU, P_Name, P_Size, P_Color, P_Unit_Pallet, P_Sqft_Pallet, P_Pallet_Weight, P_Price, P_Pallets_Count, Total_Quantity FROM Qty_Group INNER JOIN PRODUCT ON Qty_Group.Q_SKU = PRODUCT.P_SKU ORDER BY Total_Quantity DESC LIMIT 3;", function (err,row) {
      res.send(row);
    });
  });
});

// 20 what are the products sold by Walczak (the top salesman)?
app.get('/query20', (req, res) => {
  db.serialize(function () {
    db.all("SELECT DISTINCT (Q_SKU) FROM QUANTITY INNER JOIN Walc_POs ON QUANTITY.Q_PO_Num = Walc_POs.PO_Num;", function (err,row) {
      res.send(row);
    });
  });
});



