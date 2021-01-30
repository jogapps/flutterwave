// package  imports
const express = require("express");
const router = express.Router();

// local imports
const HomeController = require("../controllers/HomeController");
const ValidationController = require("../controllers/ValidationController");

router.get("/", HomeController.index);

router.post("/validate-rule", ValidationController.validation);

module.exports = router;