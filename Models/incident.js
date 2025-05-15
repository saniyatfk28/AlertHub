import mongoose from 'mongoose';

const IncidentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true }
});

const Incident = mongoose.model('Incident', IncidentSchema);

const findIncidentsByLocation = async (location) => {
  if (!location) {
    return [];
  }
  // Updated regex to allow partial, case-insensitive match
  return await Incident.find({ location: new RegExp(location, 'i') }).sort({ date: -1 });
};

export {
  Incident,
  findIncidentsByLocation
};
