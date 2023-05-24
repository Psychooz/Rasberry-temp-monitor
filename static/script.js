let temperatureChart;

function createTemperatureChart() {
    const ctx = document.getElementById('temperature-chart').getContext('2d');
    temperatureChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Temperature',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: 'start'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'minute'
                    },
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Temperature (°C)'
                    }
                }
            }
        }
    });
}

function updateTemperatureChart(time, temperature) {
    temperatureChart.data.labels.push(time);
    temperatureChart.data.datasets[0].data.push(temperature);
    temperatureChart.update();
}

function fetchTemperature() {
    fetch('/temperature')
        .then(response => response.json())
        .then(data => {
            const temperatureElement = document.getElementById('temperature');
            const formattedTemperature = data.temperature.toFixed(2);
            temperatureElement.innerText = `${formattedTemperature} °C`;
            const weatherImageElement = document.getElementById('weather-image');
            weatherImageElement.src = getWeatherImage(data.temperature);
            updateTemperatureChart(new Date(), data.temperature);
            console.log('Sensor Temp:', data.temperature);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function getCurrentDateTime() {
    const now = new Date();
    const options = { timeZone: 'Africa/Casablanca' };
    const formattedDateTime = now.toLocaleString('en-US', options);
    const datetimeElement = document.getElementById('datetime');
    datetimeElement.innerText = formattedDateTime;
}

function getWeatherImage(temperature) {
    let imageName = 'hot.png';

    if (temperature < 10) {
        imageName = 'cold.png';
    } else if (temperature < 20) {
        imageName = 'cool.png';
    } else {
        imageName = 'hot.png';
    }

    return `static/${imageName}`;
}

fetchTemperature();
setInterval(fetchTemperature, 5000);
getCurrentDateTime();
setInterval(getCurrentDateTime, 1000);
