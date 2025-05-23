import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { UserModel, IUser } from '../models/UserModel';
import jwt from 'jsonwebtoken';
import { AppEnv } from "./env.config";
import bcrypt from 'bcryptjs';

passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: AppEnv.JWT_SECRET,
      },
      (payload, done) => {
        UserModel.findById(payload.id, (err: any, user:any) => {
          if (err) return done(err, false);
          if (!user) return done(null, false);
          return done(null, user);
        });
      }
    )
  );
  
  export const generateJWT = (user: IUser) => {
    const payload = { id: user.id, username: user.username, email: user.email, isAdmin: user.isAdmin };
    return jwt.sign(payload, AppEnv.JWT_SECRET);
  };
  
  export const localAuthenticate = async (username: string, password: string): Promise<IUser | null> => {
    const user = await UserModel.findOne({ username });
    if (!user) return null;
  
    const match = await bcrypt.compare(password, user.password);;
    if (!match) return null;
  
    return user;
  };