// In src/components/WeekView.jsx

import React, { useMemo } from 'react';
// FIX: Added isSameDay to the date-fns import
import { getWeekDates, generateTimeSlots, formatTime, getDayName, isToday } from '../utils/timeUtils.jsx'; 
import { getAppointmentColor, calculateAppointmentPosition, getDoctorWorkingHours, isDoctorWorking } from '../utils/calendarUtils.jsx'; 
import { CALENDAR_CONFIG } from '../data/constants.jsx'; // FIX: Imported CALENDAR_CONFIG
import { format, isPast, isSameDay } from 'date-fns'; // FIX: Added isSameDay here

// Constants
const SLOT_HEIGHT_PX = CALENDAR_CONFIG.slotHeightPx || 60; 

// Component for a single appointment block
const AppointmentBlock = ({ appointment, timeSlots }) => {
    // timeSlots are based on Monday's date, but position logic is time-based only
    const position = calculateAppointmentPosition(appointment, timeSlots); 
    if (!position) return null; 

    const color = getAppointmentColor(appointment.type);

    return (
        <div 
            title={`${appointment.patient.name} - ${formatTime(new Date(appointment.startTime))}`}
            style={{ 
                ...styles.appointmentBlock, 
                backgroundColor: color, 
                top: `${position.top}px`, 
                height: `${position.height}px` 
            }}
        >
            <p style={styles.aptTime}>{formatTime(new Date(appointment.startTime))}</p>
            <p style={styles.aptTitle}>{appointment.patient.name}</p>
        </div>
    );
};

// Component for a single day column in the week view
const WeekDayColumn = ({ dayDate, selectedDoctor, allAppointments, timeSlots }) => {
    
    const dayName = getDayName(dayDate);

    // FIX: Filtering appointments here using isSameDay, which now works
    const dayAppointments = useMemo(() => {
        return allAppointments.filter(apt => isSameDay(new Date(apt.startTime), dayDate));
    }, [allAppointments, dayDate]);

    const doctorSchedule = getDoctorWorkingHours(selectedDoctor, dayDate);
    const isWorking = isDoctorWorking(selectedDoctor, dayDate);
    const isCurrentDay = isToday(dayDate);
    const today = new Date();
    const isDayInPast = isPast(dayDate) && !isSameDay(dayDate, today);

    const getSlotStyle = (slot) => {
        let style = styles.slot;

        // 1. Non-working hours highlight
        if (isWorking && doctorSchedule) {
            const slotStartHour = slot.start.getHours() + slot.start.getMinutes() / 60;
            const startHour = parseInt(doctorSchedule.start.split(':')[0]);
            const endHour = parseInt(doctorSchedule.end.split(':')[0]);

            if (slotStartHour < startHour || slotStartHour >= endHour) {
                style = { ...style, ...styles.nonWorkingSlot };
            }
        } else if (!isWorking) {
             style = { ...style, ...styles.nonWorkingSlot };
        }

        // 2. Past slots highlight
        if (isDayInPast || (isCurrentDay && isPast(slot.start))) {
             style = { ...style, ...styles.pastSlot };
        }

        return style;
    };
    
    return (
        <div 
            style={{
                ...styles.dayColumn, 
                ...(isCurrentDay && styles.currentDayColumn)
            }}
        >
            {/* Time Slots (Background) */}
            {timeSlots.map((slot, index) => (
                <div key={index} style={getSlotStyle(slot)}></div>
            ))}

            {/* Appointments Overlay */}
            <div style={styles.appointmentsOverlay}>
                {dayAppointments.map(apt => (
                    <AppointmentBlock key={apt.id} appointment={apt} timeSlots={timeSlots} />
                ))}
            </div>
            {!isWorking && (
                <div style={styles.dayOffLabel}>DAY OFF</div>
            )}
        </div>
    );
};

// Main Week View Component
function WeekView({ currentDate, selectedDoctor, appointments }) {

    const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate]);
    // Generate time slots based on the first day of the week (or any day, as time is constant)
    const timeSlots = useMemo(() => generateTimeSlots(weekDates[0]), [weekDates]);

    if (!selectedDoctor) {
        return <div style={styles.noDoctor}>Please select a doctor to view the schedule.</div>;
    }

    return (
        <div style={styles.weekViewContainer}>
            <div style={styles.infoBar}>
                <h2>Dr. {selectedDoctor.name} ({selectedDoctor.specialty})</h2>
                <p>{format(weekDates[0], 'MMM d')} - {format(weekDates[6], 'MMM d, yyyy')}</p>
            </div>
            
            <div style={styles.weekGrid}>
                {/* Header Row */}
                <div style={styles.timeHeaderColumn}></div> {/* Empty corner */}
                {weekDates.map((date, index) => (
                    <div 
                        key={index} 
                        style={{...styles.dayHeader, ...(isToday(date) && styles.currentDayHeader)}}
                    >
                        {format(date, 'EEE')} <br /> {format(date, 'MMM d')}
                    </div>
                ))}
                
                {/* Calendar Body */}
                <div style={styles.timeColumn}>
                    {timeSlots.filter(slot => slot.start.getMinutes() === 0).map((slot, index) => (
                        <div key={index} style={styles.timeLabel}>
                            {format(slot.start, 'h a')}
                        </div>
                    ))}
                </div>

                {/* Day Columns */}
                {weekDates.map((date, index) => (
                    <WeekDayColumn 
                        key={index}
                        dayDate={date}
                        selectedDoctor={selectedDoctor}
                        allAppointments={appointments}
                        timeSlots={timeSlots}
                    />
                ))}
            </div>
        </div>
    );
}

const styles = {
    noDoctor: {
        padding: '20px',
        textAlign: 'center',
        color: '#888',
        fontSize: '18px',
    },
    infoBar: {
        padding: '10px 20px',
        borderBottom: '1px solid #ccc',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    weekViewContainer: {
        margin: '20px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        overflowX: 'auto',
        minWidth: '700px',
    },
    weekGrid: {
        display: 'grid',
        gridTemplateColumns: `80px repeat(7, 1fr)`, // Time column + 7 day columns
        height: `${(18 - 8) * 2 * SLOT_HEIGHT_PX}px`,
    },
    timeHeaderColumn: {
        gridColumn: '1 / 2',
        borderRight: '1px solid #ccc',
        borderBottom: '1px solid #ccc',
    },
    dayHeader: {
        padding: '10px 5px',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '12px',
        borderRight: '1px solid #eee',
        borderBottom: '1px solid #ccc',
    },
    currentDayHeader: {
        backgroundColor: '#e6f7ff',
        color: '#007bff',
    },
    timeColumn: {
        gridColumn: '1 / 2',
        borderRight: '1px solid #ccc',
        backgroundColor: '#f9f9f9',
    },
    timeLabel: {
        height: `${SLOT_HEIGHT_PX * 2}px`, 
        marginTop: `-${SLOT_HEIGHT_PX}px`, 
        paddingRight: '10px',
        textAlign: 'right', 
        fontSize: '11px',
        color: '#777', 
        pointerEvents: 'none',
        fontWeight: 'bold',
        lineHeight: `${SLOT_HEIGHT_PX * 2}px`, // Center text vertically
    },
    dayColumn: {
        position: 'relative',
        borderRight: '1px solid #ccc',
        overflow: 'hidden',
    },
    currentDayColumn: {
        backgroundColor: '#f0faff', // Very light blue for today's column
    },
    slot: {
        height: `${SLOT_HEIGHT_PX}px`,
        borderBottom: '1px solid #eee',
        borderTop: '1px dotted #f3f3f3', 
    },
    nonWorkingSlot: {
        backgroundColor: '#f8f8f8', 
    },
    pastSlot: { 
        backgroundColor: '#fafafa', 
    },
    appointmentsOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    appointmentBlock: {
        position: 'absolute',
        left: '2px', 
        right: '2px', 
        borderRadius: '3px',
        padding: '3px 5px',
        color: 'white',
        fontSize: '10px',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
    },
    aptTime: {
        margin: '0',
        fontWeight: 'bold',
        fontSize: '8px',
    },
    aptTitle: {
        margin: '1px 0 0 0',
        fontWeight: 'bold',
    },
    dayOffLabel: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: '#aaa',
        fontSize: '18px',
        fontWeight: 'bold',
        opacity: 0.5,
        pointerEvents: 'none',
    }
};

export default WeekView;