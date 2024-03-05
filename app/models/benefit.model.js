const sql = require("../db");

const sqlType = require('mssql')

// constructor
const Benefit = function(model) {
    this.id = model.id;
    this.text = model.text;
    this.from = model.from;
    this.to = model.to;
    this.edit_by = model.edit_by;
};

Benefit.get = result => {
  
  sql.connect()
  .then(async function () { 

    var str = "SELECT BENEFIT_ID"
    str += ", BENEFIT_TEXT"
    str += ", BENEFIT_FROM"
    str += ", BENEFIT_TO"
    str += ", ISNULL(EDIT_BY, CREATE_BY) AS EDIT_BY"
    str += ", ISNULL(EDIT_DATE, CREATE_DATE) AS EDIT_DATE"
    str += " FROM WEL_TRX_BENEFIT"
    str += " ORDER BY BENEFIT_FROM DESC"
    
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

function checkDataOld(id, result) {  
  
  sql.connect()
  .then(async function () { 

    const request = sql.request()
    request.input('id', sqlType.VarChar, id)

    request.query('SELECT * FROM WEL_TRX_BENEFIT WHERE BENEFIT_ID=@id', (err, res) => {
     //console.log(res.rowsAffected)
      if (err) {        
        result(err, null)        
      } 
      else{

        if(res.rowsAffected > 0){
          result(null, true)
        }
        else{
          result(null, false)
        }        
      } 
    })
    
  })
  .catch(function (err) {
      result(err, null)       
    }
  );   
  
}

Benefit.record = (newImport, result) => {

  sql.connect()
    .then(async function () { 
      
      const request = sql.request()
      
      request.input('BENEFIT_TEXT', sqlType.VarChar, newImport.text)
      request.input('BENEFIT_FROM', sqlType.Date, newImport.from)
      request.input('BENEFIT_TO', sqlType.Date, newImport.to)
            
      checkDataOld(newImport.id, (err, data) => {           
    
        if (err) {        
          result(err, null)     
        } 
        else{
          
          if(data==true){

            //-- Update
            console.log('#-- Update')
            
            request.input('BENEFIT_ID', sqlType.VarChar, newImport.id)
            request.input('EDIT_BY', sqlType.VarChar, newImport.edit_by)
            //request.input('EDIT_DATE', sqlType.DateTime, newImport.create_date)
            request.query('UPDATE WEL_TRX_BENEFIT SET BENEFIT_TEXT=@BENEFIT_TEXT, BENEFIT_FROM=@BENEFIT_FROM, BENEFIT_TO=@BENEFIT_TO, EDIT_BY=@EDIT_BY, EDIT_DATE=getdate() WHERE BENEFIT_ID=@BENEFIT_ID', (err, res) => {
              if (err) {        
                result(err, null)        
              } 
              else{
                result(null, res)
              }     
            })
          }
          else{

            //-- Insert
            console.log('#-- Insert')

            var datenow = new Date()
            var year = datenow.getFullYear()  

            getNextId('B' + year, (err, data) => {           
              if (err != null){          
                result(err, null)      
              }
              else{

                request.input('BENEFIT_ID', sqlType.VarChar, data.nextid)
                request.input('CREATE_BY', sqlType.VarChar, newImport.edit_by)
                //request.input('CREATE_DATE', sqlType.DateTime, newImport.create_date)
                request.input('FLAG', sqlType.VarChar, '0')
                request.query('INSERT INTO WEL_TRX_BENEFIT (BENEFIT_ID, BENEFIT_TEXT, BENEFIT_FROM, BENEFIT_TO, CREATE_BY, CREATE_DATE, FLAG) VALUES (@BENEFIT_ID, @BENEFIT_TEXT, @BENEFIT_FROM, @BENEFIT_TO, @CREATE_BY, getdate(), @FLAG)', (err, res) => {
                if (err) {        
                    result(err, null)        
                  } 
                  else{

                    console.log(res)

                    result(null, res)
                  }     
                })    

                
              }
            }); 
            
          }          

        } 
        
      });                 
      
    })
    .catch(function (err) {
        result(err, null)       
      }
    );  
  
};

async function getNextId(prefix, result) {
  getMaxId(prefix, (err, data) => {           
    if (err != null){          
      result(err, null)   
    }
    else{
  
      var json = JSON.stringify(data)
      const obj = JSON.parse(json);
      //console.log(obj.data[0])

      nextId(prefix, obj.data[0].MAXID, (err, data) => {           
        if (err != null){          
          result(err, null)  
        }
        else{
          result(null, data)  
        }
      });  
      
    }
  })
}

async function getMaxId(prefix, result) {

  sql.connect()
  .then(async function () { 

    var str = "SELECT ISNULL(MAX(BENEFIT_ID), '" + prefix + "0000') AS MAXID"
    str += " FROM WEL_TRX_BENEFIT"
    str += " WHERE BENEFIT_ID LIKE '" + prefix + "%'"
        
    sql.query(str, (err, res) => {

      if (err) {        
        result(err, null)        
      } 
      else{
        
        result(null, { data:res.recordset})
      }        
    });  
  })
  .catch(function (err) {
      result(err, null)       
    }
  );  


}

async function nextId(prefix, maxid, result) {
  //-- B20230001
  if(maxid.length == 9){  

    const last4Digits = maxid.slice(-4);       
    var nextid = Number(last4Digits) + 1;
    var tmp = nextid.toString();
    
    return result(null, { nextid:prefix + tmp.padStart(4, '0') })
  }
  else{
    return result(null, { nextid:prefix + "0001" })
  }

}

Benefit.remove = (id, result) => {

  sql.connect()
    .then(async function () { 
      
      const request = sql.request()
                  
      checkDataOld(id, (err, data) => {           
    
        if (err) {        
          result(err, null)     
        } 
        else{
          
          if(data==true){

            request.input('BENEFIT_ID', sqlType.VarChar, id)
            request.query('DELETE FROM WEL_TRX_BENEFIT WHERE BENEFIT_ID=@BENEFIT_ID', (err, res) => {
              if (err) {        
                result(err, null)        
              } 
              else{

                result(null, res)
              }     
            })
          }
          else{
            result({message:'Data not found'}, null)                        
          }          

        } 
        
      });                 
      
    })
    .catch(function (err) {
        result(err, null)       
      }
    );  
  
};

module.exports = Benefit;