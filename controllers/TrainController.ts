import { Request, Response } from 'express';
import { createTrain, getAllTrains, getTrainById, updateTrainSeats } from '../Models/Train';

export const createTrainHandler = async (req: Request, res: Response) => {
  const { trainName, source, destination, totalSeats, availableSeats } = req.body;
  try {
    await createTrain({ trainName, source, destination, totalSeats, availableSeats });
    res.status(201).json({ message: 'Train created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating train', error });
  }
};

export const getAllTrainsHandler = async (req: Request, res: Response) => {
  try {
    const trains = await getAllTrains();
    res.status(200).json(trains);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trains', error });
  }
};
