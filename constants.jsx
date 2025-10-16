// In src/data/constants.jsx

// Configuration for time slots and layout
export const CALENDAR_CONFIG = {
    startTime: 8, // 8 AM
    endTime: 18,  // 6 PM
    slotDurationMinutes: 30,
    slotHeightPx: 60,
};

// Colors for different appointment types
export const APPOINTMENT_TYPE_CONFIG = {
    checkup: { color: '#007bff', label: 'Check-up' },
    consultation: { color: '#28a745', label: 'Consultation' },
    followUp: { color: '#ffc107', label: 'Follow-up' },
    procedure: { color: '#dc3545', label: 'Procedure' },
};

// Doctor-specific working hours (by day of the week, three-letter code)
export const DOCTOR_SCHEDULES = {
    default: {
        mon: { start: '09:00', end: '17:00' }, tue: { start: '09:00', end: '17:00' }, wed: { start: '09:00', end: '17:00' },
        thu: { start: '09:00', end: '17:00' }, fri: { start: '09:00', end: '17:00' }, sat: null, sun: null,
    },
    'doc-2': { // Corresponds to Dr. Michael Rodriguez
        mon: { start: '08:00', end: '16:00' }, tue: { start: '08:00', end: '16:00' }, wed: { start: '08:00', end: '12:00' }, 
        thu: { start: '08:00', end: '16:00' }, fri: { start: '08:00', end: '16:00' }, sat: null, sun: null,
    },
    'doc-3': { // Corresponds to Dr. Emily Johnson
        mon: null, tue: { start: '10:00', end: '18:00' }, wed: null, 
        thu: { start: '10:00', end: '18:00' }, fri: { start: '10:00', end: '18:00' }, sat: { start: '10:00', end: '13:00' }, sun: null,
    },
    'doc-1': { // Corresponds to Dr. Sarah Chen
        mon: { start: '09:00', end: '17:00' }, tue: { start: '09:00', end: '17:00' }, wed: { start: '09:00', end: '17:00' },
        thu: { start: '09:00', end: '17:00' }, fri: { start: '09:00', end: '17:00' }, sat: null, sun: null,
    },
};