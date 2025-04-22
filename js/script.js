document.addEventListener('DOMContentLoaded', function() {
    // Language translations
    const translations = {
        da: {
            arrival: "Ankomst",
            departure: "Afgang",
            date: "Dato",
            boatLength: "Bådlængde",
            boatWidth: "Bådbredde",
            selectLength: "Vælg længde",
            under8m: "Under 8 meter",
            between8and12m: "8-12 meter",
            over12m: "Over 12 meter",
            selectWidth: "Vælg bredde",
            under3m: "Under 3 meter",
            between3and4m: "3-4 meter",
            over4m: "Over 4 meter",
            checkAvailability: "Tjek tilgængelighed",
            openingHours: "Åbningstider i dag"
        },
        en: {
            arrival: "Arrival",
            departure: "Departure",
            date: "Date",
            boatLength: "Boat Length",
            boatWidth: "Boat Width",
            selectLength: "Select length",
            under8m: "Under 8 meters",
            between8and12m: "8-12 meters",
            over12m: "Over 12 meters",
            selectWidth: "Select width",
            under3m: "Under 3 meters",
            between3and4m: "3-4 meters",
            over4m: "Over 4 meters",
            checkAvailability: "Check Availability",
            openingHours: "Opening hours today"
        }
    };
    
    // Set default dates (current date and next day)
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    // Format dates as YYYY-MM-DD for input fields
    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };
    
    // Set default values for date inputs
    document.getElementById('arrival-date').value = formatDate(today);
    document.getElementById('departure-date').value = formatDate(tomorrow);
    
    // Handle language selection
    const languageButtons = document.querySelectorAll('.lang-btn');
    
    languageButtons.forEach(button => {
        button.addEventListener('click', function() {
            const language = this.getAttribute('data-lang');
            
            // Update active class
            languageButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update HTML lang attribute
            document.documentElement.lang = language;
            
            // Update all text elements
            updateLanguage(language);
        });
    });
    
    function updateLanguage(language) {
        // Update booking panel text
        document.querySelector('.tab:nth-child(1) .tab-header').textContent = translations[language].arrival;
        document.querySelector('.tab:nth-child(1) label').textContent = translations[language].date;
        document.querySelector('.tab:nth-child(2) .tab-header').textContent = translations[language].departure;
        document.querySelector('.tab:nth-child(2) label').textContent = translations[language].date;
        
        // Update boat details
        document.querySelector('label[for="boat-length"]').textContent = translations[language].boatLength;
        document.querySelector('label[for="boat-width"]').textContent = translations[language].boatWidth;
        
        // Update select options
        const boatLengthOptions = document.querySelectorAll('#boat-length option');
        boatLengthOptions[0].textContent = translations[language].selectLength;
        boatLengthOptions[1].textContent = translations[language].under8m;
        boatLengthOptions[2].textContent = translations[language].between8and12m;
        boatLengthOptions[3].textContent = translations[language].over12m;
        
        const boatWidthOptions = document.querySelectorAll('#boat-width option');
        boatWidthOptions[0].textContent = translations[language].selectWidth;
        boatWidthOptions[1].textContent = translations[language].under3m;
        boatWidthOptions[2].textContent = translations[language].between3and4m;
        boatWidthOptions[3].textContent = translations[language].over4m;
        
        // Update button
        document.querySelector('.check-availability-btn').textContent = translations[language].checkAvailability;
        
        // Update popup
        document.querySelector('.popup-hours h4').textContent = translations[language].openingHours;
    }
    
    // Handle popup open/close
    function setupPopups() {
        // Close popup when clicking the close button
        document.querySelectorAll('.close-popup').forEach(button => {
            button.addEventListener('click', function() {
                document.getElementById('popup-template').classList.add('hidden');
            });
        });
        
        // Close popup when clicking outside of it
        document.getElementById('popup-template').addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.add('hidden');
            }
        });
    }
    
    // Initialize popup functionality
    setupPopups();
    
    // Form validation and submission
    document.querySelector('.check-availability-btn').addEventListener('click', function() {
        const arrivalDate = document.getElementById('arrival-date').value;
        const departureDate = document.getElementById('departure-date').value;
        const boatLength = document.getElementById('boat-length').value;
        const boatWidth = document.getElementById('boat-width').value;
        
        // Simple validation
        if (!arrivalDate || !departureDate) {
            alert('Please select both arrival and departure dates');
            return;
        }
        
        if (!boatLength || !boatWidth) {
            alert('Please select both boat length and width');
            return;
        }
        
        // You would typically send this data to a server
        // For now, we'll just show a confirmation
        alert('Checking availability for the selected dates and boat size...');
        
        // This would be where you'd send the data to the server and handle the response
    });
});