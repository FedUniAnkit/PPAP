const { ContentBlock, User } = require('../models');

// @desc    Get all content blocks
// @route   GET /api/content
// @access  Public
const getAllContent = async (req, res) => {
  try {
    const contentBlocks = await ContentBlock.findAll({
      order: [['title', 'ASC']],
      include: {
        model: User,
        as: 'updatedBy',
        attributes: ['id', 'name'],
      },
    });
    res.status(200).json({ success: true, data: contentBlocks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get a single content block by its slug
// @route   GET /api/content/:slug
// @access  Public
const getContentByKey = async (req, res) => {
  try {
    const contentBlock = await ContentBlock.findOne({
      where: { slug: req.params.slug },
      include: {
        model: User,
        as: 'updatedBy',
        attributes: ['id', 'name'],
      },
    });
    if (!contentBlock) {
      return res.status(404).json({ success: false, message: 'Content block not found' });
    }
    res.status(200).json({ success: true, data: contentBlock });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new content block
// @route   POST /api/content
// @access  Private/Admin
const createContentBlock = async (req, res) => {
  try {
    const { slug, title, type, content } = req.body;
    const lastUpdatedBy = req.user.id;

    const newContentBlock = await ContentBlock.create({
      slug,
      title,
      type,
      content,
      lastUpdatedBy,
    });

    res.status(201).json({ success: true, data: newContentBlock });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ success: false, message: 'A content block with this key already exists.' });
    }
    res.status(500).json({ success: false, message: 'Failed to create content block.', error: error.message });
  }
};

// @desc    Update a content block by its ID
// @route   PUT /api/content/:id
// @access  Private/Admin
const updateContentBlock = async (req, res) => {
  try {
    let contentBlock = await ContentBlock.findByPk(req.params.id);
    if (!contentBlock) {
      return res.status(404).json({ success: false, message: 'Content block not found' });
    }

    const { title, type, content } = req.body;
    
    contentBlock.title = title || contentBlock.title;
    contentBlock.type = type || contentBlock.type;
    contentBlock.content = content || contentBlock.content;
    contentBlock.lastUpdatedBy = req.user.id;

    await contentBlock.save();

    const updatedBlock = await ContentBlock.findByPk(req.params.id, {
        include: {
            model: User,
            as: 'updatedBy',
            attributes: ['id', 'name'],
        },
    });

    res.status(200).json({ success: true, data: updatedBlock });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update content block.', error: error.message });
  }
};

// @desc    Delete a content block by its ID
// @route   DELETE /api/content/:id
// @access  Private/Admin
const deleteContentBlock = async (req, res) => {
  try {
    const contentBlock = await ContentBlock.findByPk(req.params.id);
    if (!contentBlock) {
      return res.status(404).json({ success: false, message: 'Content block not found' });
    }

    await contentBlock.destroy();

    res.status(200).json({ success: true, message: 'Content block deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete content block.', error: error.message });
  }
};


module.exports = {
  getAllContent,
  getContentByKey,
  createContentBlock,
  updateContentBlock,
  deleteContentBlock,
};
