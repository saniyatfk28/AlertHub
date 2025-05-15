async function loadData() {
  try {
    const res = await fetch('/api/stats/crime-stats');
    const data = await res.json();

    // Render Pie Chart
    const ctx = document.getElementById('crimeChart').getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: data.map(d => d.location),
        datasets: [{
          label: 'Crimes',
          data: data.map(d => d.totalCrimes)
        }]
      },
      options: {
        responsive: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: ctx => {
                const i = ctx.dataIndex;
                const item = data[i];
                return `${item.location}: ${item.totalCrimes} crimes (${item.rate.toFixed(1)}/1k)`;
              }
            }
          }
        }
      }
    });
  } catch (error) {
    console.error("Error loading crime data:", error);
    document.getElementById('crimeChart').parentElement.innerHTML = "<p>Error loading crime data. Please try again later.</p>";
  }
}

async function loadTopStats() {
  try {
    const topLocationsList = document.getElementById('topLocationsList');
    const topCrimesList = document.getElementById('topCrimesList');

    topLocationsList.innerHTML = '<li>Loading...</li>';
    topCrimesList.innerHTML = '<li>Loading...</li>';

    const res = await fetch('/api/stats/top-crime-stats');
    const data = await res.json();

    topLocationsList.innerHTML = '';
    topCrimesList.innerHTML = '';

    if (data.topLocations && data.topLocations.length > 0) {
      data.topLocations.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item._id}: ${item.totalCrimes} crimes`;
        topLocationsList.appendChild(listItem);
      });
    } else {
      topLocationsList.innerHTML = '<li>No data available.</li>';
    }

    if (data.topCrimes && data.topCrimes.length > 0) {
      data.topCrimes.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item._id}: ${item.totalCrimes} crimes`;
        topCrimesList.appendChild(listItem);
      });
    } else {
      topCrimesList.innerHTML = '<li>No data available.</li>';
    }

  } catch (error) {
    console.error("Error loading top stats:", error);
    document.getElementById('topLocationsList').innerHTML = "<p>Error loading top locations. Please try again later.</p>";
    document.getElementById('topCrimesList').innerHTML = "<p>Error loading top crimes. Please try again later.</p>";
    console.error(error); // Log the error object for more details
  }
}

loadData();
loadTopStats();

const downloadPieChartBtn = document.getElementById('downloadPieChartBtn');
downloadPieChartBtn.addEventListener('click', () => {
    const crimeChartCanvas = document.getElementById('crimeChart');
    // Get the Chart.js instance from the canvas
    const crimeChart = Chart.getChart(crimeChartCanvas);
    if (crimeChart) {
        const url = crimeChart.toBase64Image();
        const a = document.createElement('a');
        a.href = url;
        a.download = 'crime-pie-chart.png';
        a.click();
    } else {
        console.error("Pie chart instance not found.");
    }
});
