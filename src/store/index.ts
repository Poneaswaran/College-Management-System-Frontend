import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/slice';
import assignmentsReducer from '../features/assignments/slice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        assignments: assignmentsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
