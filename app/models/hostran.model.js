const sql = require("../db");

const sqlType = require('mssql')

// constructor
const Hostran = function(model) {
    this.id = model.id;
    this.text = model.text;
    this.from = model.from;
    this.to = model.to;
    this.edit_by = model.edit_by;
};

Hostran.getList = (req, result) => {
  
  sql.connect()
  .then(async function () { 

    var str = "SELECT COUNT(*) AS wel_count, SUM(pay_amt) AS wel_amount, SUM(pay_fee_amt) AS wel_fee, paydate AS wel_paydate"
    str += ", SUM(CASE WHEN weltype='H' THEN (pay_amt + pay_fee_amt) ELSE 0 END) AS wel_hos"
    str += ", SUM(CASE WHEN weltype='E' THEN (pay_amt + pay_fee_amt) ELSE 0 END) AS wel_edu"
    str += " FROM pay_hostran"
    str += " WHERE empid = '" + req.body.empid  + "'"
    str += " AND updflag='Y'  "
    str += " GROUP BY paydate"
    str += " ORDER BY paydate DESC"
    
    sql.query(str, (err, res) => {

      if (err) {        
        result(err, null)        
      } 
      else{
        result(null, res.recordset)
      }        
    });  
  })
  .catch(function (err) {
      result(err, null)       
    }
  );   
};

Hostran.getDetail = (req, result) => {
  
  sql.connect()
  .then(async function () { 

    var str = "SELECT weldate AS wel_date, weltype AS wel_type, docdate AS doc_date, ISNULL(wel_amt, 0) AS wel_amount, ISNULL(wel_fee_amt, 0) AS wel_fee, ISNULL(pay_amt, 0) AS pay_amount, ISNULL(pay_fee_amt, 0) AS pay_fee"
    str += " FROM pay_hostran"
    str += " WHERE empid = '" + req.body.empid  + "'"
    str += " AND paydate='" + req.body.paydate  + "' "
    str += " AND updflag='Y'  "
    str += " ORDER BY docdate"
     
    sql.query(str, (err, res) => {

      if (err) {        
        result(err, null)        
      } 
      else{
        result(null, res.recordset)
      }        
    });  
  })
  .catch(function (err) {
      result(err, null)       
    }
  );   
};


module.exports = Hostran;