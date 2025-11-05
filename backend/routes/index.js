const express = require('express');
const { createMeeting, respondMeeting, getMeetings } = require('../controllers/meetingController');
const { login, register, getUsers } = require('../controllers/authContoller');
const { createGroup, getGroups, updateGroup, deleteGroup } = require('../controllers/groupController');
const router = express.Router();

// =============== Auth Routes ===================
router.post("/auth/login", login);
router.post("/auth/register", register);
router.get("/users", getUsers);

// =============== Meeting Routes ===================
router.post("/meeting", createMeeting);
router.get("/meetings/respond/:meetingId/:userId", respondMeeting);
router.get("/meetings", getMeetings);

// =============== Group Routes ===================
router.post("/groups", createGroup);
router.get("/groups", getGroups);
router.put("/groups/:groupId", updateGroup);
router.delete("/groups/:groupId", deleteGroup);

module.exports = router;