import { TaskItem } from '../types';

export class CalendarService {
  /**
   * Generates a direct Google Calendar web event URL
   */
  public static getGoogleCalendarUrl(task: TaskItem): string {
    const title = encodeURIComponent(`VoxFlow: ${task.title}`);
    const details = encodeURIComponent(`Task created via VoxFlow Voice AI.\nPriority: ${task.priority.toUpperCase()}`);
    
    // Default to today/tomorrow based on string
    const now = new Date();
    const startTime = new Date(now.getTime() + 3600000); // 1 hour ahead
    const endTime = new Date(now.getTime() + 7200000);   // 2 hours ahead

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
    };

    const dates = `${formatDate(startTime)}/${formatDate(endTime)}`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dates}`;
  }

  /**
   * Downloads an RFC-compliant .ics file that can be opened in Apple Calendar, Outlook, or Google Calendar
   */
  public static downloadICS(task: TaskItem) {
    const now = new Date();
    const startTime = new Date(now.getTime() + 3600000);
    const endTime = new Date(now.getTime() + 7200000);

    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const formatICSDate = (d: Date) => {
      return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//VoxFlow AI//Voice Action Scheduler//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:voxflow-${task.id}-${Date.now()}@voxflow.ai`,
      `DTSTAMP:${formatICSDate(now)}`,
      `DTSTART:${formatICSDate(startTime)}`,
      `DTEND:${formatICSDate(endTime)}`,
      `SUMMARY:VoxFlow: ${task.title}`,
      `DESCRIPTION:Voice AI created action item with priority ${task.priority.toUpperCase()}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${task.title.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

