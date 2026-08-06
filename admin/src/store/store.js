// store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import adminAuthReducer from '../features/auth/adminAuthSlice';
import adminCampaignsReducer from '../features/campaign/adminCampaignSlice';
import adminBlogSlice from '../features/blog/blogSlice';
import settingsReducer from '../features/settings/settingsSlice';
import adminPaymentsReducer from '../features/payment/adminPaymentsSlice';
import adminDonorsReducer from '../features/donor/adminDonorsSlice';
import analyticReducer from '../features/analytics/analyticsSlice';
import adminVolunteersReducer from '../features/volunteer/adminVolunteersSlice';
// ✅ Persist config for adminAuth
const adminPersistConfig = {
  key: 'adminAuth',
  storage,
  blacklist: ['loading', 'error']
};

// ✅ Wrap adminAuthReducer with persistReducer
const persistedAdminReducer = persistReducer(adminPersistConfig, adminAuthReducer);

// ✅ Configure store
export const store = configureStore({
  reducer: {
    adminAuth: persistedAdminReducer,
    adminCampaigns: adminCampaignsReducer,
    adminBlogs: adminBlogSlice,
    settings: settingsReducer,
    adminDonors: adminDonorsReducer,
    adminPayments: adminPaymentsReducer,
    analytics: analyticReducer,
    adminVolunteers: adminVolunteersReducer,
    
    // other slices
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, 'adminPayments/exportPayments/fulfilled', 'adminDonors/exportDonors/fulfilled'],
      },
    }),
  devTools: import.meta.env.VITE_APP_TYPE === 'admin',
});

// ✅ Create persistor
export const persistor = persistStore(store);
export default store;