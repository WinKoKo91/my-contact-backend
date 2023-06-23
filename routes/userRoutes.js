const express = require("express");
const router = express.Router();

const { currentUser, registerUser, loginUser } = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");


router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/current", validateToken, currentUser);



module.exports = router;