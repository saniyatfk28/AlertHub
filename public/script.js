document.getElementById('sosForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const sosData = {
    name: document.getElementById('name').value,
    phone: document.getElementById('phone').value,
    location: document.getElementById('location').value,
    message: document.getElementById('message').value
  };

  try {
    const res = await fetch('http://localhost:5000/api/sos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sosData)
    });

    const result = await res.json();
    document.getElementById('status').innerText = result.message || 'SOS sent!';
  } catch (error) {
    document.getElementById('status').innerText = 'Error sending SOS';
  }
});
