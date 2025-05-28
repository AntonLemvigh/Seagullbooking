document.addEventListener('DOMContentLoaded', function() {
    // Hide loading overlay after page loads
    setTimeout(() => {
        const loadingOverlay = document.getElementById('page-loading');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
            setTimeout(() => loadingOverlay.remove(), 300);
        }
    }, 500);

    // Language translations for booking page
    const translations = {
        da: {
            backToMap: "Tilbage til kort",
            confirmReservation: "Bekræft din reservation",
            selectedDetails: "Valgte detaljer",
            boatSpot: "Båd spot",
            period: "Periode",
            boat: "Båd",
            availableForPeriod: "Tilgængelig for valgte periode",
            unavailableForPeriod: "Ikke tilgængelig for valgte periode",
            contactInfo: "Kontaktoplysninger",
            firstName: "Fornavn",
            lastName: "Efternavn",
            email: "Email",
            phone: "Telefon",
            boatName: "Bådnavn",
            specialRequests: "Særlige ønsker",
            specialRequestsPlaceholder: "F.eks. strøm, vand, særlige behov...",
            priceOverview: "Pris oversigt",
            berth: "Ligeplads",
            night: "nat",
            nights: "nætter",
            electricity: "Strøm",
            water: "Vand",
            serviceFee: "Service gebyr",
            total: "Total",
            paymentMethod: "Betalingsmetode",
            mobilePay: "MobilePay",
            creditCard: "Kreditkort",
            bankTransfer: "Bankoverførsel",
            acceptTerms: "Jeg accepterer",
            termsConditions: "handelsbetingelserne",
            confirmReservationBtn: "Bekræft reservation",
            securePayment: "Sikker betaling - dine data er beskyttet",
            requiredField: "Dette felt er påkrævet",
            invalidEmail: "Ugyldig email adresse",
            reservationConfirmed: "Reservation bekræftet!",
            thankYou: "Tak for din booking. Du vil modtage en bekræftelse på email inden for få minutter.",
            bookingReference: "Booking reference",
            nextSteps: "Næste skridt",
            checkEmail: "Tjek din email for booking bekræftelse",
            arriveOnTime: "Mød op på havnen på ankomstdagen", 
            callHarbor: "Ring til havnefogeden på +45 12 34 56 78 hvis du har spørgsmål",
            backToMap: "Tilbage til kort",
            printConfirmation: "Print bekræftelse"
        },
        en: {
            backToMap: "Back to map",
            confirmReservation: "Confirm your reservation",
            selectedDetails: "Selected details",
            boatSpot: "Boat spot",
            period: "Period",
            boat: "Boat",
            availableForPeriod: "Available for selected period",
            unavailableForPeriod: "Not available for selected period",
            contactInfo: "Contact information",
            firstName: "First name",
            lastName: "Last name",
            email: "Email",
            phone: "Phone",
            boatName: "Boat name",
            specialRequests: "Special requests",
            specialRequestsPlaceholder: "E.g. electricity, water, special needs...",
            priceOverview: "Price overview",
            berth: "Berth",
            night: "night",
            nights: "nights",
            electricity: "Electricity",
            water: "Water",
            serviceFee: "Service fee",
            total: "Total",
            paymentMethod: "Payment method",
            mobilePay: "MobilePay",
            creditCard: "Credit card",
            bankTransfer: "Bank transfer",
            acceptTerms: "I accept the",
            termsConditions: "terms and conditions",
            confirmReservationBtn: "Confirm reservation",
            securePayment: "Secure payment - your data is protected",
            requiredField: "This field is required",
            invalidEmail: "Invalid email address",
            reservationConfirmed: "Reservation confirmed!",
            thankYou: "Thank you for your booking. You will receive a confirmation email within a few minutes.",
            bookingReference: "Booking reference",
            nextSteps: "Next steps",
            checkEmail: "Check your email for booking confirmation",
            arriveOnTime: "Arrive at the harbor on your arrival date",
            callHarbor: "Call the harbor master at +45 12 34 56 78 if you have questions",
            backToMap: "Back to map", 
            printConfirmation: "Print confirmation"
        }
    };

    // Get booking data from URL parameters or localStorage
    function getBookingData() {
        const urlParams = new URLSearchParams(window.location.search);
        const bookingData = {
            spot: urlParams.get('spot') || localStorage.getItem('selectedSpot') || 'Dock 3',
            arrivalDate: urlParams.get('arrival') || localStorage.getItem('arrivalDate') || new Date().toISOString().split('T')[0],
            departureDate: urlParams.get('departure') || localStorage.getItem('departureDate') || new Date(Date.now() + 86400000).toISOString().split('T')[0],
            boatLength: urlParams.get('length') || localStorage.getItem('boatLength') || '8-12 meter',
            boatWidth: urlParams.get('width') || localStorage.getItem('boatWidth') || '3-4 meter bred'
        };
        return bookingData;
    }

    // Calculate number of nights and total price
    function calculateBooking(arrivalDate, departureDate) {
        const arrival = new Date(arrivalDate);
        const departure = new Date(departureDate);
        const nights = Math.ceil((departure - arrival) / (1000 * 60 * 60 * 24));
        
        const basePrice = 350; // DKK per night
        const electricityPrice = 50;
        const waterPrice = 25;
        const serviceFee = 25;
        
        const subtotal = (basePrice * nights) + electricityPrice + waterPrice;
        const total = subtotal + serviceFee;
        
        return {
            nights,
            basePrice,
            electricityPrice,
            waterPrice,
            serviceFee,
            subtotal,
            total
        };
    }

    // Format date for display
    function formatDateForDisplay(dateString, language = 'da') {
        const date = new Date(dateString);
        const options = { 
            day: 'numeric', 
            month: 'long',
            year: 'numeric'
        };
        
        if (language === 'da') {
            return date.toLocaleDateString('da-DK', options);
        } else {
            return date.toLocaleDateString('en-US', options);
        }
    }

    // Get boat size display text
    function getBoatSizeDisplay(boatLength, boatWidth, language = 'da') {
        const lengthMap = {
            da: {
                'small': 'Under 8 meter',
                'medium': '8-12 meter', 
                'large': 'Over 12 meter'
            },
            en: {
                'small': 'Under 8 meters',
                'medium': '8-12 meters',
                'large': 'Over 12 meters'
            }
        };
        
        const widthMap = {
            da: {
                'narrow': 'Under 3 meter bred',
                'medium': '3-4 meter bred',
                'wide': 'Over 4 meter bred'
            },
            en: {
                'narrow': 'Under 3 meters wide',
                'medium': '3-4 meters wide', 
                'wide': 'Over 4 meters wide'
            }
        };
        
        const lengthText = lengthMap[language][boatLength] || boatLength;
        const widthText = widthMap[language][boatWidth] || boatWidth;
        
        return `${lengthText}, ${widthText}`;
    }

    // Update page content with booking data
    function updateBookingContent() {
        const bookingData = getBookingData();
        const calculation = calculateBooking(bookingData.arrivalDate, bookingData.departureDate);
        const currentLang = document.documentElement.lang || 'da';
        
        // Update selected details
        document.getElementById('selected-spot').textContent = bookingData.spot;
        
        const formattedArrival = formatDateForDisplay(bookingData.arrivalDate, currentLang);
        const formattedDeparture = formatDateForDisplay(bookingData.departureDate, currentLang);
        document.getElementById('selected-dates').textContent = `${formattedArrival} - ${formattedDeparture}`;
        
        const boatDisplay = getBoatSizeDisplay(bookingData.boatLength, bookingData.boatWidth, currentLang);
        document.getElementById('selected-boat').textContent = boatDisplay;
        
        // Update price breakdown
        const nightText = calculation.nights === 1 ? translations[currentLang].night : translations[currentLang].nights;
        document.querySelector('.price-item:first-child span:first-child').textContent = `${translations[currentLang].berth} (${calculation.nights} ${nightText})`;
        document.querySelector('.price-item:first-child span:last-child').textContent = `${calculation.basePrice * calculation.nights} DKK`;
        
        document.querySelector('.price-item:nth-child(2) span:last-child').textContent = `${calculation.electricityPrice} DKK`;
        document.querySelector('.price-item:nth-child(3) span:last-child').textContent = `${calculation.waterPrice} DKK`;
        document.querySelector('.price-item:nth-child(4) span:last-child').textContent = `${calculation.serviceFee} DKK`;
        document.querySelector('.price-total span:last-child strong').textContent = `${calculation.total} DKK`;
    }

    // Language switching functionality
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
        const t = translations[language];
        
        // Update static text
        document.querySelector('.back-btn span').textContent = t.backToMap;
        document.querySelector('.booking-details h1').textContent = t.confirmReservation;
        document.querySelector('.selection-summary h2').textContent = t.selectedDetails;
        
        // Update summary labels
        document.querySelector('.summary-item:nth-child(1) strong').textContent = t.boatSpot + ':';
        document.querySelector('.summary-item:nth-child(2) strong').textContent = t.period + ':';
        document.querySelector('.summary-item:nth-child(3) strong').textContent = t.boat + ':';
        
        // Update availability status
        const availabilityStatus = document.querySelector('.availability-status span');
        if (document.querySelector('.availability-status').classList.contains('available')) {
            availabilityStatus.textContent = t.availableForPeriod;
        } else {
            availabilityStatus.textContent = t.unavailableForPeriod;
        }
        
        // Update form labels
        document.querySelector('.contact-form h2').textContent = t.contactInfo;
        document.querySelector('label[for="first-name"]').textContent = t.firstName + ' *';
        document.querySelector('label[for="last-name"]').textContent = t.lastName + ' *';
        document.querySelector('label[for="email"]').textContent = t.email + ' *';
        document.querySelector('label[for="phone"]').textContent = t.phone + ' *';
        document.querySelector('label[for="boat-name"]').textContent = t.boatName;
        document.querySelector('label[for="special-requests"]').textContent = t.specialRequests;
        document.querySelector('#special-requests').placeholder = t.specialRequestsPlaceholder;
        
        // Update price section
        document.querySelector('.price-summary h2').textContent = t.priceOverview;
        document.querySelector('.price-item:nth-child(2) span:first-child').textContent = t.electricity;
        document.querySelector('.price-item:nth-child(3) span:first-child').textContent = t.water;
        document.querySelector('.price-item:nth-child(4) span:first-child').textContent = t.serviceFee;
        document.querySelector('.price-total span:first-child strong').textContent = t.total;
        
        // Update payment section
        document.querySelector('.payment-section h3').textContent = t.paymentMethod;
        document.querySelector('.payment-option:nth-child(1) .payment-content span').textContent = t.mobilePay;
        document.querySelector('.payment-option:nth-child(2) .payment-content span').textContent = t.creditCard;
        document.querySelector('.payment-option:nth-child(3) .payment-content span').textContent = t.bankTransfer;
        
        // Update terms and button
        const termsLabel = document.querySelector('.checkbox-label');
        termsLabel.innerHTML = `
            <input type="checkbox" id="accept-terms" required>
            <span>${t.acceptTerms} <a href="#" class="terms-link">${t.termsConditions}</a></span>
        `;
        
        document.querySelector('.book-now-btn').innerHTML = `
            <i class="fa-solid fa-lock"></i>
            ${t.confirmReservationBtn}
        `;
        
        document.querySelector('.security-notice span').textContent = t.securePayment;
        
        // Update modal text
        updateModalLanguage(language);
        
        // Update booking content with new language
        updateBookingContent();
    }

    function updateModalLanguage(language) {
        const t = translations[language];
        
        // Update modal header
        document.querySelector('.modal-header h2').textContent = t.reservationConfirmed;
        
        // Update modal body
        document.querySelector('.modal-body p').textContent = t.thankYou;
        document.querySelector('.booking-reference strong').textContent = t.bookingReference + ':';
        
        // Update next steps
        document.querySelector('.next-steps h3').textContent = t.nextSteps + ':';
        const stepsList = document.querySelectorAll('.next-steps li');
        stepsList[0].textContent = t.checkEmail;
        stepsList[1].textContent = t.arriveOnTime;
        stepsList[2].textContent = t.callHarbor;
        
        // Update modal buttons
        document.querySelector('.btn-secondary').textContent = t.backToMap;
        document.querySelector('.btn-primary').textContent = t.printConfirmation;
    }

    // Form validation
    function validateForm() {
        const requiredFields = ['first-name', 'last-name', 'email', 'phone'];
        const currentLang = document.documentElement.lang || 'da';
        let isValid = true;
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            const value = field.value.trim();
            
            // Remove previous error styling
            field.classList.remove('error');
            
            if (!value) {
                field.classList.add('error');
                isValid = false;
            } else if (fieldId === 'email' && !isValidEmail(value)) {
                field.classList.add('error');
                isValid = false;
            }
        });
        
        // Check terms acceptance
        const termsCheckbox = document.getElementById('accept-terms');
        if (!termsCheckbox.checked) {
            isValid = false;
            termsCheckbox.classList.add('error');
        } else {
            termsCheckbox.classList.remove('error');
        }
        
        return isValid;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Add error styling to CSS
    const style = document.createElement('style');
    style.textContent = `
        .form-group input.error,
        .form-group textarea.error {
            border-color: #dc3545;
            box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
        }
        
        .checkbox-label input.error {
            outline: 2px solid #dc3545;
        }
    `;
    document.head.appendChild(style);

    // Handle form submission
    document.getElementById('book-now-btn').addEventListener('click', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            const currentLang = document.documentElement.lang || 'da';
            alert(translations[currentLang].requiredField);
            return;
        }
        
        // Simulate booking process
        const btn = this;
        const originalText = btn.innerHTML;
        
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Behandler...';
        
        setTimeout(() => {
            // Generate booking reference
            const bookingRef = 'RH-' + new Date().getFullYear() + '-' + 
                               String(Math.floor(Math.random() * 999999)).padStart(6, '0');
            document.getElementById('booking-ref').textContent = bookingRef;
            
            // Show confirmation modal
            document.getElementById('confirmation-modal').classList.remove('hidden');
            
            btn.disabled = false;
            btn.innerHTML = originalText;
        }, 2000);
    });

    // Initialize page
    updateBookingContent();
    
    // Set up modal close functionality
    document.getElementById('confirmation-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.add('hidden');
        }
    });
    
    // Set up real-time validation
    document.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.classList.add('error');
            } else if (this.type === 'email' && this.value && !isValidEmail(this.value)) {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
            }
        });
        
        field.addEventListener('input', function() {
            if (this.classList.contains('error') && this.value.trim()) {
                if (this.type === 'email') {
                    if (isValidEmail(this.value)) {
                        this.classList.remove('error');
                    }
                } else {
                    this.classList.remove('error');
                }
            }
        });
    });
    
    // Terms checkbox validation
    document.getElementById('accept-terms').addEventListener('change', function() {
        if (this.checked) {
            this.classList.remove('error');
        }
    });
});
