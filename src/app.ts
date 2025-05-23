import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import passport from 'passport';
import session from 'express-session';
import { AppEnv } from './config/env.config';
import authRoutes from './routes/authRoutes'; 
import issueRoutes from './routes/issueRoutes'; 
import researchRoutes from './routes/researchRoutes'; 
import userRoutes from './routes/userRoutes';
import sectionRoutes from './routes/sectionRoutes';
import { authMiddleware } from './middlewares/authMiddleware';
import { adminMiddleware } from './middlewares/adminMiddleware';


require('./config/passport');
const app: Application = express();

app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));
app.use(cors({origin: '*'}));
app.use(session({
    secret: AppEnv.JWT_SECRET,
    resave: true,
    saveUninitialized: false,
}));

app.use(passport.session());
app.use(passport.initialize());

app.use('/auth', authRoutes);
app.use('/issues', issueRoutes);
app.use('/sections', authMiddleware, sectionRoutes);
app.use('/researches', researchRoutes);
app.use('/users', adminMiddleware, userRoutes);

export default app;