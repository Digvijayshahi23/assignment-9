const Visitor = require('../models/Visitor');

exports.registerVisitor = async (req, res) => {
  try {
    const { name, email, phone, company, address } = req.body;
    let visitor = await Visitor.findOne({ email });
    if (!visitor) {
      visitor = new Visitor({ name, email, phone, company, address });
      await visitor.save();
    } else {
      // Update existing visitor details
      visitor.name = name;
      visitor.phone = phone;
      visitor.company = company;
      visitor.address = address;
      await visitor.save();
    }
    res.status(201).json(visitor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find();
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
