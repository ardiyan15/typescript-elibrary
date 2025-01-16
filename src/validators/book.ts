import { body } from 'express-validator';

export const bookValidator = [
    body('title').notEmpty().withMessage('Title is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('image').notEmpty().withMessage('Image is required'),
    body('description').notEmpty().withMessage('Description is required')
]

export const bookUpdateValidator = [
    body('title').notEmpty().withMessage('Title is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('description').notEmpty().withMessage('Description is required')
]