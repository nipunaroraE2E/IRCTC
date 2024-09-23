// Models/Booking.ts

import { RowDataPacket } from 'mysql2';
import { getConnection } from '../config/database'; // Adjust the import based on your project structure

export interface Booking {
    id?: number;
    user_id: number;
    train_id: number;
    booking_date?: Date;
    seats_booked: number;
}


export const createBooking = async (bookingData: { user_id: number; train_id: number; seats_booked: number }) => {
    const connection = await getConnection();
    
    try {
        //  transaction start
        await connection.beginTransaction();
        
        const [trainRows]: [RowDataPacket[], unknown] = await connection.execute('SELECT availableSeats FROM Train WHERE id = ?', [bookingData.train_id]);
        // Ensure that we have train data
        if (trainRows.length === 0) {
            throw new Error('Train not found');
        }

        const train = trainRows[0];

        if (train.available_seats < bookingData.seats_booked) {
            throw new Error('Not enough seats available');
        }

        // Create the booking
        await connection.execute('INSERT INTO bookings (user_id, train_id, seats_booked) VALUES (?, ?, ?)', [
            bookingData.user_id,
            bookingData.train_id,
            bookingData.seats_booked
        ]);

        // Update the available seats in the Train table
        const newAvailableSeats = train.availableSeats - bookingData.seats_booked;
        await connection.execute('UPDATE Train SET availableSeats = ? WHERE id = ?', [newAvailableSeats, bookingData.train_id]);

        // Commit the transaction
        await connection.commit();
    } catch (error) {
        // Rollback the transaction in case of error
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export const getBookingsByUserId = async (userId: number): Promise<Booking[]> => {
    const connection = await getConnection();
    const query = 'SELECT * FROM bookings WHERE user_id = ?';
    const [rows] = await connection.execute(query, [userId]);
    connection.release();
    return rows as Booking[];
};


export const getBookingDetails = async (bookingId: number): Promise<Booking | null> => {
    const connection = await getConnection();
    const query = 'SELECT * FROM bookings WHERE id = ?';
    const [rows] :[RowDataPacket[] , any] =  await connection.execute(query, [bookingId]);
    connection.release();
    return rows.length > 0 ? (rows[0] as Booking) : null;
};
