import {
  activeEmail,
  createUser,
  getUserByEmail,
  whoIam,
} from '../repositorys/user.repository';
import { loginSchema, registerSchema } from '../validations/user.validation';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mail from '../shared/helpers/nodemailer';
import { User } from '@prisma/client';

export const create = async (req, res) => {
  try {
    await registerSchema.validate(req.body, { abortEarly: false });

    const hashPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashPassword;

    const user = await createUser(req.body);

    const token = jwt.sign(
      { id: user.id },
      process.env.EMAIL_VALIDATION_SECRET
    );

    const template = `
    <h3>Olá ${user.name}, confirme seu email para prosseguir. </h3>
    <br>
    <a href="http://localhost:3333/activeEmail/${token}">ACTIVATE</a>
    `;

    await mail(user.email, 'Confirm your e-mail', template);

    res.status(200).send({
      message: 'User created successfully, check your email to validate',
      user,
    });
  } catch (e: any) {
    res.status(400).send({ error: e.message });
  }
};

export const me = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    const decode = jwt.verify(token, process.env.JWT_SECRET) as {
      id: User['id'];
    };

    const user = await whoIam(decode.id);

    if (!user) throw new Error('User not found');

    res.status(200).send(user);
  } catch (e: any) {
    res.status(400).send({ error: e.message });
  }
};

export const login = async (req, res) => {
  try {
    await loginSchema.validate(req.body, { abortEarly: false });

    const user = await getUserByEmail(req.body.email);

    if (!user) throw new Error('User not found');
    if (!user.email_verified) throw new Error('Email not verified');

    await bcrypt.compare(req.body.password, user.password);

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '999 days',
    });

    if (user.password) delete user.password;

    res.status(200).send({ user, token });
  } catch (e: any) {
    res.status(400).send({ error: e.message });
  }
};

export const activeUserEmail = async (req, res) => {
  try {
    const token = req.params.token;

    const decode = jwt.verify(token, process.env.EMAIL_VALIDATION_SECRET) as {
      id: User['id'];
    };

    const user = await whoIam(decode.id);

    if (!user) throw new Error('User not found');

    await activeEmail(user.id);

    res.status(200).send({ message: 'Email validated successfully' });
  } catch (e: any) {
    res.status(400).send({ error: e.message });
  }
};
