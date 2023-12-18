const bcrypt = require("../utilities/bcrypt");
// const Employee = require("../models/employee.model")

exports.verify = (req, res) => {    
    var tmp = bcrypt.doGetToken(req.body.usr, req.body.pwd)    
    if(tmp.status_code == 1){
        res.status(200).send({
            success:true,
            message: tmp.message
          });
    }
    else{
        res.status(500).send({
            success:false,
            message: tmp.message
          });
    }
};

// exports.login = (req, res) => { 
//     if(req.body.pwd == 'Exat51y'){
//         Employee.findById(req.body.usr, (err, data) => {
//             if (err)
//               res.send({
//                 success:false,
//                 message:
//                   err.message || "Some error occurred while retrieving employee"
//               });
//             else{
//                 res.send({success:true, data:data});
//             }          
//         });   
//     }
//     else{        
//         res.status(200).send({
//             success:false,
//             message: 'ไม่มีสิทธิเข้าใช้งาน'
//           });
//     }
// };
