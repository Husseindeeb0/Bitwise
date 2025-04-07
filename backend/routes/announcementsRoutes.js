const express = require("express");
const router = express.Router();
const { getAnnouncements } = require("../controllers/getAnnouncements");
const { addAnnouncements } = require("../controllers/addAnnouncements");
const { editAnnouncements } = require("../controllers/editAnnouncements");
const { deleteAnnouncements } = require("../controllers/deleteAnnouncements");
const { verifyJWT } = require("../middleware/verifyJWT");

// Apply authentication middleware to all routes
router.use(verifyJWT);

router.get("/getAnnouncements", getAnnouncements);
router.post("/addAnnouncements", addAnnouncements);
router.patch("/editAnnouncements", editAnnouncements);
router.delete("/deleteAnnouncements", deleteAnnouncements);

module.exports = router;