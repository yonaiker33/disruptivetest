const Theme = require('../models/Theme');

exports.getAllThemes = async (req, res) => {
    const { q } = req.query;
    try {
        let themes;
        if (q) {
            themes = await Theme.find({ name: { $regex: q, $options: 'i' } });
        } else {
            themes = await Theme.find();
        }
        res.json(themes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.createTheme = async (req, res) => {
    const { name, permissions } = req.body;
    try {
        const existingTheme = await Theme.findOne({ name: name });
        console.log(existingTheme)
        if (existingTheme) {
          return (res.status(201).json({ error: 'Theme already exists.' }));
        }
        const newTheme = await Theme.create({ name, permissions });
        res.status(201).json(newTheme);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateTheme = async (req, res) => {
    const { id } = req.params;
    const { name, permissions } = req.body;
    try {
        const updatedTheme = await Theme.findByIdAndUpdate(id, { name, permissions }, { new: true });
        if (!updatedTheme) {
            return res.status(404).json({ message: "Tema no encontrado" });
        }
        res.json(updatedTheme);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteTheme = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTheme = await Theme.findByIdAndDelete(id);
        if (!deletedTheme) {
            return res.status(404).json({ message: "Tema no encontrado" });
        }
        res.json({ message: "Tema eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
