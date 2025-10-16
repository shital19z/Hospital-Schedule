// In src/components/Header.jsx

import React from 'react';
import { format, addDays, startOfWeek } from 'date-fns';

function Header({ 
    allDoctors, 
    selectedDoctorId, 
    setSelectedDoctorId, 
    currentDate, 
    viewMode, 
    setViewMode, 
    goToToday, 
    changeDate 
}) {
    
    // Helper to get the start of the current week (Monday)
    const getWeekStart = (date) => startOfWeek(date, { weekStartsOn: 1 });

    const displayDate = () => {
        if (viewMode === 'day') {
            return format(currentDate, 'EEEE, MMM d, yyyy');
        }
        
        // For Week View, show the Mon - Sun range
        const weekStart = getWeekStart(currentDate);
        const weekEnd = addDays(weekStart, 6);
        
        const startFormat = format(weekStart, 'MMM d');
        const endFormat = format(weekEnd, 'MMM d, yyyy');
        
        return `${startFormat} - ${endFormat}`;
    };

    return (
        <header style={styles.header}>
            <div style={styles.titleSection}>
                 <h1 style={styles.h1}>Hospital Scheduler</h1>
                 <p style={styles.subtitle}>{displayDate()}</p>
            </div>


            <div style={styles.controls}>
                {/* Doctor Selection */}
                <select 
                    value={selectedDoctorId} 
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    style={styles.select}
                    title="Select Doctor"
                >
                    {allDoctors.map(doctor => (
                        <option key={doctor.id} value={doctor.id}>
                            Dr. {doctor.name} ({doctor.specialty})
                        </option>
                    ))}
                </select>

                {/* Date Navigation */}
                <div style={styles.dateNav}>
                    <button onClick={() => changeDate(-1)} style={styles.navButton} title="Previous">{'<'}</button>
                    <button onClick={goToToday} style={{...styles.navButton, fontWeight: 'bold'}} title="Today">Today</button>
                    <button onClick={() => changeDate(1)} style={styles.navButton} title="Next">{'>'}</button>
                </div>

                {/* View Toggle */}
                <div style={styles.viewToggle}>
                    <button 
                        onClick={() => setViewMode('day')} 
                        style={{...styles.viewButton, ...(viewMode === 'day' && styles.activeView)}}
                    >
                        Day
                    </button>
                    <button 
                        onClick={() => setViewMode('week')} 
                        style={{...styles.viewButton, ...(viewMode === 'week' && styles.activeView)}}
                    >
                        Week
                    </button>
                </div>
            </div>
        </header>
    );
}

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        borderBottom: '1px solid #ccc',
        backgroundColor: '#fff',
    },
    titleSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
    },
    h1: {
        fontSize: '24px',
        margin: '0',
        color: '#333',
    },
    subtitle: {
        fontSize: '14px',
        margin: '0',
        color: '#777',
        fontWeight: 'normal',
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    select: {
        padding: '8px',
        fontSize: '14px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    viewToggle: {
        display: 'flex',
        borderRadius: '4px',
        overflow: 'hidden',
        border: '1px solid #ccc',
    },
    viewButton: {
        padding: '8px 15px',
        fontSize: '14px',
        cursor: 'pointer',
        border: 'none',
        backgroundColor: '#fff',
    },
    activeView: {
        backgroundColor: '#007bff',
        color: 'white',
    },
    dateNav: {
        display: 'flex',
        gap: '5px',
        alignItems: 'center',
    },
    navButton: {
        padding: '8px 12px',
        fontSize: '14px',
        cursor: 'pointer',
        border: '1px solid #ccc',
        borderRadius: '4px',
        backgroundColor: '#fff',
    },
};

export default Header;