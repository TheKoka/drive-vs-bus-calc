// Show/hide pass input based on checkbox
document.getElementById('has-pass').addEventListener('change', function () {
    const passGroup = document.getElementById('pass-group');
    passGroup.style.display = this.checked ? 'block' : 'none';
});

function calculate() {
    // Get inputs
    const distance = parseFloat(document.getElementById('distance').value);
    const mpg = parseFloat(document.getElementById('mpg').value);
    const gasPrice = parseFloat(document.getElementById('gas-price').value);
    const parking = parseFloat(document.getElementById('parking').value) || 0;
    const parkingPeriod = document.getElementById('parking-period').value;
    const tolls = parseFloat(document.getElementById('tolls').value) || 0;
    const schoolDays = parseInt(document.getElementById('school-days').value);
    const semesterWeeks = parseInt(document.getElementById('semester-weeks').value) || 16;

    const fare = parseFloat(document.getElementById('fare').value);
    const people = parseInt(document.getElementById('people').value) || 1;
    const transfers = parseInt(document.getElementById('transfers').value) || 0;
    const roundTripTransit = document.getElementById('round-trip-transit').checked;
    const hasPass = document.getElementById('has-pass').checked;
    const passCost = parseFloat(document.getElementById('pass-cost').value) || 0;
    const passPeriod = document.getElementById('pass-period').value;

    // Validate required inputs
    if (!distance || !mpg || !gasPrice || !fare || !semesterWeeks) {
        alert('Please fill in all required fields.');
        return;
    }

    // Calculate total school days in semester
    const totalSchoolDays = schoolDays * semesterWeeks;

    // Calculate parking cost per day
    let parkingPerDay = 0;
    if (parking > 0) {
        switch (parkingPeriod) {
            case 'daily':
                parkingPerDay = parking;
                break;
            case 'semester':
                parkingPerDay = parking / totalSchoolDays;
                break;
            case 'year':
                // Assume 2 semesters per year
                parkingPerDay = parking / (totalSchoolDays * 2);
                break;
        }
    }

    // Calculate driving costs per semester
    const gallonsPerTrip = distance / mpg;
    const fuelCostPerTrip = gallonsPerTrip * gasPrice;
    // Assume round trip for driving (to school and back)
    const fuelCostPerDay = fuelCostPerTrip * 2;
    const tollsPerDay = tolls * 2; // Round trip tolls
    const totalDriveCostPerDay = fuelCostPerDay + parkingPerDay + tollsPerDay;
    const totalDriveCostSemester = totalDriveCostPerDay * totalSchoolDays;

    // Calculate transit costs per semester
    let transitFarePerDay = fare * people;
    if (transfers > 0) {
        transitFarePerDay += (transfers * 0.5 * people);
    }
    if (roundTripTransit) {
        transitFarePerDay *= 2;
    }

    let totalTransitCostSemester;
    let passInfo = "Single rides";

    if (hasPass && passCost) {
        switch (passPeriod) {
            case 'month':
                // Assume 4.33 weeks per month
                const monthsInSemester = semesterWeeks / 4.33;
                totalTransitCostSemester = passCost * monthsInSemester * people;
                passInfo = "Monthly pass";
                break;
            case 'semester':
                totalTransitCostSemester = passCost * people;
                passInfo = "Semester pass";
                break;
            case 'year':
                // Assume 2 semesters per year
                totalTransitCostSemester = (passCost / 2) * people;
                passInfo = "Yearly pass";
                break;
        }
    } else {
        totalTransitCostSemester = transitFarePerDay * totalSchoolDays;
    }

    // Display results
    document.getElementById('fuel-cost').textContent = `${(fuelCostPerDay * totalSchoolDays).toFixed(2)}`;
    document.getElementById('parking-cost').textContent = `${(parkingPerDay * totalSchoolDays).toFixed(2)}`;
    document.getElementById('toll-cost').textContent = `${(tollsPerDay * totalSchoolDays).toFixed(2)}`;
    document.getElementById('total-days').textContent = `${totalSchoolDays} days`;
    document.getElementById('drive-cost').textContent = `${totalDriveCostSemester.toFixed(2)}`;

    document.getElementById('daily-fare').textContent = `${transitFarePerDay.toFixed(2)}`;
    document.getElementById('people-count').textContent = people;
    document.getElementById('transit-days').textContent = `${totalSchoolDays} days`;
    document.getElementById('pass-info').textContent = passInfo;
    document.getElementById('transit-cost').textContent = `${totalTransitCostSemester.toFixed(2)}`;

    // Determine winner
    const driveCard = document.getElementById('drive-card');
    const transitCard = document.getElementById('transit-card');
    const savingsDiv = document.getElementById('savings');
    const savingsAmount = document.getElementById('savings-amount');
    const recommendation = document.getElementById('recommendation');

    driveCard.classList.remove('winner');
    transitCard.classList.remove('winner');

    const savings = Math.abs(totalDriveCostSemester - totalTransitCostSemester);
    savingsAmount.textContent = `${savings.toFixed(2)}`;

    if (totalDriveCostSemester < totalTransitCostSemester) {
        driveCard.classList.add('winner');
        recommendation.textContent = `Driving is cheaper! You'll save ${savings.toFixed(2)} per semester compared to public transit.`;
    } else if (totalTransitCostSemester < totalDriveCostSemester) {
        transitCard.classList.add('winner');
        recommendation.textContent = `Public transit is cheaper! You'll save ${savings.toFixed(2)} per semester compared to driving.`;
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