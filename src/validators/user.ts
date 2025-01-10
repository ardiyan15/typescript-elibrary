import { body } from 'express-validator';

export const userValidator = [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage("Email is not valid"),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('roles').notEmpty().withMessage('Roles is required')
]

export const userUpdateValidator = [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage("Email is not valid"),
    body('roles').notEmpty().withMessage('Roles is required')
]