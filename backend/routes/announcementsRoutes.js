const express = require("express");
const router = express.Router();
const {
  addAnnouncements,
  editAnnouncements,
  deleteAnnouncements,
  getAnnouncements,
  getAnnouncementById,
  getLatestAnnouncement,
} = require("../controllers/announcements.controller");
const { verifyJWT } = require("../middleware/verifyJWT");

router.get("/getAnnouncements", getAnnouncements);
router.get("/getAnnouncementById/:id", getAnnouncementById);
router.get("/getLatestAnnouncement", getLatestAnnouncement);
router.post("/addAnnouncements", verifyJWT, addAnnouncements);
router.patch("/editAnnouncements", verifyJWT, editAnnouncements);
router.delete("/deleteAnnouncements", verifyJWT, deleteAnnouncements);

module.exports = router;
