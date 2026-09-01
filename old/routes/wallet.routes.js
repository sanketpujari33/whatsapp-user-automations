const express = require("express");
const walletController = require("../controllers/wallet.controller");

const router = express.Router();

router.get("/", walletController.listWallets);
router.get("/:userId", walletController.getWallet);
router.post("/credit-by-phone", walletController.creditByPhone);
router.post("/transfer-by-phone", walletController.transferByPhone);

module.exports = router;