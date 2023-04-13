import { createValidator } from 'express-joi-validation';
import Joi from 'joi';

export const validator = createValidator({ passError: true });