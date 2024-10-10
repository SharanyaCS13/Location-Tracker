let map = L.map('map').setView([20.5937, 78.9629], 5); // Centered on India
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let marker = L.marker([20.5937, 78.9629]).addTo(map);

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(updatePosition, showError, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 50000
    });
} else {
    alert("Geolocation is not supported by this browser.");
}

function updatePosition(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    marker.setLatLng([lat, lng]);
    map.setView([lat, lng], 13);
    updateShareLink(lat, lng);
}

function updateShareLink(lat, lng) {
    const userId = 'uniqueUserId'; // Replace with a unique identifier for the user
    const link = `${window.location.href.split('?')[0]}?user=${userId}&lat=${lat}&lng=${lng}`;
    const shareLinkElement = document.getElementById('shareLink');
    shareLinkElement.innerHTML = `<a href="${link}" target="_blank">Track My Live Location</a> <button onclick="copyToClipboard('${link}')">Copy Link</button>`;
}

function copyToClipboard(link) {
    const tempInput = document.createElement('input');
    tempInput.value = link;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    alert('Link copied to clipboard! You can now share it via WhatsApp or any other platform.');
}

function shareLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            updateShareLink(lat, lng);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

// Function to fetch and display the live location based on the unique identifier
function fetchLiveLocation() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('user');
    const lat = urlParams.get('lat');
    const lng = urlParams.get('lng');

    if (userId && lat && lng) {
        marker.setLatLng([lat, lng]);
        map.setView([lat, lng], 13);
    } else {
        alert("Invalid location data.");
    }
}

// Call fetchLiveLocation if the URL contains location data
if (window.location.search) {
    fetchLiveLocation();
}

