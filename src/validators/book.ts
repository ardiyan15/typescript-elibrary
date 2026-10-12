import { body, check } from 'express-validator';

export const bookValidator = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    check('book-image').custom((_, { req }) => {
        if (!req.file) throw new Error('Image is required');
        return true;
    }),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').notEmpty().withMessage('Price is required').bail().isFloat({ min: 0 }).withMessage('Price must be a valid non-negative number')
]

export const bookUpdateValidator = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').notEmpty().withMessage('Price is required').bail().isFloat({ min: 0 }).withMessage('Price must be a valid non-negative number')
]
