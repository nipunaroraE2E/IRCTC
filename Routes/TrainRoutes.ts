import { Router, Request, Response } from 'express';
const { body, param , validationResult } = require('express-validator'); 
import { createTrain, getAllTrains, getTrainById, updateTrainSeats, deleteTrain } from '../Models/Train';
import { adminAuthMiddleware } from '../Middlewares/AdminAuthMiddleware';
const router = Router();

// Middleware to handle validation errors
const handleValidationErrors = (req: Request, res: Response, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Route to create a new train (Admin protected)
router.post(
  '/AddTrain',
  adminAuthMiddleware,
  [
    body('trainName').notEmpty().withMessage('Train name is required'),
    body('source').notEmpty().withMessage('Source station is required'),
    body('destination').notEmpty().withMessage('Destination station is required'),
    body('totalSeats').isInt({ min: 1 }).withMessage('Total seats must be a positive integer'),
    body('availableSeats').isInt({ min: 0 }).withMessage('Available seats must be a non-negative integer'),
  ],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const { trainName, source, destination, totalSeats, availableSeats } = req.body;
    
    try {
      await createTrain({ trainName, source, destination, totalSeats, availableSeats });
      res.status(201).json({ message: 'Train created successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error creating train', error });
    }
  }
);

// Route to get all trains
router.get('/AllTrains' , async (req: Request, res: Response) => {
  try {
    const trains = await getAllTrains();
    res.status(200).json(trains);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trains', error });
  }
});

// Route to get a specific train by ID (User and admin both can see the route here)
router.get(
  '/GetTrain/:id' ,
  [param('id').isInt({ min: 1 }).withMessage('Train ID must be a positive integer')],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const train = await getTrainById(Number(id));
      if (!train) {
        return res.status(404).json({ message: 'Train not found' });
      }
      res.status(200).json(train);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching train', error });
    }
  }
);

// Route to update train seat availability (Admin protected)
router.put(
  '/UpdateTrain/:id/seats', adminAuthMiddleware,
  [
    param('id').isInt({ min: 1 }).withMessage('Train ID must be a positive integer'),
    body('availableSeats').isInt({ min: 0 }).withMessage('Available seats must be a non-negative integer'),
  ],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { availableSeats } = req.body;

    try {
      await updateTrainSeats(Number(id), Number(availableSeats));
      res.status(200).json({ message: 'Train seat availability updated' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating seat availability', error });
    }
  }
);

// Route to delete a train (Admin protected)
router.delete(
  '/train/:id', adminAuthMiddleware,
  [param('id').isInt({ min: 1 }).withMessage('Train ID must be a positive integer')],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      await deleteTrain(Number(id));
      res.status(200).json({ message: 'Train deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting train', error });
    }
  }
);

export default router;
