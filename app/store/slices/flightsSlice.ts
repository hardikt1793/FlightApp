import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  date: string;
}

export type FlightsState = Flight[];

const initialState: FlightsState = [];

const flightsSlice = createSlice({
  name: 'flights',
  initialState,
  reducers: {
    setFlights: (state, action: PayloadAction<FlightsState>) => action.payload,
  },
});

export const {setFlights} = flightsSlice.actions;
export default flightsSlice.reducer;
