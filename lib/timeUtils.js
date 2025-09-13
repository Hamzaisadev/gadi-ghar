/**
 * Converts 24-hour time format (HH:MM) to 12-hour format (h:MM AM/PM)
 * @param {string} time24 - Time in 24-hour format (e.g., "14:30")
 * @returns {string} - Time in 12-hour format (e.g., "2:30 PM")
 */
export function formatTime12Hour(time24) {
  if (!time24 || typeof time24 !== 'string') {
    return '';
  }

  const [hours, minutes] = time24.split(':');
  const hour24 = parseInt(hours, 10);
  const minute = minutes || '00';
  
  if (isNaN(hour24) || hour24 < 0 || hour24 > 23) {
    return time24; // Return original if invalid
  }
  
  const period = hour24 >= 12 ? 'PM' : 'AM';
  let hour12 = hour24 % 12;
  hour12 = hour12 === 0 ? 12 : hour12; // Convert 0 to 12 for 12 AM/PM
  
  return `${hour12}:${minute} ${period}`;
}

/**
 * Formats working hours display with proper 12-hour format
 * @param {Object} day - Working hour object with openTime and closeTime
 * @returns {string} - Formatted time range or "Closed"
 */
export function formatWorkingHours(day) {
  if (!day || !day.isOpen || !day.openTime || !day.closeTime) {
    return 'Closed';
  }
  
  const openTime12 = formatTime12Hour(day.openTime);
  const closeTime12 = formatTime12Hour(day.closeTime);
  
  return `${openTime12} - ${closeTime12}`;
}

/**
 * Formats day name for display
 * @param {string} dayOfWeek - Day in uppercase (e.g., "MONDAY")
 * @returns {string} - Formatted day name (e.g., "Monday")
 */
export function formatDayName(dayOfWeek) {
  if (!dayOfWeek || typeof dayOfWeek !== 'string') {
    return '';
  }
  
  return dayOfWeek.charAt(0) + dayOfWeek.slice(1).toLowerCase();
}

/**
 * Formats working hours for schema.org structured data
 * @param {Object} workingHour - Working hour object
 * @returns {string|null} - Schema.org format (e.g., "Mo 09:00-18:00") or null if closed
 */
export function formatWorkingHoursSchema(workingHour) {
  if (!workingHour || !workingHour.isOpen || !workingHour.openTime || !workingHour.closeTime) {
    return null;
  }
  
  const dayMapping = {
    'MONDAY': 'Mo',
    'TUESDAY': 'Tu', 
    'WEDNESDAY': 'We',
    'THURSDAY': 'Th',
    'FRIDAY': 'Fr',
    'SATURDAY': 'Sa',
    'SUNDAY': 'Su'
  };
  
  const schemaDay = dayMapping[workingHour.dayOfWeek] || workingHour.dayOfWeek.slice(0, 2);
  return `${schemaDay} ${workingHour.openTime}-${workingHour.closeTime}`;
}
