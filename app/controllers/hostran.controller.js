const Hostran = require("../models/hostran.model")

exports.doGetList = (req, res) => {
  Hostran.getList(req, (err, data) => {
        if (err)
          res.send({
            success:false,
            message:
              err.message || "Some error occurred while retrieving checkin"
          });
        else res.send({success:true, data:data});
    });
};

exports.doGetDetail = (req, res) => {
  Hostran.getDetail(req, (err, data) => {
        if (err)
          res.send({
            success:false,
            message:
              err.message || "Some error occurred while retrieving checkin"
          });
        else res.send({success:true, data:data});
    });
};
