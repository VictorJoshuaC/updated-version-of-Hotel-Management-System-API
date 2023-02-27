import mongoose from "mongoose";
import Joi, { ObjectSchema } from "joi";
import { Request, Response, NextFunction } from "express";

interface IRequest extends Request {
  user?: any;
}

// Define the validation schema
const schema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const validateData = (schema: ObjectSchema) => {
  return (req: IRequest, res: Response, next: NextFunction) => {
    const data = req.body;
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).send({ errors });
    }
    next();
  };
};

// Validation middleware for room type
const roomTypeJoiSchema = Joi.object({
  name: Joi.string().required(),
});

const validateRoomType = (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const { error } = roomTypeJoiSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  next();
};

//pending
const roomSchemaJoi = Joi.object({
  name: Joi.string().required(),
  roomType: Joi.string().required(),
  price: Joi.number().required(),
});
// const validate = (schema) => {
//   return (req, res, next) => {
//     const { error } = schema.validate(req.body);
//     if (error) return res.status(400).send(error.details[0].message);
//     next();
//   };
// };

export {
  schema,
  validateData,
  validateRoomType,
  roomSchemaJoi,
  roomTypeJoiSchema,
};
