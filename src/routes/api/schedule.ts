import express from "express";
import {
    createSchedule,
    deleteSchedule,
    retrieveSchedule,
    retrieveScheduleList,
} from "../../schedule/schedule-dao";
import { retrieveCalendar } from "../../calendar/calendar-dao";

const HTTP_CREATED = 201;
const HTTP_NOT_FOUND = 404;
const HTTP_NO_CONTENT = 204;

const router = express.Router();

router.post("/:calendarId", async (req, res) => {
    const userId = req.headers.user?.toString();
    const calendarId = req.params.calendarId;
    const preferences = req.body.preferences;

    if (userId == null) {
        res.sendStatus(HTTP_NOT_FOUND);
    } else {
        const calendar = await retrieveCalendar(calendarId, userId);

        // TODO: PERFORM ALGORITHM HERE
        const schedule = calendar.calendar;

        const newSchedule = await createSchedule({
            user_id: userId,
            schedule: schedule,
        });

        res.status(HTTP_CREATED)
            .header("Location", `/api/schedule/${newSchedule._id}`)
            .json(newSchedule);
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const userId = req.headers.user?.toString();

    if (userId == null) {
        res.sendStatus(HTTP_NOT_FOUND);
    } else {
        const schedule = await retrieveSchedule(id, userId);

        if (schedule) {
            res.json(schedule);
        } else {
            res.sendStatus(HTTP_NOT_FOUND);
        }
    }
});

router.get("/", async (req, res) => {
    const userId = req.headers.user?.toString();
    if (userId == null) {
        res.sendStatus(HTTP_NOT_FOUND);
    } else {
        res.json(await retrieveScheduleList(userId));
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const userId = req.headers.user?.toString();
    if (userId == null) {
        res.sendStatus(HTTP_NOT_FOUND);
    } else {
        await deleteSchedule(id, userId);
        res.sendStatus(HTTP_NO_CONTENT);
    }
});

export default router;
