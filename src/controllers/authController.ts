import { Request, Response } from 'express';
import { UserModel } from '../models/UserModel';
import { localAuthenticate, generateJWT } from '../config/passport';


export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, email } = req.body;

    const existingUser = await UserModel.findOne({ username });
    const existingEmail = await UserModel.findOne({ email });

    if (existingUser) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }

    if (existingEmail) {
      res.status(400).json({ message: "Email already registered" });
      return;
    }

    const user = new UserModel({ username, password, email });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};


export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

  const user = await localAuthenticate(username, password);
  if (!user) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }
  const token = generateJWT(user);

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
