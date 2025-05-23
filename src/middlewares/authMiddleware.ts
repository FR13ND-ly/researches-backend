import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { UserModel } from "../models/UserModel"

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      res.status(401).json({ message: "Authorization token is missing" })
      return
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string
    }

    const user = await UserModel.findById(decoded.id)
    if (!user) {
      res.status(404).json({ message: "User not found" })
      return
    }

    req.user = user

    next()
  } catch (error) {
    console.error("Authentication error:", error)
    res.status(401).json({ message: "Unauthorized", error })
  }
}
