import { randomUUID } from 'crypto';
import { updateUser, whoIam } from '~/repositorys/user.repository';
import {
  createEventInCalendar,
  createGoogleCalendar,
  deleteCalendar,
  deleteEventInCalendar,
  listCalendarEvents,
} from '~/utils/googleCalendar';
import {
  createCalendarSchema,
  deleteCalendarSchema,
} from '~/validations/calendar.validation';

export const createCalendar = async (req, res) => {
  try {
    const resp = await createGoogleCalendar(randomUUID());

    const user = await whoIam(req.user.id);

    if (user.calendar_id) {
      res.status(400).send({ error: 'Calendar already created' });
    }

    await updateUser(req.user.id, { calendar_id: resp.calendarId });

    res.status(200).send({ message: 'Calendar created' });
  } catch (e: any) {
    res.status(400).send({ error: e.message });
  }
};

export const getCalendarEvents = async (req, res) => {
  try {
    const user = await whoIam(req.user.id);

    if (!req.body.calendarId) {
      res.status(400).send({ error: 'CalendarId is required' });
    }

    if (!user.calendar_id) {
      res.status(400).send({ error: 'Calendar not created yet' });
    }

    const events = await listCalendarEvents(user.calendar_id);

    res.status(200).send({ events, calendarId: user.calendar_id });
  } catch (e: any) {
    res.status(400).send({ error: e.message });
  }
};

export const createCalendarEvent = async (req, res) => {
  try {
    const user = await whoIam(req.user.id);

    await createCalendarSchema.validate(req.body, { abortEarly: false });

    if (!user.calendar_id) {
      res.status(400).send({ error: 'Calendar not created yet' });
    }

    const event = await createEventInCalendar(user.calendar_id, {
      ...req.body,
    });

    res.status(200).send({ event, calendarId: user.calendar_id });
  } catch (e: any) {
    res.status(400).send({ error: e.message });
  }
};

export const deleteCalendarEvent = async (req, res) => {
  try {
    const user = await whoIam(req.user.id);

    await deleteCalendarSchema.validate(req.body, { abortEarly: false });

    if (!user.calendar_id) {
      res.status(400).send({ error: 'Calendar not created yet' });
    }

    await deleteEventInCalendar(
      user.calendar_id,
      req.body.sendUpdates,
      req.body.notifyAttendees,
      req.body.eventId
    );

    res.status(200).send({ message: 'Event deleted' });
  } catch (e: any) {
    res.status(400).send({ error: e.message });
  }
};

export const deleteGoogleCalendar = async (req, res) => {
  try {
    const user = await whoIam(req.user.id);

    if (!user.calendar_id) {
      res.status(400).send({ error: 'Calendar not created yet' });
    }

    await deleteCalendar(user.calendar_id);

    await updateUser(req.user.id, { calendar_id: null });

    res.status(200).send({ message: 'Calendar deleted' });
  } catch (e: any) {
    res.status(400).send({ error: e.message });
  }
};
