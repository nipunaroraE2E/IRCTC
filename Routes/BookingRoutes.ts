
import { Router, Request, Response } from 'express';
const {body , validationResult} = require('express-validator');
import { createBooking, getBookingsByUserId, getBookingDetails } from '../Models/Booking';
import { verifyUser } from '../Middlewares/AuthMiddleware'; 
import { getTrainById } from '../Models/Train';
const router = Router();
export interface User {
    id: number;
    email: string;
}
// Middleware to handle validation errors
const handleValidationErrors = (req: Request, res: Response, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Route to book a seat
router.post(
    '/book',
    verifyUser, // Ensure user is authenticated
    [
        body('train_id')
            .isInt().withMessage('Train ID must be an integer')
            .notEmpty().withMessage('Train ID is required'),
        body('seats_booked')
            .isInt({ min: 1 }).withMessage('At least one seat must be booked')
            .notEmpty().withMessage('Seats booked is required'),
    ],
    handleValidationErrors,
    async (req: Request, res: Response) => {
        const { train_id, seats_booked } = req.body;
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const user = req.user as User;
        const user_id = user.id; 

        try {
            const train = await getTrainById(train_id);
            if (!train) {
                return res.status(404).json({ message: 'Train not found' });
            }
            if (train.availableSeats < seats_booked) {
                return res.status(400).json({ message: 'Not enough seats available' });
            }

            await createBooking({ user_id, train_id, seats_booked });
            res.status(201).json({ message: 'Booking successful' });
        } catch (error) {
            res.status(500).json({ message: 'Error creating booking', error });
        }
    }
);

// Route to get all bookings for a user
router.get('/user/', verifyUser, async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    const user = req.user as User;
    const user_id = user.id; 

    // Validate userId
    if (!user_id || isNaN(user_id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const bookings = await getBookingsByUserId(user_id);
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error });
    }
});

router.get('/booking/:bookingId', verifyUser, async (req: Request, res: Response) => {
    const bookingId = Number(req.params.bookingId);
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    const user = req.user as User;
    const user_id = user.id; 
    // Validate bookingId
    if (!bookingId || isNaN(bookingId)) {
        return res.status(400).json({ message: 'Invalid booking ID' });
    }

    try {
        const booking = await getBookingDetails(bookingId);
        if (booking) {
            // Check if the booking belongs to the authenticated user
            if (booking.user_id !== user_id) {
                return res.status(403).json({ message: 'Access denied. You do not own this booking.' });
            }
            return res.status(200).json(booking);
        } else {
            return res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching booking details', error });
    }
});

export default router;
