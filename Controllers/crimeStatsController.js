// Controllers/crimeStatsController.js
import Post from '../Models/postModel.js';

export const getCrimeStats = async (req, res) => {
  try {
    // 1st day of current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0,0,0,0);

    // Aggregate total crimes by location
    const stats = await Post.aggregate([
      { $match: { createdAt: { $gte: startOfMonth } } },
      { 
        $group: {
          _id: '$location',
          totalCrimes: { $sum: 1 }
        }
      },
      { $sort: { totalCrimes: -1 } }
    ]);

    // Calculate crime rates (population data should ideally be fetched from a database)
    const populations = {
      Downtown: 15000,
      Uptown:   20000,
      Midtown:  18000,
      Suburbs:  25000,
      Industrial:10000,
      Harbor:    8000
    };

    const crimeRates = stats.map(d => ({
      location: d._id,
      totalCrimes: d.totalCrimes,
      rate: d.totalCrimes / (populations[d._id] || 1) * 1000
    }));

    res.json(crimeRates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMonthlyCrimeStats = async (req, res) => {
  try {
    const monthlyStats = await Post.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            location: "$location",
            crimeType: "$crimeType"
          },
          totalCrimes: { $sum: 1 }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
          totalCrimes: -1
        }
      }
    ]);

    res.json(monthlyStats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
