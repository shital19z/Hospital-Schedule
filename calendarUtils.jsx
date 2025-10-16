// In src/utils/calendarUtils.jsx

import { format } from 'date-fns'; 
import { APPOINTMENT_TYPE_CONFIG, DOCTOR_SCHEDULES, CALENDAR_CONFIG } from '../data/constants.jsx'; 

export function getAppointmentColor(type) {
    return APPOINTMENT_TYPE_CONFIG[type]?.color || '#888';
}

export function getDoctorWorkingHours(doctor, date) {
    const dayName = format(date, 'EEE').toLowerCase();
    const schedule = DOCTOR_SCHEDULES[doctor.id] || DOCTOR_SCHEDULES.default;
    return schedule[dayName];
}

export function isDoctorWorking(doctor, date) {
    const hours = getDoctorWorkingHours(doctor, date);
    return !!hours && hours.start !== '00:00' && hours.end !== '00:00';
}

export function calculateAppointmentPosition(appointment, timeSlots) {
    const startTime = new Date(appointment.startTime);
    const endTime = new Date(appointment.endTime);
    
    const slotHeightPx = CALENDAR_CONFIG.slotHeightPx || 60;
    const slotDuration = CALENDAR_CONFIG.slotDurationMinutes || 30;

    // Find the closest starting slot index
    const startSlotIndex = timeSlots.findIndex(slot => {
        // We look for a slot whose start time exactly matches the appointment start time
        return startTime.getTime() === slot.start.getTime();
    });
    
    if (startSlotIndex === -1) {
        // If the appointment starts mid-slot, this should return null or adjust.
        // For simplicity and alignment with the problem, we only position on 30 min intervals.
        return null; 
    }
    
    const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
    const slotsSpanned = Math.ceil(durationMinutes / slotDuration);

    return {
        top: startSlotIndex * slotHeightPx, 
        height: slotsSpanned * slotHeightPx,
        startSlotIndex,
        slotsSpanned
    };
}