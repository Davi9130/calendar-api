import {
  create,
  login,
  me,
  activeUserEmail,
} from '../controllers/user.controller';

const userRoutes = (app) => {
  app.get('/activeEmail/:token', activeUserEmail);
  app.post('/register', create);
  app.post('/login', login);
  app.get('/me', me);
};

export default userRoutes;
