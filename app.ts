import express, { Express, Request, Response } from "express";
import bodyParser from 'body-parser';
import { verifyAdmin, verifyUser } from './Middlewares/AuthMiddleware';
import dotenv from "dotenv";
import {JwtPayload} from "jsonwebtoken";
import { signup , login , DetailsValidation} from "./controllers/authController";
import TrainRoutes from "./Routes/TrainRoutes";
import BookingRoutes from "./Routes/BookingRoutes";
dotenv.config();
declare global {
    namespace Express {
      interface Request {
        user?: string | JwtPayload;  // You can customize the type as needed
      }
    }
  }
const app: Express = express();
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

app.post('/signup' , DetailsValidation, signup);
app.post('/login',DetailsValidation, login);
app.use('/train', TrainRoutes);
app.use("/booking" , BookingRoutes);



app.post('/admin/add-train', verifyAdmin, (req:Request, res:Response) => {
    // Only admin can add trains
    res.json({ message: 'Train added successfully' });
  });
  
  // User route protected by JWT token
  app.post('/user/book-seat', verifyUser, (req : Request, res : Response) => {
    // Only authenticated users can book seats
    res.json({ message: `Seat booked successfully by user ${req.user}` });
  });

  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  })