
const express = require("express")
const router = express.Router()
const benefit = require("../controllers/benefit.controller")
const authenBasic = require('../middlewares/authentication.middleware')

router.post("/v1/benefit/get", authenBasic, benefit.findAll)
router.post("/v1/benefit/record", authenBasic, benefit.record)
router.post("/v1/benefit/remove", authenBasic, benefit.remove)
module.exports = router
