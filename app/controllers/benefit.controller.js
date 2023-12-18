const Benefit = require("../models/benefit.model")

exports.findAll = (req, res) => {
  Benefit.get((err, data) => {
        if (err)
          res.send({
            success:false,
            message:
              err.message || "Some error occurred while retrieving checkin"
          });
        else res.send({success:true, data:data});
    });
};

exports.record = (req, res) => {
  
  // Validate request
  if (!req.body) {
      res.status(400).send({
      message: "Content can not be empty!"
      });
  }

  const model = new Benefit({           
    id : req.body.id,
    text : req.body.text,
    from : req.body.from,
    to : req.body.to,
    edit_by : req.body.edit_by    
  });
  
  Benefit.record(model, (err, data) => {
    if (err)
    res.send({
        success:false,        
        message:
        err.message || "Some error occurred while creating the Checkin",
        data:req.body
    });
    else {        

      if(data.rowsAffected > 0)
        res.send({success:true, data:req.body, message:'The transaction was successful.'});
      else
        res.send({success:false, data:req.body});
      
    }
  });


};

exports.remove = (req, res) => {
  
  // Validate request
  if (!req.body) {
      res.status(400).send({
      message: "Content can not be empty!"
      });
  }
  
  Benefit.remove(req.body.id, (err, data) => {
    if (err)
    res.send({
        success:false,        
        message:
        err.message || "Some error occurred while creating the Checkin",
        data:req.body
    });
    else {        

      if(data.rowsAffected > 0)
        res.send({success:true, data:req.body, message:'The item was successfully deleted.'});
      else
        res.send({success:false, data:req.body});
      
    }
  });

  
};