/**
 * Format tanggal ke format Indonesia
 * @param {Date|string} date 
 * @returns {string}
 */
export function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Format tanggal singkat
 * @param {Date|string} date 
 * @returns {string}
 */
export function formatDateShort(date) {
    const d = new Date(date);
    return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

/**
 * Format waktu ke HH:mm
 * @param {Date|string} date 
 * @returns {string}
 */
export function formatTime(date) {
    const d = new Date(date);
    return d.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

/**
 * Format waktu ke HH:mm:ss
 * @param {Date|string} date 
 * @returns {string}
 */
export function formatTimeWithSeconds(date) {
    const d = new Date(date);
    return d.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
}

/**
 * Get current date string (YYYY-MM-DD)
 * @returns {string}
 */
export function getCurrentDateString() {
    const d = new Date();
    return d.toISOString().split('T')[0];
}

/**
 * Check if a time is late based on office hours
 * @param {string} checkInTime - HH:mm format
 * @param {string} officeStartTime - HH:mm format (e.g., "08:00")
 * @returns {Object} - {isLate: boolean, lateMinutes: number}
 */
export function checkLateStatus(checkInTime, officeStartTime = '08:00') {
    const [checkHour, checkMin] = checkInTime.split(':').map(Number);
    const [officeHour, officeMin] = officeStartTime.split(':').map(Number);

    const checkMinutes = checkHour * 60 + checkMin;
    const officeMinutes = officeHour * 60 + officeMin;

    const lateMinutes = checkMinutes - officeMinutes;

    return {
        isLate: lateMinutes > 0,
        lateMinutes: Math.max(0, lateMinutes)
    };
}

/**
 * Check if leaving early based on office hours
 * @param {string} checkOutTime - HH:mm format
 * @param {string} officeEndTime - HH:mm format (e.g., "17:00")
 * @returns {Object}
 */
export function checkEarlyLeaveStatus(checkOutTime, officeEndTime = '17:00') {
    const [checkHour, checkMin] = checkOutTime.split(':').map(Number);
    const [officeHour, officeMin] = officeEndTime.split(':').map(Number);

    const checkMinutes = checkHour * 60 + checkMin;
    const officeMinutes = officeHour * 60 + officeMin;

    const earlyMinutes = officeMinutes - checkMinutes;

    return {
        isEarly: earlyMinutes > 0,
        earlyMinutes: Math.max(0, earlyMinutes)
    };
}

/**
 * Get greeting based on time of day
 * @returns {string}
 */
export function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
}

/**
 * Calculate working days in a month
 * @param {number} year 
 * @param {number} month - 0-indexed
 * @returns {number}
 */
export function getWorkingDaysInMonth(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    let workingDays = 0;

    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
        const dayOfWeek = d.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
            workingDays++;
        }
    }

    return workingDays;
}

/**
 * Get date range for current month
 * @returns {Object}
 */
export function getCurrentMonthRange() {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return {
        start: firstDay.toISOString().split('T')[0],
        end: lastDay.toISOString().split('T')[0],
        monthName: now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
    };
}

/**
 * Calculate duration between two times
 * @param {string} startTime - HH:mm
 * @param {string} endTime - HH:mm
 * @returns {string} - Duration in hours and minutes
 */
export function calculateDuration(startTime, endTime) {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    let totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    if (totalMinutes < 0) totalMinutes += 24 * 60; // Handle overnight

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours} jam ${minutes} menit`;
}
