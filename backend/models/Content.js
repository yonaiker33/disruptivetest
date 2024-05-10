const mongoose = require('mongoose');
const Category = require('./Category');
const Theme = require('./Theme');

const contentSchema = new mongoose.Schema({
  type: { type: mongoose.Schema.Types.String, ref: 'Category', localField: 'type', foreignField: 'name' }, 
  title: { type: String, required: true }, // Título del contenido
  description: String, // Descripción opcional del contenido
  url: String, // URL del contenido (por ejemplo, para videos de YouTube)
  file: { data: Buffer, contentType: String }, // Datos binarios del archivo (para imágenes y documentos)
  theme: { type: mongoose.Schema.Types.String, ref: 'Theme', localField: 'theme', foreignField: 'name' }, 
  username: { type: String, ref: 'User', localField: 'username', foreignField: 'username' },
  createdAt: { type: Date, default: Date.now },
});

contentSchema.pre('save', async function (next) {
  try {
    const category = await Category.findOne({ name: this.type });
    if (!category) {
    throw new Error('Categoría no encontrada');
    }

    const theme = await Theme.findOne({ name: this.theme });
    if (!theme) {
    throw new Error('Tema no encontrado');
    }
    next();
  } catch (error) {
    next(error);
  }
});
  

module.exports = mongoose.model('Content', contentSchema);
