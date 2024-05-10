const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    permissions: {
      type: Map,
      of: Boolean
    }
});

module.exports = mongoose.model('Theme', themeSchema);
