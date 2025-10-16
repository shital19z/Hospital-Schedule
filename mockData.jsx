// In src/data/mockData.jsx

import { addMinutes, startOfWeek, addDays } from 'date-fns';

// Use a dynamic week start relative to today
const TODAY = new Date();
const WEEK_START = startOfWeek(TODAY, { weekStartsOn: 1 }); // Starts on Monday (1)

// Helper function to get a date for a specific day and time in the current week
const getWeekDate = (dayOffset, hour, minute = 0) => {
    const date = addDays(WEEK_START, dayOffset);
    date.setHours(hour, minute, 0, 0);
    return date.toISOString(); 
};

const getEndTime = (startTimeIso, durationMinutes) => {
    return addMinutes(new Date(startTimeIso), durationMinutes).toISOString();
};


// --- MOCK DOCTORS ---
export const MOCK_DOCTORS = [
  { id: 'doc-1', name: 'Dr. Sarah Chen', specialty: 'Cardiology' },
  { id: 'doc-2', name: 'Dr. Michael Rodriguez', specialty: 'Pediatrics' },
  { id: 'doc-3', name: 'Dr. Emily Johnson', specialty: 'Dermatology' },
];

export const MOCK_PATIENTS = [
  { id: 'pat-1', name: 'Alice Smith' },
  { id: 'pat-2', name: 'Bob Johnson' },
  { id: 'pat-3', name: 'Charlie Brown' },
  { id: 'pat-4', name: 'Diana Prince' },
  { id: 'pat-5', name: 'Ethan Hunt' },
  { id: 'pat-6', name: 'Fiona Glenn' },
  { id: 'pat-7', name: 'George Harrison' },
  { id: 'pat-8', name: 'Hannah Scott' },
];

// --- MOCK APPOINTMENTS (Dynamically set to the current calendar week) ---
export const MOCK_APPOINTMENTS = [
  // Dr. Sarah Chen (doc-1)
  { id: 'apt-1', patientId: 'pat-1', doctorId: 'doc-1', type: 'checkup', startTime: getWeekDate(0, 9, 0), endTime: getEndTime(getWeekDate(0, 9, 0), 30), status: 'scheduled' }, // Mon 9:00 AM
  { id: 'apt-2', patientId: 'pat-2', doctorId: 'doc-1', type: 'consultation', startTime: getWeekDate(1, 10, 0), endTime: getEndTime(getWeekDate(1, 10, 0), 60), status: 'scheduled' }, // Tue 10:00 AM
  { id: 'apt-3', patientId: 'pat-3', doctorId: 'doc-1', type: 'followUp', startTime: getWeekDate(3, 14, 30), endTime: getEndTime(getWeekDate(3, 14, 30), 45), status: 'scheduled' }, // Thu 2:30 PM
  
  // Dr. Michael Rodriguez (doc-2)
  { id: 'apt-5', patientId: 'pat-5', doctorId: 'doc-2', type: 'checkup', startTime: getWeekDate(0, 8, 0), endTime: getEndTime(getWeekDate(0, 8, 0), 30), status: 'scheduled' }, // Mon 8:00 AM
  { id: 'apt-6', patientId: 'pat-6', doctorId: 'doc-2', type: 'consultation', startTime: getWeekDate(2, 9, 0), endTime: getEndTime(getWeekDate(2, 9, 0), 60), status: 'scheduled' }, // Wed 9:00 AM
  
  // Dr. Emily Johnson (doc-3)
  { id: 'apt-7', patientId: 'pat-7', doctorId: 'doc-3', type: 'consultation', startTime: getWeekDate(1, 10, 0), endTime: getEndTime(getWeekDate(1, 10, 0), 60), status: 'scheduled' }, // Tue 10:00 AM
  { id: 'apt-8', patientId: 'pat-8', doctorId: 'doc-3', type: 'checkup', startTime: getWeekDate(4, 12, 0), endTime: getEndTime(getWeekDate(4, 12, 0), 30), status: 'scheduled' }, // Fri 12:00 PM
];

// Service helpers
export const getDoctorById = (id) => MOCK_DOCTORS.find(doc => doc.id === id);
export const getPatientById = (id) => MOCK_PATIENTS.find(pat => pat.id === id);