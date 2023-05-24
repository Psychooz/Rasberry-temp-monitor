document.addEventListener('DOMContentLoaded', function () {
    const updateInterval = 5000; // Update every 5 seconds

    function fetchData() {
        fetch('/temperature')
            .then(response => response.json())
            .then(data => {
                const chart = getChartInstance();
                const temperature = data.temperature;
                console.log('Temperature:', temperature);
                // Add new temperature data point
                chart.data.labels.push(chart.data.labels.length.toString());
                chart.data.datasets[0].data.push(data.temperature);

                // Limit the number of data points shown
                const maxDataPoints = 10;
                if (chart.data.labels.length > maxDataPoints) {
                    chart.data.labels.shift();
                    chart.data.datasets[0].data.shift();
                }

                // Update the chart
                chart.update();
            });
    }

    function getChartInstance() {
        const canvas = document.getElementById('chart');
        if (canvas.chartInstance) {
            return canvas.chartInstance;
        } else {
            const ctx = canvas.getContext('2d');
            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Temperature',
                        data: [],
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: 'origin'
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            display: true,
                            title: {
                                display: true,
                                text: 'Time'
                            }
                        },
                        y: {
                            display: true,
                            title: {
                                display: true,
                                text: 'Temperature'
                            },
                            suggestedMin: 0,
                            suggestedMax: 30
                        }
                    }
                }
            });
            canvas.chartInstance = chart;
            return chart;
        }
    }

    setInterval(fetchData, updateInterval);
});
