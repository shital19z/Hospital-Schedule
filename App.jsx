// In src/App.jsx

import React from 'react';
import Header from './components/Header.jsx'; 
import DayView from './components/DayView.jsx'; 
import WeekView from './components/WeekView.jsx'; 
import { useAppointments } from './hooks/useAppointments.jsx'; // FIX: uses .jsx extension

function App() {
  const { 
    allDoctors, 
    selectedDoctorId, 
    setSelectedDoctorId, 
    currentDate, 
    viewMode, 
    setViewMode, 
    goToToday, 
    changeDate,
    appointments, 
    selectedDoctor 
  } = useAppointments();

  return (
    <div className="App" style={styles.appContainer}>
      <Header 
        allDoctors={allDoctors}
        selectedDoctorId={selectedDoctorId}
        setSelectedDoctorId={setSelectedDoctorId}
        currentDate={currentDate}
        viewMode={viewMode}
        setViewMode={setViewMode}
        goToToday={goToToday}
        changeDate={changeDate}
      />
      
      <main style={styles.mainContent}>
        {/* Conditional Rendering based on viewMode */}
        {viewMode === 'day' ? (
          <DayView 
            currentDate={currentDate} 
            selectedDoctor={selectedDoctor} 
            appointments={appointments} 
          />
        ) : (
          <WeekView 
            currentDate={currentDate} 
            selectedDoctor={selectedDoctor} 
            appointments={appointments} 
          />
        )}
      </main>
    </div>
  );
}

const styles = {
  appContainer: {
    maxWidth: '1200px',
    margin: '20px auto', 
    border: '1px solid #eee',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    minHeight: '80vh',
    backgroundColor: '#fff',
  },
  mainContent: {
    padding: '0 0 20px 0',
  }
};

export default App;