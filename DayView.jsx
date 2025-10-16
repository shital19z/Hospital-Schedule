import React, { useMemo } from 'react';
// Essential date-fns imports, including the fix for 'isSameDay is not defined'
import { format, isToday, isPast, isSameDay } from 'date-fns'; 
import { generateTimeSlots, formatTime } from '../utils/timeUtils.jsx'; 
import { getAppointmentColor, calculateAppointmentPosition, getDoctorWorkingHours, isDoctorWorking } from '../utils/calendarUtils.jsx'; 
import { CALENDAR_CONFIG } from '../data/constants.jsx';

// Constants
const SLOT_HEIGHT_PX = CALENDAR_CONFIG.slotHeightPx || 60; 

// Component for a single appointment block
const AppointmentBlock = ({ appointment, timeSlots }) => {
    // Calculates position and height in pixels
    const position = calculateAppointmentPosition(appointment, timeSlots);
    if (!position) return null; 

    const color = getAppointmentColor(appointment.type);
    const durationMinutes = Math.round((new Date(appointment.endTime).getTime() - new Date(appointment.startTime).getTime()) / (1000 * 60));

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
            <p style={styles.aptSubtitle}>{appointment.type} ({durationMinutes} min)</p>
        </div>
    );
};

// Main Day View Component
function DayView({ currentDate, selectedDoctor, appointments }) {
    
    // Generate time slots (e.g., 8:00, 8:30, 9:00, etc.)
    const timeSlots = useMemo(() => generateTimeSlots(currentDate), [currentDate]);
    
    if (!selectedDoctor) {
        return <div style={styles.noDoctor}>Please select a doctor to view the schedule.</div>;
    }

    const doctorSchedule = getDoctorWorkingHours(selectedDoctor, currentDate);
    const isWorkingDay = isDoctorWorking(selectedDoctor, currentDate);
    const today = new Date();

    // Check if the current date is in the past (using isSameDay for today check)
    const isDayInPast = isPast(currentDate) && !isSameDay(currentDate, today);

    const getSlotStyle = (slot) => {
        let style = styles.slot;

        // 1. Non-working hours highlight
        if (isWorkingDay && doctorSchedule) {
            const slotStartHour = slot.start.getHours() + slot.start.getMinutes() / 60;
            const startHour = parseInt(doctorSchedule.start.split(':')[0]);
            const endHour = parseInt(doctorSchedule.end.split(':')[0]);

            if (slotStartHour < startHour || slotStartHour >= endHour) {
                style = { ...style, ...styles.nonWorkingSlot };
            }
        } else if (!isWorkingDay) {
             style = { ...style, ...styles.nonWorkingSlot };
        }

        // 2. Past slots highlight
        if (isDayInPast || (isToday(currentDate) && isPast(slot.start))) {
             style = { ...style, ...styles.pastSlot };
        }

        return style;
    };


    return (
        <div style={styles.dayViewContainer}>
            <div style={styles.infoBar}>
                <h2>Dr. {selectedDoctor.name} ({selectedDoctor.specialty})</h2>
                {isWorkingDay ? (
                    <p>Working Hours: {doctorSchedule.start} - {doctorSchedule.end}</p>
                ) : (
                    <p style={{ color: 'red', fontWeight: 'bold' }}>Day Off</p>
                )}
            </div>

            <div style={styles.calendarGrid}>
                {/* Time Column (Labels) */}
                <div style={styles.timeColumn}>
                    <div style={styles.timeHeader}>Time</div>
                    {/* Only label slots starting at the hour */}
                    {timeSlots.filter(slot => slot.start.getMinutes() === 0).map((slot, index) => (
                        <div key={index} style={styles.timeLabel}>
                            {format(slot.start, 'h a')}
                        </div>
                    ))}
                </div>

                {/* Appointment Grid */}
                <div style={styles.appointmentGrid}>
                    {/* Time Slots (Background Grid for Styling) */}
                    {timeSlots.map((slot, index) => (
                        <div key={index} style={getSlotStyle(slot)}></div>
                    ))}

                    {/* Appointments Overlay */}
                    <div style={styles.appointmentsOverlay}>
                        {appointments.map(apt => (
                            <AppointmentBlock key={apt.id} appointment={apt} timeSlots={timeSlots} />
                        ))}
                    </div>
                </div>
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
    },
    dayViewContainer: {
        margin: '20px',
        border: '1px solid #ccc', 
        borderRadius: '4px', 
        overflow: 'hidden',
        minHeight: '600px',
    },
    calendarGrid: { 
        display: 'flex', 
        flexGrow: 1, 
        height: `${(CALENDAR_CONFIG.endTime - CALENDAR_CONFIG.startTime) * (60 / CALENDAR_CONFIG.slotDurationMinutes) * SLOT_HEIGHT_PX}px`, 
    },
    timeColumn: { 
        width: '80px', 
        flexShrink: 0, 
        backgroundColor: '#f9f9f9', 
        borderRight: '1px solid #ccc', 
    },
    timeHeader: { 
        height: '30px', 
        lineHeight: '30px', 
        textAlign: 'center', 
        fontWeight: 'bold', 
        fontSize: '14px', 
        visibility: 'hidden'
    },
    timeLabel: { 
        height: `${SLOT_HEIGHT_PX * 2}px`, 
        marginTop: `-${SLOT_HEIGHT_PX}px`, 
        paddingRight: '10px', 
        textAlign: 'right', 
        fontSize: '12px', 
        color: '#777', 
        pointerEvents: 'none', 
        fontWeight: 'bold',
    },
    appointmentGrid: { 
        flexGrow: 1, 
        position: 'relative', 
    },
    slot: { 
        height: `${SLOT_HEIGHT_PX}px`, 
        borderBottom: '1px solid #eee', 
        borderTop: '1px dotted #f3f3f3', 
    },
    nonWorkingSlot: { 
        backgroundColor: '#f3f3f3', 
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
        left: '5px', 
        right: '5px', 
        borderRadius: '4px', 
        padding: '5px 8px', 
        color: 'white', 
        fontSize: '12px', 
        overflow: 'hidden', 
        cursor: 'pointer', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    },
    aptTime: {
        margin: '0',
        fontWeight: 'bold',
        fontSize: '10px',
    },
    aptTitle: {
        margin: '1px 0 0 0',
        fontWeight: 'bold',
    },
    aptSubtitle: {
        margin: '0',
        fontSize: '10px',
        opacity: 0.9,
    },
};

export default DayView;