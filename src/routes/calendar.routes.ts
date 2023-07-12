import { jwtMiddleware } from '../middlewares/jwt.middleware';
import {
  createCalendar,
  createCalendarEvent,
  getCalendarEvents,
} from '../controllers/calendar.controller';

const calendarRoutes = (app) => {
  app.post('/createCalendar', jwtMiddleware, createCalendar);
  app.post('/getCalendarEvents', jwtMiddleware, getCalendarEvents);
  app.post('/createEventInCalendar', jwtMiddleware, createCalendarEvent);
};

export default calendarRoutes;
