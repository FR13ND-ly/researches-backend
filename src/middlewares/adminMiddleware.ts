import { Request, Response, NextFunction } from "express"
import { UserModel } from "../models/UserModel"
import jwt from "jsonwebtoken"

export const adminMiddleware = async (
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

    if (!user.isAdmin) {
      res.status(403).json({ message: "Access denied. Admins only." })
      return
    }

    next()
  } catch (error) {
    console.error("Admin middleware error:", error)
    res.status(500).json({ message: "Internal server error", error })
  }
}
