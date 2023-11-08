import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";
import User from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";
const router = express.Router();

router.post(
  "/api/users/signup",
  body("email").isEmail().withMessage("Email must be valid"),
  body("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("password must be 4 to 20 chars long"),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("email already exists");
    }

    const user = User.build({ email, password });
    await user.save();

    res.status(201).json(user);
  }
);

export { router as signUpRouter };