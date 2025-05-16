// GET /api/reports?location=Downtown&category=Theft
app.get('/api/reports', async (req, res) => {
  const { location, category } = req.query;
  const filter = {};
  if (location) filter.location = location;
  if (category) filter.category = category;

  try {
    const reports = await Report.find(filter).sort({ createdAt: -1 }).limit(50);
    res.json({ reports });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
