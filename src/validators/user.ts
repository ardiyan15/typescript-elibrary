import { body } from 'express-validator';
import userRepository from '@repositories/userRepository';

export const userValidator = [
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .bail()
        .custom(async username => {
            const existingUser = await userRepository.findByUsername(username);
            if (existingUser) {
                throw new Error('Username is already taken');
            }
            return true;
        }),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage("Email is not valid"),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('roles').notEmpty().withMessage('Roles is required'),
    body('privileges').custom(value => {
        if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
            throw new Error('Select at least 1 privilege');
        }
        return true;
    })
]

export const userUpdateValidator = [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage("Email is not valid"),
    body('roles').notEmpty().withMessage('Roles is required'),
    body('privileges').custom(value => {
        if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
            throw new Error('Select at least 1 privilege');
        }
        return true;
    })
]
