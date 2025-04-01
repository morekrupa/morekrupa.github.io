/* geolocation */
let map;
let marker;

function initMap(lat, lng) {
    if (!map) {
        map = L.map('map').setView([lat, lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
    } else {
        map.setView([lat, lng], 13);
    }

    if (marker) {
        marker.remove();
    }
    marker = L.marker([lat, lng]).addTo(map);
}

function getLocation() {
    if (navigator.geolocation) {
        document.getElementById('location-details').innerHTML = '<span style="color: white;">Fetching your location...</span>';
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

async function showPosition(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    
    // Initialize/update map
    initMap(lat, lng);

    // Reverse geocoding to get address
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        
        // Display location details
        document.getElementById('location-details').innerHTML = `
        <span style="color: white;">
            <strong>Your Location:</strong><br>
            📍 ${data.display_name}<br>
            📐 Latitude: ${lat.toFixed(6)}<br>
            📏 Longitude: ${lng.toFixed(6)}<br>
            🎯 Accuracy: ${position.coords.accuracy.toFixed(2)} meters
        </span>
        `;
    } catch (error) {
        console.error('Error fetching address:', error);
        document.getElementById('location-details').innerHTML = `
            <strong>Your Location:</strong><br>
            📐 Latitude: ${lat.toFixed(6)}<br>
            📏 Longitude: ${lng.toFixed(6)}
        `;
    }
}

function showError(error) {
    let message;
    switch(error.code) {
        case error.PERMISSION_DENIED:
            message = "Please allow location access to use this feature.";
            break;
        case error.POSITION_UNAVAILABLE:
            message = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            message = "Location request timed out.";
            break;
        default:
            message = "An unknown error occurred.";
    }
    document.getElementById('location-details').innerHTML = `
        <div style="color: #dc2626;">⚠️ ${message}</div>
    `;
}

// Initialize with a default location (can be removed if you want to wait for user input)
initMap(18.990201, 73.1250952);
