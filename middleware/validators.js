import { body } from 'express-validator';

export const taxValidationRules = [
  body('fromDate')
    .notEmpty()
    .withMessage('From date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  
  body('toDate')
    .notEmpty()
    .withMessage('To date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  
  body('fromValue')
    .notEmpty()
    .withMessage('From value is required')
    .isFloat({ min: 1, max: 1000 })
    .withMessage('From value must be between 1 and 1000'),
  
    body('toValue')
    .notEmpty()
    .withMessage('To value is required')
    .isNumeric()
    .withMessage('To value must be a number')
    .custom((value, { req }) => {
      if (parseFloat(value) <= parseFloat(req.body.fromValue)) {
        throw new Error('To value must be greater than From value');
      }
      return true;
    }),
    
  body('taxType')
    .notEmpty()
    .withMessage('Tax type is required')
    .isIn(['CGST', 'SGST', 'IGST'])
    .withMessage('Invalid tax type'),
  
  body('taxRate')
    .notEmpty()
    .withMessage('Tax rate is required')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Tax rate must be between 0 and 100')
    .custom((value) => {
        // If you want to limit to 2 decimal places
        if (value !== parseFloat(value.toFixed(2))) {
          throw new Error('Tax rate can have at most 2 decimal places');
        }
        return true;
      }),
    
];
