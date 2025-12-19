// Storage keys
const KEYS = {
    USERS: 'pppk_users',
    OFFICES: 'pppk_offices',
    ATTENDANCES: 'pppk_attendances',
    LEAVES: 'pppk_leaves',
    CURRENT_USER: 'pppk_current_user',
    SETTINGS: 'pppk_settings'
};

// Initial seed data
const SEED_DATA = {
    offices: [
        {
            id: 1,
            name: 'Dinas Pemadam Kebakaran dan Penyelamatan Kota Bogor',
            address: 'Jl. Raya Pajajaran No.01 raya, RT.07/RW.02, Sukasari, Kec. Bogor Tim., Kota Bogor, Jawa Barat 16142',
            lat: -6.200000,
            lon: 106.816666,
            radius: 100,
            workStart: '08:00',
            workEnd: '23:00'
        },
        {
            id: 2,
            name: 'Dinas Pemadam Kebakaran dan Penyelamatan (YASMIN)',
            address: 'Jl. KH. R. Abdullah Bin Nuh No.1, RT.03/RW.01, Curugmekar, Kec. Bogor Bar., Kota Bogor, Jawa Barat 16113',
            lat: -6.188820,
            lon: 106.838820,
            radius: 50,
            workStart: '08:00',
            workEnd: '23:00'
        },
        {
            id: 3,
            name: 'Dinas Pemadam Kebakaran dan Penyelamatan (CIBULUH)',
            address: 'Jalan Raya Ciluar Simpang Pomad Ciluar, RT.04/RW.01, Cibuluh, Kec. Bogor Utara, Kota Bogor, Jawa Barat 16154',
            lat: -6.188820,
            lon: 106.838820,
            radius: 50,
            workStart: '08:00',
            workEnd: '23:00'
        }
    ],
    users: [
        {
            id: 1,
            nip: '197501012019031001',
            password: 'admin123',
            fullName: 'AdminDPKP.',
            role: 'admin',
            position: 'Admin',
            officeId: 1,
            avatar: null,
            createdAt: '2024-01-01'
        },
        {
            id: 2,
            nip: '199407152025211002',
            password: '1994',
            fullName: 'DINO SATRIO, A.md',
            role: 'employee',
            position: 'PENGELOLA LAYANAN OPERASIONAL',
            officeId: 2,
            avatar: null,
            createdAt: '2024-01-15'
        },
        {
            id: 3,
            nip: '199001012021012001',
            password: 'password123',
            fullName: 'Siti Rahayu, S.Pd.',
            role: 'employee',
            position: 'Guru Bahasa Indonesia',
            officeId: 2,
            avatar: null,
            createdAt: '2024-02-01'
        },
        {
            id: 4,
            nip: '198505152022011002',
            password: 'password123',
            fullName: 'Eko Prasetyo, S.Kom.',
            role: 'employee',
            position: 'Staff IT',
            officeId: 1,
            avatar: null,
            createdAt: '2024-03-01'
        }
    ],
    attendances: [
        // Sample attendance data for testing
        {
            id: 1,
            userId: 2,
            date: '2024-12-16',
            clockInTime: '07:55',
            clockInLat: -6.188825,
            clockInLon: 106.838825,
            clockInPhoto: null,
            clockOutTime: '14:05',
            clockOutLat: -6.188830,
            clockOutLon: 106.838830,
            clockOutPhoto: null,
            status: 'hadir'
        },
        {
            id: 2,
            userId: 2,
            date: '2024-12-17',
            clockInTime: '08:15',
            clockInLat: -6.188825,
            clockInLon: 106.838825,
            clockInPhoto: null,
            clockOutTime: '14:00',
            clockOutLat: -6.188830,
            clockOutLon: 106.838830,
            clockOutPhoto: null,
            status: 'terlambat'
        },
        {
            id: 3,
            userId: 3,
            date: '2024-12-16',
            clockInTime: '06:58',
            clockInLat: -6.188820,
            clockInLon: 106.838820,
            clockInPhoto: null,
            clockOutTime: '14:02',
            clockOutLat: -6.188820,
            clockOutLon: 106.838820,
            clockOutPhoto: null,
            status: 'hadir'
        }
    ],
    leaves: [
        {
            id: 1,
            userId: 2,
            type: 'sakit',
            startDate: '2024-12-10',
            endDate: '2024-12-11',
            reason: 'Demam dan flu',
            attachmentUrl: null,
            status: 'approved',
            approvedBy: 1,
            createdAt: '2024-12-09'
        },
        {
            id: 2,
            userId: 3,
            type: 'cuti_tahunan',
            startDate: '2024-12-20',
            endDate: '2024-12-25',
            reason: 'Liburan akhir tahun',
            attachmentUrl: null,
            status: 'pending',
            approvedBy: null,
            createdAt: '2024-12-15'
        }
    ],
    settings: {
        allowMockLocation: true, // For testing purposes
        autoClockOut: false,
        reminderEnabled: true
    }
};

// Initialize storage with seed data if empty
export function initializeStorage() {
    if (!localStorage.getItem(KEYS.OFFICES)) {
        localStorage.setItem(KEYS.OFFICES, JSON.stringify(SEED_DATA.offices));
    }
    if (!localStorage.getItem(KEYS.USERS)) {
        localStorage.setItem(KEYS.USERS, JSON.stringify(SEED_DATA.users));
    }
    if (!localStorage.getItem(KEYS.ATTENDANCES)) {
        localStorage.setItem(KEYS.ATTENDANCES, JSON.stringify(SEED_DATA.attendances));
    }
    if (!localStorage.getItem(KEYS.LEAVES)) {
        localStorage.setItem(KEYS.LEAVES, JSON.stringify(SEED_DATA.leaves));
    }
    if (!localStorage.getItem(KEYS.SETTINGS)) {
        localStorage.setItem(KEYS.SETTINGS, JSON.stringify(SEED_DATA.settings));
    }
}

// Generic CRUD operations
function getAll(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

function getById(key, id) {
    const items = getAll(key);
    return items.find(item => item.id === id);
}

function create(key, item) {
    const items = getAll(key);
    const newItem = {
        ...item,
        id: items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1,
        createdAt: new Date().toISOString()
    };
    items.push(newItem);
    localStorage.setItem(key, JSON.stringify(items));
    return newItem;
}

function update(key, id, updates) {
    const items = getAll(key);
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
        items[index] = { ...items[index], ...updates };
        localStorage.setItem(key, JSON.stringify(items));
        return items[index];
    }
    return null;
}

function remove(key, id) {
    const items = getAll(key);
    const filtered = items.filter(item => item.id !== id);
    localStorage.setItem(key, JSON.stringify(filtered));
    return filtered;
}

// User operations
export const userStorage = {
    getAll: () => getAll(KEYS.USERS),
    getById: (id) => getById(KEYS.USERS, id),
    getByNip: (nip) => getAll(KEYS.USERS).find(u => u.nip === nip),
    create: (user) => create(KEYS.USERS, user),
    update: (id, updates) => update(KEYS.USERS, id, updates),
    delete: (id) => remove(KEYS.USERS, id),

    // Authentication
    login: (nip, password) => {
        const user = getAll(KEYS.USERS).find(u => u.nip === nip && u.password === password);
        if (user) {
            const { password: _, ...safeUser } = user;
            localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(safeUser));
            return safeUser;
        }
        return null;
    },
    logout: () => {
        localStorage.removeItem(KEYS.CURRENT_USER);
    },
    getCurrentUser: () => {
        const data = localStorage.getItem(KEYS.CURRENT_USER);
        return data ? JSON.parse(data) : null;
    }
};

// Office operations
export const officeStorage = {
    getAll: () => getAll(KEYS.OFFICES),
    getById: (id) => getById(KEYS.OFFICES, id),
    create: (office) => create(KEYS.OFFICES, office),
    update: (id, updates) => update(KEYS.OFFICES, id, updates),
    delete: (id) => remove(KEYS.OFFICES, id)
};

// Attendance operations
export const attendanceStorage = {
    getAll: () => getAll(KEYS.ATTENDANCES),
    getById: (id) => getById(KEYS.ATTENDANCES, id),
    getByUserId: (userId) => getAll(KEYS.ATTENDANCES).filter(a => a.userId === userId),
    getByDate: (date) => getAll(KEYS.ATTENDANCES).filter(a => a.date === date),
    getByUserAndDate: (userId, date) => getAll(KEYS.ATTENDANCES).find(a => a.userId === userId && a.date === date),

    create: (attendance) => create(KEYS.ATTENDANCES, attendance),
    update: (id, updates) => update(KEYS.ATTENDANCES, id, updates),
    delete: (id) => remove(KEYS.ATTENDANCES, id),

    // Clock in
    clockIn: (userId, location, photoData) => {
        const today = new Date().toISOString().split('T')[0];
        const existing = getAll(KEYS.ATTENDANCES).find(a => a.userId === userId && a.date === today);

        if (existing && existing.clockInTime) {
            return { success: false, error: 'Anda sudah melakukan absen masuk hari ini' };
        }

        const now = new Date();
        const timeStr = now.toTimeString().slice(0, 5);

        // Determine status based on office hours
        const user = userStorage.getById(userId);
        const office = officeStorage.getById(user?.officeId);
        const workStart = office?.workStart || '08:00';

        const [checkHour, checkMin] = timeStr.split(':').map(Number);
        const [startHour, startMin] = workStart.split(':').map(Number);
        const isLate = (checkHour * 60 + checkMin) > (startHour * 60 + startMin);

        const attendance = create(KEYS.ATTENDANCES, {
            userId,
            date: today,
            clockInTime: timeStr,
            clockInLat: location.lat,
            clockInLon: location.lon,
            clockInPhoto: photoData,
            clockOutTime: null,
            clockOutLat: null,
            clockOutLon: null,
            clockOutPhoto: null,
            status: isLate ? 'terlambat' : 'hadir'
        });

        return { success: true, data: attendance };
    },

    // Clock out
    clockOut: (userId, location, photoData) => {
        const today = new Date().toISOString().split('T')[0];
        const existing = getAll(KEYS.ATTENDANCES).find(a => a.userId === userId && a.date === today);

        if (!existing) {
            return { success: false, error: 'Anda belum melakukan absen masuk hari ini' };
        }

        if (existing.clockOutTime) {
            return { success: false, error: 'Anda sudah melakukan absen pulang hari ini' };
        }

        const now = new Date();
        const timeStr = now.toTimeString().slice(0, 5);

        // Check for early leave
        const user = userStorage.getById(userId);
        const office = officeStorage.getById(user?.officeId);
        const workEnd = office?.workEnd || '17:00';

        const [checkHour, checkMin] = timeStr.split(':').map(Number);
        const [endHour, endMin] = workEnd.split(':').map(Number);
        const isEarly = (checkHour * 60 + checkMin) < (endHour * 60 + endMin);

        const updatedStatus = isEarly ? 'pulang_cepat' : existing.status;

        const updated = update(KEYS.ATTENDANCES, existing.id, {
            clockOutTime: timeStr,
            clockOutLat: location.lat,
            clockOutLon: location.lon,
            clockOutPhoto: photoData,
            status: updatedStatus
        });

        return { success: true, data: updated };
    },

    // Get statistics
    getStats: (userId, startDate, endDate) => {
        const attendances = getAll(KEYS.ATTENDANCES).filter(a => {
            if (userId && a.userId !== userId) return false;
            if (startDate && a.date < startDate) return false;
            if (endDate && a.date > endDate) return false;
            return true;
        });

        return {
            total: attendances.length,
            hadir: attendances.filter(a => a.status === 'hadir').length,
            terlambat: attendances.filter(a => a.status === 'terlambat').length,
            pulangCepat: attendances.filter(a => a.status === 'pulang_cepat').length
        };
    }
};

// Leave operations
export const leaveStorage = {
    getAll: () => getAll(KEYS.LEAVES),
    getById: (id) => getById(KEYS.LEAVES, id),
    getByUserId: (userId) => getAll(KEYS.LEAVES).filter(l => l.userId === userId),
    getPending: () => getAll(KEYS.LEAVES).filter(l => l.status === 'pending'),

    create: (leave) => create(KEYS.LEAVES, { ...leave, status: 'pending' }),
    update: (id, updates) => update(KEYS.LEAVES, id, updates),
    delete: (id) => remove(KEYS.LEAVES, id),

    approve: (id, adminId) => update(KEYS.LEAVES, id, { status: 'approved', approvedBy: adminId }),
    reject: (id, adminId) => update(KEYS.LEAVES, id, { status: 'rejected', approvedBy: adminId }),

    // Get statistics
    getStats: (userId) => {
        const leaves = userId ? getAll(KEYS.LEAVES).filter(l => l.userId === userId) : getAll(KEYS.LEAVES);
        return {
            total: leaves.length,
            pending: leaves.filter(l => l.status === 'pending').length,
            approved: leaves.filter(l => l.status === 'approved').length,
            rejected: leaves.filter(l => l.status === 'rejected').length
        };
    }
};

// Settings operations
export const settingsStorage = {
    get: () => {
        const data = localStorage.getItem(KEYS.SETTINGS);
        return data ? JSON.parse(data) : SEED_DATA.settings;
    },
    update: (updates) => {
        const current = settingsStorage.get();
        const updated = { ...current, ...updates };
        localStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated));
        return updated;
    }
};

// Reset all data
export function resetStorage() {
    Object.values(KEYS).forEach(key => localStorage.removeItem(key));
    initializeStorage();
}
