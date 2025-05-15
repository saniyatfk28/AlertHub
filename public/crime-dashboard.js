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
    document.getElementById('crimeChart').innerHTML = "Error loading data.";
  }
}

loadData();

async function loadTopStats() {
  try {
    const res = await fetch('/api/stats/monthly-crime-stats');
    const data = await res.json();

    const topLocationsList = document.getElementById('topLocationsList');
    const topCrimesList = document.getElementById('topCrimesList');

    data.topLocations.forEach(item => {
      const listItem = document.createElement('li');
      listItem.textContent = `${item._id.location}: ${item.totalCrimes} crimes`;
      topLocationsList.appendChild(listItem);
    });

    data.topCrimes.forEach(item => {
      const listItem = document.createElement('li');
      listItem.textContent = `${item._id.crimeType}: ${item.totalCrimes} crimes`;
      topCrimesList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error loading top stats:", error);
    document.getElementById('topLocationsList').innerHTML = "Error loading data.";
    document.getElementById('topCrimesList').innerHTML = "Error loading data.";
  }
}

loadTopStats();
