// In src/hooks/useAppointments.jsx

import { useState, useMemo, useCallback, useEffect } from 'react';
import { appointmentService } from '../services/appointmentService.jsx'; // FIX: uses .jsx extension
import { getWeekStart } from '../utils/timeUtils.jsx'; 
import { addDays } from 'date-fns';

// Helper to get today's date at midnight for initial state
const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

/**
 * Hook to manage the application's core state and data fetching.
 */
export function useAppointments() {
  // Application State
  const allDoctors = useMemo(() => appointmentService.getDoctors(), []);
  const [selectedDoctorId, setSelectedDoctorId] = useState(allDoctors[0]?.id || 'doc-1');
  const [currentDate, setCurrentDate] = useState(getToday()); 
  const [viewMode, setViewMode] = useState('day'); // 'day' or 'week'
  const [appointments, setAppointments] = useState([]);

  // Memoized current doctor object
  const selectedDoctor = useMemo(() => {
    return allDoctors.find(doc => doc.id === selectedDoctorId);
  }, [allDoctors, selectedDoctorId]);

  // Data Fetching Logic
  const fetchAppointments = useCallback(() => {
    if (!selectedDoctor) {
        setAppointments([]);
        return;
    }

    let fetchedApts = [];
    const doctorId = selectedDoctor.id;

    if (viewMode === 'day') {
      fetchedApts = appointmentService.getAppointmentsByDoctorAndDate(
        doctorId,
        currentDate
      );
    } else { // 'week' view
      const weekStart = getWeekStart(currentDate);
      const weekEnd = addDays(weekStart, 6); // Sunday
      
      // We pass the start of Monday and end of Sunday for the service
      fetchedApts = appointmentService.getAppointmentsByDoctorAndDateRange(
        doctorId,
        weekStart,
        weekEnd
      );
    }
    
    // Enrich appointments with patient and doctor details
    const populatedApts = appointmentService.getPopulatedAppointments(fetchedApts);
    setAppointments(populatedApts);

  }, [selectedDoctor, currentDate, viewMode]);
  
  // Run the fetcher whenever dependencies change
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Navigation Functions
  const goToToday = useCallback(() => {
    setCurrentDate(getToday()); // Set a brand new date object for today
  }, []);

  const changeDate = useCallback((offset) => {
    setCurrentDate(prevDate => {
      // Calculate the number of days to shift
      const daysToShift = viewMode === 'day' ? offset : offset * 7;
      
      // Use date-fns to correctly calculate the new date and ensures immutability 
      return addDays(prevDate, daysToShift); 
    });
  }, [viewMode]);


  return {
    // Data
    allDoctors,
    selectedDoctor,
    appointments,

    // State
    selectedDoctorId,
    currentDate,
    viewMode,
    
    // Actions
    setSelectedDoctorId,
    setViewMode,
    goToToday,
    changeDate,
  };
}