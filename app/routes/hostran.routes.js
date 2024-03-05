
const express = require("express")
const router = express.Router()
const hostran = require("../controllers/hostran.controller")
const authenBasic = require('../middlewares/authentication.middleware')

router.post("/v1/hostran/summary", authenBasic, hostran.doGetList)
router.post("/v1/hostran/detail", authenBasic, hostran.doGetDetail)

module.exports = router
