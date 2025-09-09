// Show/hide pass input based on checkbox
document.getElementById('has-pass').addEventListener('change', function () {
    const passGroup = document.getElementById('pass-group');
    passGroup.style.display = this.checked ? 'block' : 'none';
});

function calculate() {
    // Get driving inputs
    const distance = parseFloat(document.getElementById('distance').value);
    const mpg = parseFloat(document.getElementById('mpg').value);
    const gasPrice = parseFloat(document.getElementById('gas-price').value);
    const parking = parseFloat(document.getElementById('parking').value) || 0;
    const tolls = parseFloat(document.getElementById('tolls').value) || 0;
    const roundTripDrive = document.getElementById('round-trip-drive').checked;

    // Get transit inputs
    const fare = parseFloat(document.getElementById('fare').value);
    const people = parseInt(document.getElementById('people').value) || 1;
    const transfers = parseInt(document.getElementById('transfers').value) || 0;
    const roundTripTransit = document.getElementById('round-trip-transit').checked;
    const hasPass = document.getElementById('has-pass').checked;
    const passCost = parseFloat(document.getElementById('pass-cost').value) || 0;
    const passDays = parseInt(document.getElementById('pass-days').value) || 30;

    // Validate required inputs
    if (!distance || !mpg || !gasPrice || !fare) {
        alert('Please fill in all required fields (distance, MPG, gas price, and fare).');
        return;
    }

    // Calculate driving costs
    const gallonsUsed = distance / mpg;
    const fuelCost = gallonsUsed * gasPrice;
    const tripMultiplier = roundTripDrive ? 2 : 1;
    const totalDriveCost = (fuelCost * tripMultiplier) + parking + tolls;

    // Calculate transit costs
    let baseFare = fare * people;
    if (transfers > 0) {
        baseFare += (transfers * 0.5 * people); // Assume $0.50 per transfer
    }

    let totalTransitCost;
    if (hasPass && passCost && passDays) {
        const dailyPassCost = passCost / passDays;
        totalTransitCost = dailyPassCost;
    } else {
        const transitMultiplier = roundTripTransit ? 2 : 1;
        totalTransitCost = baseFare * transitMultiplier;
    }

    // Display results
    document.getElementById('fuel-cost').textContent = `$${(fuelCost * tripMultiplier).toFixed(2)}`;
    document.getElementById('parking-cost').textContent = `$${parking.toFixed(2)}`;
    document.getElementById('toll-cost').textContent = `$${tolls.toFixed(2)}`;
    document.getElementById('drive-cost').textContent = `$${totalDriveCost.toFixed(2)}`;

    document.getElementById('base-fare').textContent = hasPass ? `$${(passCost / passDays).toFixed(2)}/day` : `$${baseFare.toFixed(2)}`;
    document.getElementById('people-count').textContent = people;
    document.getElementById('trip-type').textContent = roundTripTransit ? 'Round-trip' : 'One-way';
    document.getElementById('transit-cost').textContent = `$${totalTransitCost.toFixed(2)}`;

    // Determine winner
    const driveCard = document.getElementById('drive-card');
    const transitCard = document.getElementById('transit-card');
    const savingsDiv = document.getElementById('savings');
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
}

// Allow Enter key to calculate
document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        calculate();
    }
});