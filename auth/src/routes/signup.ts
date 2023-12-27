import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import User from "../models/user";
import { BadRequestError, validateRequest } from "@amritorg/common";
const router = express.Router();

router.post(
  "/api/users/signup",
  body("email").isEmail().withMessage("Email must be valid"),
  body("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("password must be 4 to 20 chars long"),
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("email already exists", "email");
    }

    const user = User.build({ email, password });
    await user.save();
    // Generate JWT

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET!
    );

    req.session = {
      jwt: token,
    };

    res.status(201).json(user);
  }
);

export { router as signUpRouter };
