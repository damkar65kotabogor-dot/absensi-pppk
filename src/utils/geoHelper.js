/**
 * Menghitung jarak antara dua koordinat GPS dalam satuan Meter.
 * Menggunakan Haversine Formula.
 * 
 * @param {number} lat1 - Latitude User
 * @param {number} lon1 - Longitude User
 * @param {number} lat2 - Latitude Kantor
 * @param {number} lon2 - Longitude Kantor
 * @returns {number} Jarak dalam meter
 */
export function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Radius Bumi dalam meter
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

/**
 * Validasi apakah user berada dalam radius kantor
 * 
 * @param {Object} userLocation - {lat: number, lon: number}
 * @param {Object} officeLocation - {lat: number, lon: number, radius: number}
 * @returns {Object} - {isValid: boolean, distance: number, message: string}
 */
export function validateGeofence(userLocation, officeLocation) {
    const distance = getDistanceFromLatLonInMeters(
        userLocation.lat,
        userLocation.lon,
        officeLocation.lat,
        officeLocation.lon
    );

    const isValid = distance <= officeLocation.radius;

    return {
        isValid,
        distance: Math.round(distance),
        message: isValid
            ? `Anda berada dalam area kantor (${Math.round(distance)}m dari pusat)`
            : `Anda terlalu jauh dari kantor (${Math.round(distance)}m, maksimal ${officeLocation.radius}m)`
    };
}

/**
 * Get current user location using browser Geolocation API
 * 
 * @returns {Promise<{lat: number, lon: number}>}
 */
export function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation tidak didukung oleh browser Anda'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                    accuracy: position.coords.accuracy
                });
            },
            (error) => {
                let message = 'Gagal mendapatkan lokasi';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        message = 'Akses lokasi ditolak. Mohon izinkan akses lokasi di browser Anda.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message = 'Informasi lokasi tidak tersedia.';
                        break;
                    case error.TIMEOUT:
                        message = 'Permintaan lokasi timeout.';
                        break;
                }
                reject(new Error(message));
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    });
}

/**
 * Mock location for testing (simulates being near office)
 * 
 * @param {Object} officeLocation - Office coordinates
 * @param {boolean} isNearby - Whether to return a nearby location
 * @returns {Object} Mock location
 */
export function getMockLocation(officeLocation, isNearby = true) {
    if (isNearby) {
        // Return a location within radius (add small random offset)
        const offsetLat = (Math.random() - 0.5) * 0.0003; // ~30m
        const offsetLon = (Math.random() - 0.5) * 0.0003;
        return {
            lat: officeLocation.lat + offsetLat,
            lon: officeLocation.lon + offsetLon,
            accuracy: 10,
            isMock: true
        };
    } else {
        // Return a location outside radius
        return {
            lat: officeLocation.lat + 0.01, // ~1km away
            lon: officeLocation.lon + 0.01,
            accuracy: 10,
            isMock: true
        };
    }
}
