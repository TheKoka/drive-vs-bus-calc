// Semester/year selection
const semesterRadio = document.getElementById('semester');
const yearRadio = document.getElementById('year');
const daysInput = document.getElementById('days');

semesterRadio.addEventListener('change', () => {
    if (semesterRadio.checked) daysInput.value = 75;
});

yearRadio.addEventListener('change', () => {
    if (yearRadio.checked) daysInput.value = 150;
});

// Parking type selection and label change
const dailyRadio = document.getElementById('daily-parking');
const passRadio = document.getElementById('parking-pass');
const parkingLabel = document.getElementById('parking-label');

dailyRadio.addEventListener('change', () => {
    parkingLabel.textContent = 'Daily Parking Cost ($)';
});

passRadio.addEventListener('change', () => {
    parkingLabel.textContent = 'Parking Pass Cost ($)';
});

// Transit payment type selection and label change
const perTripRadio = document.getElementById('per-trip');
const monthlyPassRadio = document.getElementById('monthly-pass');
const fareLabel = document.getElementById('fare-label');
const passDaysGroup = document.getElementById('pass-days-group');
const transitRoundTripGroup = document.getElementById('transit-round-trip-group');

perTripRadio.addEventListener('change', () => {
    fareLabel.textContent = 'Fare per trip ($)';
    passDaysGroup.style.display = 'none';
    transitRoundTripGroup.style.display = 'flex';
});

monthlyPassRadio.addEventListener('change', () => {
    fareLabel.textContent = 'Price of pass ($)';
    passDaysGroup.style.display = 'block';
    transitRoundTripGroup.style.display = 'none';
});

// Calculate function
function calculate() {
    try {
        // Get number of days
        const numDays = parseInt(document.getElementById('days').value) || 1;

        // Get driving inputs
        const distance = parseFloat(document.getElementById('distance').value);
        const mpg = parseFloat(document.getElementById('mpg').value);
        const gasPrice = parseFloat(document.getElementById('gas-price').value);
        const tolls = parseFloat(document.getElementById('tolls').value) || 0;
        const roundTripDrive = document.getElementById('round-trip-drive').checked;

        // Get transit inputs
        const fare = parseFloat(document.getElementById('fare').value);
        const roundTripTransit = document.getElementById('round-trip-transit').checked;
        const passDays = parseInt(document.getElementById('pass-days').value) || 30;

        // Validate required inputs
        if (!distance || !mpg || !gasPrice || !fare) {
            alert('Please fill in all required fields (distance, MPG, gas price, and fare).');
            return;
        }

        // Parking calculation
        const parkingInput = parseFloat(document.getElementById('parking-cost').value) || 0;
        let parkingCost = 0;
        if (dailyRadio.checked) {
            parkingCost = parkingInput * numDays;
        } else {
            parkingCost = parkingInput;
        }

        // Calculate driving costs
        const gallonsUsed = distance / mpg;
        const fuelCost = gallonsUsed * gasPrice;
        const tripMultiplier = roundTripDrive ? 2 : 1;
        const totalDriveCost = (fuelCost * tripMultiplier + tolls * tripMultiplier) * numDays + parkingCost;

        // Calculate transit costs
        let totalTransitCost;

        if (monthlyPassRadio.checked) {
            // Monthly pass: flat daily cost regardless of round trip
            const dailyPassCost = fare;
            totalTransitCost = dailyPassCost * Math.ceil(numDays / passDays);
        } else {
            // Per trip: round trip affects cost
            const transitMultiplier = roundTripTransit ? 2 : 1;
            totalTransitCost = fare * transitMultiplier * numDays;
        }
        document.getElementById('pass-info').innerHTML = `<small>*Total price is the price of pass x${Math.ceil(numDays / passDays)}</small>`;




        // Display results
        document.getElementById('fuel-cost').textContent = `${(fuelCost * tripMultiplier * numDays).toFixed(2)}`;
        document.getElementById('parking-result').textContent = `${parkingCost.toFixed(2)}`;
        document.getElementById('toll-cost').textContent = `${(tolls * tripMultiplier * numDays).toFixed(2)}`;
        document.getElementById('drive-cost').textContent = `${totalDriveCost.toFixed(2)} (for ${numDays} days)`;

        // Update transit display based on payment type
        if (monthlyPassRadio.checked) {
            document.getElementById('base-fare').textContent = `$${(fare / passDays).toFixed(2)}/day`;
            document.getElementById("pass-info").style.display = "block";

        } else {
            document.getElementById('base-fare').textContent = `$${fare.toFixed(2)}`;
            document.getElementById("pass-info").style.display = "none";

        }

        document.getElementById('trip-type').textContent = roundTripTransit ? 'Round-trip' : 'One-way';
        document.getElementById('transit-cost').textContent = `$${totalTransitCost.toFixed(2)} (for ${numDays} days)`;

        // Determine winner
        const driveCard = document.getElementById('drive-card');
        const transitCard = document.getElementById('transit-card');
        const savingsAmount = document.getElementById('savings-amount');
        const recommendation = document.getElementById('recommendation');

        driveCard.classList.remove('winner');
        transitCard.classList.remove('winner');

        const savings = Math.abs(totalDriveCost - totalTransitCost);
        savingsAmount.textContent = `$${savings.toFixed(2)}`;

        if (totalDriveCost < totalTransitCost) {
            driveCard.classList.add('winner');
            recommendation.textContent = `Driving is cheaper! You'll save $${savings.toFixed(2)} compared to public transit.`;
        } else if (totalTransitCost < totalDriveCost) {
            transitCard.classList.add('winner');
            recommendation.textContent = `Public transit is cheaper! You'll save $${savings.toFixed(2)} compared to driving.`;
        } else {
            recommendation.textContent = `Both options cost the same! Consider other factors like convenience and time.`;
            savingsAmount.textContent = '$0.00';
        }

        // Show results
        document.getElementById('results').classList.add('show');
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('Calculation error:', error);
        alert('There was an error with the calculation. Please check your inputs.');
    }
}

// Allow Enter key to calculate
document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        calculate();
    }
});