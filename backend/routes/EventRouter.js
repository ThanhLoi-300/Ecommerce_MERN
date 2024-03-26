const router = require('express').Router()
const eventController = require('../controller/event')
const { isSeller } = require('../middleware/auth')

// create event
router.post("/create-event", eventController.createEvent);
// get all events
router.get("/get-all-events", eventController.getAllEvents);
// delete event of a shop
router.delete("/delete-shop-event/:id", isSeller, eventController.deleteEvent);

module.exports = router