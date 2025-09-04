const express = require('express');
const router = express.Router();

const getOrders = (req, res) =>{
    res.json({message: "All orders will be here"})
}


router.route("/").get(getOrders);

module.exports = router;