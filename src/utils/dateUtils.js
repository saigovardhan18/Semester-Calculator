/**
 * Date utilities using date-fns.
 * Provides exam countdown, formatting, grouping, and calendar helpers.
 */

import {
  format,
  formatDistanceToNow,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  isToday,
  isTomorrow,
  isPast,
  isWithinInterval,
  addDays,
  parseISO,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  getDay,
} from 'date-fns';

/**
 * Safely parse a date string or Date object into a Date.
 * @param {string|Date} dateInput
 * @returns {Date|null}
 */
function toDate(dateInput) {
  if (!dateInput) return null;
  try {
    const d = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}

/**
 * Get exam countdown text.
 * @param {string|Date} examDate
 * @returns {{ text: string, urgency: 'critical'|'urgent'|'soon'|'normal'|'past' }}
 */
export function getExamCountdown(examDate) {
  const date = toDate(examDate);
  if (!date) return { text: 'No date set', urgency: 'normal' };

  const now = new Date();

  if (isPast(date) && !isToday(date)) {
    return { text: 'Completed', urgency: 'past' };
  }

  if (isToday(date)) {
    const hoursLeft = differenceInHours(date, now);
    if (hoursLeft <= 0) {
      // Exam time may have passed today
      const minutesLeft = differenceInMinutes(date, now);
      if (minutesLeft <= 0) {
        return { text: 'Happening now / just ended', urgency: 'critical' };
      }
      return { text: `In ${minutesLeft} minute${minutesLeft === 1 ? '' : 's'}`, urgency: 'critical' };
    }
    return { text: `Today, in ${hoursLeft} hour${hoursLeft === 1 ? '' : 's'}`, urgency: 'critical' };
  }

  if (isTomorrow(date)) {
    return { text: 'Tomorrow', urgency: 'critical' };
  }

  const daysUntil = differenceInDays(startOfDay(date), startOfDay(now));

  if (daysUntil <= 3) {
    return { text: `In ${daysUntil} day${daysUntil === 1 ? '' : 's'}`, urgency: 'urgent' };
  }

  if (daysUntil <= 7) {
    return { text: `In ${daysUntil} days`, urgency: 'soon' };
  }

  if (daysUntil <= 30) {
    const weeks = Math.floor(daysUntil / 7);
    const remainingDays = daysUntil % 7;
    if (remainingDays === 0) {
      return { text: `In ${weeks} week${weeks === 1 ? '' : 's'}`, urgency: 'normal' };
    }
    return { text: `In ${weeks} week${weeks === 1 ? '' : 's'}, ${remainingDays} day${remainingDays === 1 ? '' : 's'}`, urgency: 'normal' };
  }

  return { text: formatDistanceToNow(date, { addSuffix: true }), urgency: 'normal' };
}

/**
 * Format exam date for display.
 * @param {string|Date} dateString
 * @returns {string} formatted date like "Mon, 15 Jan 2025"
 */
export function formatExamDate(dateString) {
  const date = toDate(dateString);
  if (!date) return 'Date not set';

  if (isToday(date)) return `Today, ${format(date, 'dd MMM yyyy')}`;
  if (isTomorrow(date)) return `Tomorrow, ${format(date, 'dd MMM yyyy')}`;

  return format(date, 'EEE, dd MMM yyyy');
}

/**
 * Format time for display.
 * @param {string} timeString - "HH:mm" or "HH:mm:ss" format, or full ISO string
 * @returns {string} formatted time like "02:30 PM"
 */
export function formatExamTime(timeString) {
  if (!timeString) return '';

  try {
    // Handle "HH:mm" or "HH:mm:ss" time-only strings
    if (/^\d{2}:\d{2}(:\d{2})?$/.test(timeString)) {
      const [hours, minutes] = timeString.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${String(displayHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
    }

    // Handle full ISO date-time string
    const date = toDate(timeString);
    if (date) {
      return format(date, 'hh:mm a');
    }

    return timeString;
  } catch {
    return timeString;
  }
}

/**
 * Group exams by category: Today, Tomorrow, Next 7 Days, Later, Completed/Past.
 * @param {Array<{ id: string, date: string, status?: string }>} exams
 * @returns {{ today: Array, tomorrow: Array, thisWeek: Array, later: Array, past: Array }}
 */
export function groupExamsByDate(exams) {
  const groups = {
    today: [],
    tomorrow: [],
    thisWeek: [],
    later: [],
    past: [],
  };

  if (!Array.isArray(exams) || exams.length === 0) return groups;

  const now = new Date();
  const todayStart = startOfDay(now);
  const weekEnd = endOfDay(addDays(todayStart, 7));

  for (const exam of exams) {
    const examDate = toDate(exam.date);
    if (!examDate) {
      groups.later.push(exam); // No date → put in "later"
      continue;
    }

    // If exam is marked completed or date is past
    if (exam.status === 'completed' || (isPast(examDate) && !isToday(examDate))) {
      groups.past.push(exam);
      continue;
    }

    if (isToday(examDate)) {
      groups.today.push(exam);
    } else if (isTomorrow(examDate)) {
      groups.tomorrow.push(exam);
    } else if (isWithinInterval(examDate, { start: todayStart, end: weekEnd })) {
      groups.thisWeek.push(exam);
    } else {
      groups.later.push(exam);
    }
  }

  // Sort each group by date ascending
  const sortByDate = (a, b) => {
    const dateA = toDate(a.date);
    const dateB = toDate(b.date);
    if (!dateA) return 1;
    if (!dateB) return -1;
    return dateA - dateB;
  };

  groups.today.sort(sortByDate);
  groups.tomorrow.sort(sortByDate);
  groups.thisWeek.sort(sortByDate);
  groups.later.sort(sortByDate);
  groups.past.sort(sortByDate);

  return groups;
}

/**
 * Get Tailwind color classes based on exam proximity.
 * @param {string|Date} examDate
 * @returns {string} Tailwind color class string
 */
export function getExamPriorityColor(examDate) {
  const date = toDate(examDate);
  if (!date) return 'text-slate-400 dark:text-slate-500';

  if (isPast(date) && !isToday(date)) {
    return 'text-slate-400 dark:text-slate-500';
  }

  const daysUntil = differenceInDays(startOfDay(date), startOfDay(new Date()));

  if (daysUntil <= 1) {
    return 'text-red-600 dark:text-red-400'; // critical
  }
  if (daysUntil <= 3) {
    return 'text-orange-600 dark:text-orange-400'; // urgent
  }
  if (daysUntil <= 7) {
    return 'text-amber-600 dark:text-amber-400'; // soon
  }
  return 'text-indigo-600 dark:text-indigo-400'; // normal
}

/**
 * Check if an exam is overdue (date has passed and not marked completed).
 * @param {{ date: string, status?: string }} exam
 * @returns {boolean}
 */
export function isExamOverdue(exam) {
  if (!exam) return false;
  if (exam.status === 'completed') return false;

  const examDate = toDate(exam.date);
  if (!examDate) return false;

  return isPast(examDate) && !isToday(examDate);
}

/**
 * Get calendar data for a month (for calendar view).
 * Returns array of weeks, each week is array of 7 day objects.
 * Weeks start on Sunday.
 * @param {number} year
 * @param {number} month - 0-indexed (0 = January)
 * @returns {Array<Array<{ date: Date, dayOfMonth: number, isCurrentMonth: boolean, isToday: boolean }>>}
 */
export function getCalendarMonth(year, month) {
  if (typeof year !== 'number' || typeof month !== 'number') return [];

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = endOfMonth(firstDayOfMonth);

  // Get the full range including padding days from adjacent months
  const calendarStart = startOfWeek(firstDayOfMonth, { weekStartsOn: 0 }); // Sunday start
  const calendarEnd = endOfWeek(lastDayOfMonth, { weekStartsOn: 0 });

  const allDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const today = new Date();

  const weeks = [];
  let currentWeek = [];

  for (const day of allDays) {
    currentWeek.push({
      date: day,
      dayOfMonth: day.getDate(),
      isCurrentMonth: isSameMonth(day, firstDayOfMonth),
      isToday: isSameDay(day, today),
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Push any remaining partial week (shouldn't happen with proper week alignment)
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
}

/**
 * Format a date as relative ("2 days ago", "in 3 hours", etc.)
 * @param {string|Date} dateString
 * @returns {string}
 */
export function formatRelativeDate(dateString) {
  const date = toDate(dateString);
  if (!date) return 'Unknown date';

  try {
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return 'Unknown date';
  }
}
