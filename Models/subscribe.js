// POST /api/subscribe
app.post('/api/subscribe', async (req, res) => {
  const { email, location, categories } = req.body;
  if (!email || !location || !Array.isArray(categories)) {
    return res.status(400).json({ error: 'Email, location, and categories array required' });
  }
  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, subscriptions: [{ location, categories }] });
    } else {
      const idx = user.subscriptions.findIndex(s => s.location === location);
      if (idx >= 0) user.subscriptions[idx].categories = categories;
      else user.subscriptions.push({ location, categories });
    }
    await user.save();
    res.json({ message: `Subscribed ${email} to ${location} categories: ${categories.join(', ')}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
