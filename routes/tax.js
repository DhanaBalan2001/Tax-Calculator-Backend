import { Router } from 'express';
const router = Router();
import { getAllTaxes, createTax, getTaxById, deleteTax } from '../controllers/tax.js';
import { taxValidationRules } from '../middleware/validators.js';

// GET all tax calculations
router.get('/', getAllTaxes);

// POST create a new tax calculation
router.post('/', taxValidationRules, createTax);

// GET a single tax calculation
router.get('/:id', getTaxById);

// DELETE a tax calculation
router.delete('/:id', deleteTax);

export default router;
