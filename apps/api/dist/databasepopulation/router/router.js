"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_organizezrs_1 = require("../controller/users&organizezrs");
const events_1 = require("../controller/events");
const transactions_1 = require("../controller/transactions");
const router = (0, express_1.Router)();
router.post("/users", users_organizezrs_1.PopulateUsers);
router.post("/organizers", users_organizezrs_1.PopulateOrganizers);
router.post("/events/:id", events_1.PopulateEventsByOrganizerID);
router.post("/transactions/:id", transactions_1.PopulateTransactionsByUserID);
router.get("/users", users_organizezrs_1.GetAllUsers);
router.get("/organizers", users_organizezrs_1.GetAllOrganizers);
router.get("/events", events_1.GetAllEvents);
exports.default = router;
