import { jwtMiddleware } from '../middlewares/jwt.middleware';
import {
  createCalendar,
  createCalendarEvent,
  deleteGoogleCalendar,
  deleteCalendarEvent,
  getCalendarEvents,
} from '../controllers/calendar.controller';

const calendarRoutes = (app) => {
  app.post('/createCalendar', jwtMiddleware, createCalendar);
  app.post('/getCalendarEvents', jwtMiddleware, getCalendarEvents);
  app.post('/createEventInCalendar', jwtMiddleware, createCalendarEvent);
  app.post('/deleteCalendarEvent', jwtMiddleware, deleteCalendarEvent);
  app.post('/deleteCalendar', jwtMiddleware, deleteGoogleCalendar);
};

export default calendarRoutes;
