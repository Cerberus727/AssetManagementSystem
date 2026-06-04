import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import createTicket from "../controllers/Tickets/createTicket.js";
import updateTicket from "../controllers/Tickets/updateTicket.js";
import deleteTicket from "../controllers/Tickets/deleteTicket.js";
import getTickets from "../controllers/Tickets/getTickets.js";
import getTicketById from "../controllers/Tickets/getTicketById.js";
const router = express.Router();

router.use(authMiddleware);

router.post("/", createTicket);

router.put("/:id", updateTicket);

router.delete("/:id", deleteTicket);
router.get("/", getTickets);
router.get("/:id", getTicketById);
export default router;