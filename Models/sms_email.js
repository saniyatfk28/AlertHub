// Notification logic: Call this inside report submission route after saving report

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // Gmail address from .env
    pass: process.env.EMAIL_PASS   // Gmail app password from .env
  }
});

async function notifySubscribers(report) {
  try {
    // Find users subscribed to this report's location & category
    const usersToNotify = await User.find({
      subscriptions: {
        $elemMatch: {
          location: report.location,
          categories: report.category
        }
      }
    });

    if (!usersToNotify.length) return console.log('No subscribers to notify.');

    // Send emails to each subscribed user
    usersToNotify.forEach(user => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `Alert: New Incident in ${report.location} - ${report.category}`,
        text: `Title: ${report.title}\nDescription: ${report.description || 'N/A'}\nLocation: ${report.location}\nCategory: ${report.category}`
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if(err) return console.error(`Error sending to ${user.email}:`, err);
        console.log(`Email sent to ${user.email}: ${info.response}`);
      });
    });

  } catch (error) {
    console.error('Error notifying subscribers:', error);
  }
}

