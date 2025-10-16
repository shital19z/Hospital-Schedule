// In src/utils/timeUtils.jsx

import { format, addMinutes, startOfWeek, addDays, isSameDay, isToday } from 'date-fns'; 
import { CALENDAR_CONFIG } from '../data/constants.jsx';

export function generateTimeSlots(date) {
  const slots = [];
  
  const { 
    startTime: startHour, 
    endTime: endHour, 
    slotDurationMinutes: slotDuration 
  } = CALENDAR_CONFIG;

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += slotDuration) {
      const start = new Date(date);
      start.setHours(hour, minute, 0, 0);
      
      const end = addMinutes(start, slotDuration);
      
      slots.push({
        start,
        end,
        label: format(start, 'h:mm a')
      });
    }
  }

  return slots;
}

export function getWeekStart(date) {
  return startOfWeek(date, { weekStartsOn: 1 }); // 1 = Monday
}

export function getWeekDates(date) {
  const weekStart = getWeekStart(date);
  const dates = [];
  
  for (let i = 0; i < 7; i++) {
    dates.push(addDays(weekStart, i));
  }
  
  return dates;
}

export function appointmentOverlapsSlot(appointment, slot) {
  const aptStart = new Date(appointment.startTime);
  const aptEnd = new Date(appointment.endTime);
  
  return aptStart < slot.end && aptEnd > slot.start;
}

export function getAppointmentsForSlot(appointments, slot) {
  return appointments.filter(apt => appointmentOverlapsSlot(apt, slot));
}

export function formatDate(date) {
  return format(date, 'MMM d, yyyy');
}

export function formatTime(date) {
    return format(date, 'h:mm a');
}

export function getDayName(date) {
    return format(date, 'EEEE');
}

// FIX: Export isToday for use in WeekView
export { isToday };