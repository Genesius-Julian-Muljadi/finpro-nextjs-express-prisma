import { Router } from "express";
import { GetAllOrganizers, GetAllUsers, PopulateOrganizers, PopulateUsers } from "../controller/users&organizezrs";
import { GetAllEvents, PopulateEventsByOrganizerID } from "../controller/events";
import { PopulateTransactionsByUserID } from "../controller/transactions";

const router = Router();

router.post("/users", PopulateUsers);
router.post("/organizers", PopulateOrganizers);
router.post("/events/:id", PopulateEventsByOrganizerID);
router.post("/transactions/:id", PopulateTransactionsByUserID);
router.get("/users", GetAllUsers);
router.get("/organizers", GetAllOrganizers);
router.get("/events", GetAllEvents);

export default router;