document.addEventListener('DOMContentLoaded', function() {
    // Initialize the map centered on Rungsted Havn coordinates
    // Coordinates for Rungsted Havn, Denmark
    const rungstedCoordinates = [55.8862, 12.5483];
    
    // Create the map
    const map = L.map('map').setView(rungstedCoordinates, 16);
    
    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Define marker locations - these would typically come from a database
    const markerLocations = [
        { id: 1, name: "Provianten", lat: 55.8874, lng: 12.5472, 
          description: "På den stemningsfulde Rungsted Havn, hvor lystsejlere og andre gode mennesker mødes, ligger Proviant Rungsted Havn, som navnet fremgår, arbejder vi med proviantering.",
          hours: "11:00 - 17:00" },
        { id: 3, name: "Dock 3", lat: 55.8868, lng: 12.5478 },
        { id: 4, name: "Dock 4", lat: 55.8866, lng: 12.5476 },
        { id: 5, name: "Dock 5", lat: 55.8865, lng: 12.5474 },
        { id: 6, name: "Dock 6", lat: 55.8864, lng: 12.5471 }
    ];
    
    // Define path for green/red dots
    const harborEdgePath = [
        [55.8880, 12.5468], [55.8878, 12.5472], [55.8876, 12.5476], 
        [55.8874, 12.5480], [55.8872, 12.5484], [55.8870, 12.5488],
        [55.8868, 12.5492], [55.8866, 12.5488], [55.8864, 12.5484],
        [55.8862, 12.5480], [55.8860, 12.5476], [55.8858, 12.5472],
        [55.8856, 12.5468], [55.8854, 12.5464]
    ];
    
    // Function to create custom marker
    function createCustomMarker(id) {
        return L.divIcon({
            className: 'custom-marker',
            html: `<div class="marker-icon">${id}</div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });
    }
    
    // Add numbered markers to the map
    markerLocations.forEach(loc => {
        const marker = L.marker([loc.lat, loc.lng], {
            icon: createCustomMarker(loc.id)
        }).addTo(map);
        
        // Add click event to show information popup for facilities
        marker.on('click', function() {
            const popup = document.getElementById('popup-template');
            
            // Update popup content
            popup.querySelector('.popup-title').textContent = loc.name;
            popup.querySelector('.popup-description').textContent = loc.description || 'Information about this location.';
            popup.querySelector('.popup-hours p').textContent = loc.hours || 'Hours not available';
            
            // Show the popup
            popup.classList.remove('hidden');
        });
    });
    
    // Add alternating green and red dots along the harbor edge with dock selection
    harborEdgePath.forEach((coords, index) => {
        const dotClass = index % 2 === 0 ? 'green-dot' : 'red-dot';
        const dockNumber = index + 1;
        const dockName = `Plads ${dockNumber}`;  // More natural Danish naming
        
        const dotIcon = L.divIcon({
            className: dotClass,
            iconSize: [12, 12],
            iconAnchor: [6, 6]
        });
        
        const dotMarker = L.marker(coords, { icon: dotIcon }).addTo(map);
        
        // Add click event for dock selection
        dotMarker.on('click', function() {
            // Store selected dock
            localStorage.setItem('selectedSpot', dockName);
            
            // Visual feedback - remove previous selection and highlight selected dock
            document.querySelectorAll('.green-dot, .red-dot').forEach(dot => {
                dot.classList.remove('selected');
            });
            dotMarker.getElement().classList.add('selected');
            
            // Update booking panel if it exists (on main page)
            updateBookingPanelDock(dockName);
            
            // Show selection notification
            const currentLang = document.documentElement.lang || 'da';
            const message = currentLang === 'da' ? 
                `${dockName} valgt - klik "Tjek tilgængelighed" for at fortsætte` :
                `${dockName} selected - click "Check Availability" to continue`;
            
            showSpotSelection(dockName, message);
        });
    });
    
    // Function to update booking panel dock selection
    function updateBookingPanelDock(dockName) {
        // Update selected spot for booking page
        const selectedSpotElement = document.getElementById('selected-spot');
        if (selectedSpotElement) {
            selectedSpotElement.textContent = dockName;
        }
        
        // Update the dock indicator in the booking panel (main page)
        const dockContainer = document.querySelector('.selected-dock-container');
        const dockText = document.querySelector('.dock-text');
        
        if (dockContainer && dockText) {
            dockText.textContent = dockName;
            dockContainer.style.display = 'block';
        }
    }
    
    // Function to load previously selected dock on page load
    function loadSelectedDock() {
        const selectedSpot = localStorage.getItem('selectedSpot');
        if (selectedSpot && (selectedSpot.startsWith('Dock ') || selectedSpot.startsWith('Plads '))) {
            // Extract dock number from name (e.g., "Plads 5" -> 5 or "Dock 5" -> 5)
            const dockNumber = parseInt(selectedSpot.split(' ')[1]);
            if (dockNumber && dockNumber >= 1 && dockNumber <= harborEdgePath.length) {
                // Find the corresponding dot marker and mark it as selected
                const dotIndex = dockNumber - 1;
                const dotElements = document.querySelectorAll('.green-dot, .red-dot');
                if (dotElements[dotIndex]) {
                    dotElements[dotIndex].classList.add('selected');
                }
                
                // Update the booking panel
                updateBookingPanelDock(selectedSpot);
            }
        }
    }
    
    // Load previously selected dock after a short delay to ensure DOM is ready
    setTimeout(loadSelectedDock, 500);

    // Enable scroll zoom for better map interaction
    map.scrollWheelZoom.enable();
});