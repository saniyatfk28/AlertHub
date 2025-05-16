// POST api unsubscribe
app.post('/api/unsubscribe', async (req, res) => {
  const { email, location } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (location) {
      // Remove subscription for specified location
      user.subscriptions = user.subscriptions.filter(s => s.location !== location);
    } else {
      // Remove all subscriptions for full unsubscribe
      user.subscriptions = [];
    }
    await user.save();
    res.json({ message: location ? `Unsubscribed ${email} from ${location}` : `Unsubscribed ${email} from all locations` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
