import calendarRoutes from './calendar.routes';
import userRoutes from './user.routes';

const routes = (app) => {
  userRoutes(app);
  calendarRoutes(app);
};

export default routes;
