const Content = require('../models/Content');
const multer = require('multer');

exports.getContents = async (req, res) => {
    const { q } = req.query;
    try {
        let contentsByType;
        if (q) {
            // Si q tiene algún valor, agregar una condición para filtrar los contenidos según esos datos
            contentsByType = await Content.aggregate([
                {
                    $match: {
                        $or: [
                            { title: { $regex: q, $options: 'i' } },
                            { description: { $regex: q, $options: 'i' } }
                        ]
                    }
                },
                {
                    $group: {
                        _id: '$theme',
                        contents: { $push: '$$ROOT' } // Agrupa los documentos del mismo tipo en un array
                    }
                }
            ]);
        } else {
            // Si q está vacío, obtener todos los contenidos sin filtrar
            contentsByType = await Content.aggregate([
                {
                    $group: {
                        _id: '$theme',
                        contents: { $push: '$$ROOT' } // Agrupa los documentos del mismo tipo en un array
                    }
                }
            ]);
        }

        // Organiza los resultados en un objeto por tipo
        const groupedContents = {};
        contentsByType.forEach(group => {
            groupedContents[group._id] = group.contents;
        });

        res.json(groupedContents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getContentsByTheme = async (req, res) => {
    const { q } = req.query;
    try {
        let contentsByType;
        if (q) {
            contentsByType = await Content.aggregate([
                {
                    $match: {
                        theme: { $regex: q, $options: 'i' }
                    }
                },
                {
                    $group: {
                        _id: '$theme',
                        contents: { $push: '$$ROOT' }
                    }
                }
            ]);
        } else {
            contentsByType = await Content.aggregate([
                {
                    $group: {
                        _id: '$theme',
                        contents: { $push: '$$ROOT' }
                    }
                }
            ]);
        }
        const groupedContents = {};
        contentsByType.forEach(group => {
            groupedContents[group._id] = group.contents;
        });

        res.json(groupedContents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getContentsByRole = async (req, res) => {
    const { q } = req.query;
    try {
        const contentsByType = await Content.aggregate([
            {
                $group: {
                    _id: '$theme',
                    contents: { $push: '$$ROOT' } 
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ]);

        const groupedContents = {};
        contentsByType.forEach(group => {
            q === 'prospect' ?
                groupedContents[group._id] = group.contents.map(content => ({
                  title: content.title,
                  description: content.description,
                  username: content.username,
                  createdAt: content.createdAt
                }))
            :
                groupedContents[group._id] = group.contents;
            
        });

        res.json(groupedContents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



const storage = multer.memoryStorage()
const upload = multer({storage:storage});

exports.createContents = async (req, res) => {
    try {
        upload.single('file')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                console.log(err);
                return res.status(500).json({ success: false, message: "Multer error" });
            } else if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: "Unknown error" });
            }

            const { type, title, description, url, theme, username } = req.body;

            let newContent;
            if (req.file) {
                newContent = await Content.create({ type, title, description, url, file: { data: req.file.buffer, contentType: req.file.mimetype }, theme, username });
            } else {
                newContent = await Content.create({ type, title, description, url, theme, username });
            }

            return res.status(200).json(newContent);
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.updateContent = async (req, res) => {
    const { id } = req.params;
    const { type,title,description,url,file } = req.body;
    try {
        const updatedContent = await Content.findByIdAndUpdate(id, { type,title,description,url,file }, { new: true });
        if (!updatedContent) {
            return res.status(404).json({ message: 'Content not found' });
        }
        res.json(updatedContent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteContent = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedContent = await Content.findByIdAndDelete(id);
        if (!deletedContent) {
            return res.status(404).json({ message: 'Content not found' });
        }
        res.json({ message: 'Content deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};