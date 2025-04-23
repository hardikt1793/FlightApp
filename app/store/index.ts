import {configureStore} from '@reduxjs/toolkit';
import flightsReducer, {FlightsState} from './slices/flightsSlice';

const store = configureStore({
  reducer: {
    flights: flightsReducer,
  },
});

export type RootState = {
  flights: FlightsState;
};

export type AppDispatch = typeof store.dispatch;

export default store;
