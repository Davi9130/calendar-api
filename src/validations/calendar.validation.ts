import * as yup from 'yup';

export const createCalendarSchema = yup.object().shape({
  summary: yup.string().required(),
  description: yup.string().required(),
  start: yup.string().required(),
  end: yup.string().required(),
});
