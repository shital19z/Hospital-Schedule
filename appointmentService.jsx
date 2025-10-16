// In src/services/appointmentService.jsx

import { MOCK_APPOINTMENTS, MOCK_DOCTORS, MOCK_PATIENTS, getDoctorById, getPatientById } from '../data/mockData.jsx';
import { format, isSameDay } from 'date-fns';

class AppointmentService {

  getDoctors() {
    return MOCK_DOCTORS;
  }

  getDoctor(id) {
    return getDoctorById(id);
  }

  getPatients() {
    return MOCK_PATIENTS;
  }

  getPatient(id) {
    return getPatientById(id);
  }

  /**
   * Filters appointments for a single day based on doctor ID.
   */
  getAppointmentsByDoctorAndDate(doctorId, date) {
    return MOCK_APPOINTMENTS.filter((apt) => {
      if (apt.doctorId !== doctorId) return false;

      const aptStart = new Date(apt.startTime);
      
      // Use date-fns for robust date comparison
      return isSameDay(aptStart, date);
    });
  }

  /**
   * Filters appointments within an inclusive date range (used for WeekView).
   */
  getAppointmentsByDoctorAndDateRange(doctorId, startDate, endDate) {
    
    // Set time boundaries for inclusive range
    const startRange = new Date(startDate);
    startRange.setHours(0, 0, 0, 0);

    const endRange = new Date(endDate);
    endRange.setHours(23, 59, 59, 999);

    return MOCK_APPOINTMENTS.filter((apt) => {
      if (apt.doctorId !== doctorId) return false;

      const aptStart = new Date(apt.startTime);
      
      // Check if the appointment start time is within the inclusive range
      return aptStart >= startRange && aptStart <= endRange;
    });
  }

  /**
   * Enriches raw appointments with doctor and patient objects.
   */
  getPopulatedAppointments(appointments) {
    return appointments.map(apt => ({
      ...apt,
      doctor: this.getDoctor(apt.doctorId),
      patient: this.getPatient(apt.patientId),
    }));
  }
}

export const appointmentService = new AppointmentService();