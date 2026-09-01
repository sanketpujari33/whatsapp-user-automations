const express = require("express");
const transactionController = require("../controllers/transaction.controller");

const router = express.Router();

router.get("/", transactionController.listTransactions);

module.exports = router;