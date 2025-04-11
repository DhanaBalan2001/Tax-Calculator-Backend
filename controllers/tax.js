import Tax from '../models/Tax.js';

export const getAllTaxes = async (req, res) => {
  try {
    const taxes = await Tax.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: taxes.length,
      data: taxes
    });
  } catch (error) {
    console.error('Error fetching taxes:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

export const createTax = async (req, res) => {
    try {
      const { fromDate, toDate, fromValue, toValue, taxType, taxRate } = req.body;
  
      // Convert string dates to Date objects
      const fromDateObj = new Date(fromDate);
      const toDateObj = new Date(toDate);
  
      // Check if dates are valid
      if (isNaN(fromDateObj.getTime()) || isNaN(toDateObj.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date format'
        });
      }
  
      // Check if fromDate is before toDate
      if (fromDateObj > toDateObj) {
        return res.status(400).json({
          success: false,
          message: 'From date must be before to date'
        });
      }
  
      // Check if fromValue is less than toValue
      if (fromValue >= toValue) {
        return res.status(400).json({
          success: false,
          message: 'From value must be less than to value'
        });
      }
  
      // Check if fromValue and toValue are valid numbers
      if (isNaN(fromValue) || isNaN(toValue)) {
        return res.status(400).json({
          success: false,
          message: 'Values must be valid numbers'
        });
      }
  
      // Check if tax rate is within range
      if (isNaN(taxRate) || taxRate < 0 || taxRate > 100) {
        return res.status(400).json({
          success: false,
          message: 'Tax rate must be a number between 0 and 100'
        });
      }
  
      // Check for overlapping value ranges on the same date range
      const overlappingTax = await Tax.findOne({
        fromDate: { $lte: toDateObj },
        toDate: { $gte: fromDateObj },
        $or: [
          { fromValue: { $lte: toValue, $gte: fromValue } },
          { toValue: { $gte: fromValue, $lte: toValue } },
          { $and: [{ fromValue: { $lte: fromValue } }, { toValue: { $gte: toValue } }] }
        ]
      });
  
      if (overlappingTax) {
        return res.status(400).json({
          success: false,
          message: 'Value range overlaps with existing records for the selected date range'
        });
      }
  
      // Calculate tax amount
      const taxAmount = ((toValue - fromValue) * taxRate) / 100;
  
      // Create new tax calculation
      const newTax = new Tax({
        fromDate: fromDateObj,
        toDate: toDateObj,
        fromValue,
        toValue,
        taxType,
        taxRate,
        taxAmount
      });
  
      // Save to database
      await newTax.save();
  
      res.status(201).json({
        success: true,
        data: newTax
      });
    } catch (error) {
      // Check for duplicate key error
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'This tax calculation already exists'
        });
      }
  
      console.error('Error creating tax calculation:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  };
  

export const getTaxById = async (req, res) => {
  try {
    const tax = await Tax.findById(req.params.id);
    
    if (!tax) {
      return res.status(404).json({
        success: false,
        message: 'Tax calculation not found'
      });
    }

    res.status(200).json({
      success: true,
      data: tax
    });
  } catch (error) {
    console.error('Error fetching tax calculation:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

export const deleteTax = async (req, res) => {
  try {
    const tax = await Tax.findById(req.params.id);
    
    if (!tax) {
      return res.status(404).json({
        success: false,
        message: 'Tax calculation not found'
      });
    }

    await Tax.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Tax calculation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting tax calculation:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
