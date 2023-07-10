import { google } from 'googleapis';

const GMAIL_ID = process.env.GMAIL_ID;
const CALENDAR_AUTH_URL = process.env.CALENDAR_AUTH_URL;
const PRIVATE_KEY = process.env.CALENDAR_PRIVATE_KEY.replace(/\\n/g, '\n');

export async function createGoogleCalendar(uuid) {
  try {
    const jwtClient = new google.auth.JWT(GMAIL_ID, null, PRIVATE_KEY, [
      CALENDAR_AUTH_URL,
    ]);

    await jwtClient.authorize();

    const calendar = google.calendar({ version: 'v3', auth: jwtClient });

    const newCalendar = {
      summary: uuid,
      timeZone: 'America/Sao_Paulo',
    };

    const response = await calendar.calendars.insert({
      resource: newCalendar,
    });

    return { calendarId: response.data.id };
  } catch (error) {
    console.error('Error on create a new calendar', error);
  }
}

export async function listCalendars() {
  try {
    const jwtClient = new google.auth.JWT(GMAIL_ID, null, PRIVATE_KEY, [
      CALENDAR_AUTH_URL,
    ]);

    await jwtClient.authorize();

    const calendar = google.calendar({ version: 'v3', auth: jwtClient });

    const response = await calendar.calendarList.list();
    const calendars = response.data.items;

    return calendars;
  } catch (error) {
    console.error('Error on list calendar', error);
  }
}

export async function listCalendarEvents(calendarId) {
  try {
    const jwtClient = new google.auth.JWT(GMAIL_ID, null, PRIVATE_KEY, [
      CALENDAR_AUTH_URL,
    ]);

    await jwtClient.authorize();

    const calendar = google.calendar({ version: 'v3', auth: jwtClient });

    const response = await calendar.events.list({
      calendarId,
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items;

    return events;
  } catch (error) {
    console.error('Error on list calendar events', error);
  }
}

export async function createEventInCalendar(calendarId, event) {
  try {
    const jwtClient = new google.auth.JWT(GMAIL_ID, null, PRIVATE_KEY, [
      CALENDAR_AUTH_URL,
    ]);

    await jwtClient.authorize();

    const calendar = google.calendar({ version: 'v3', auth: jwtClient });

    const response = await calendar.events.insert({
      calendarId,
      resource: {
        summary: event.summary,
        description: event.description,
        start: {
          dateTime: event.start,
          timeZone: 'America/Sao_Paulo',
        },
        end: {
          dateTime: event.end,
          timeZone: 'America/Sao_Paulo',
        },
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error on create a new calendar event', error);
  }
}
