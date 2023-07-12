import * as yup from 'yup';

export const createCalendarSchema = yup.object().shape({
  summary: yup.string().required(),
  description: yup.string().required(),
  start: yup.string().required(),
  end: yup.string().required(),
});

export const deleteCalendarSchema = yup.object().shape({
  sendUpdates: yup.string().oneOf(['all', 'externalonly', 'none']).required(),
  notifyAttendees: yup.boolean().required(),
  eventId: yup.string().required(),
});
