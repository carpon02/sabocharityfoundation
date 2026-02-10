// store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../features/auth/authSlice";
import donationReducer from "../features/donation/donationSlice";
import notificationsReducer from "../features/notification/notificationsSlice";
import userReducer from "../features/user/userSlice";
import campaignReducer from "../features/campaign/userCampaignsSlice";
import eventReducer from "../features/event/eventSlice";
import analyticReducer from "../features/analytics/analyticsSlice";
import blogsReducer from "../features/blog/blogsSlice";
import eventsReducer from "../features/event/eventsSlice";
import campaignsReducer from "../features/campaign/campaignsSlice";
import volunteerReducer from "../features/volunteer/volunteerSlice";
import contactReducer from "../features/contact/contactSlice";
import newsletterReducer from "../features/newsletter/newsletterSlice";

// ✅ Configure persistence
const persistConfig = {
  key: "root", // key for localStorage
  storage, // use localStorage
  whitelist: ["user", "verified"], // only persist specific slices if needed
};

// ✅ Wrap authReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, authReducer);

// ✅ Configure the store
export const store = configureStore({
  reducer: {
    auth: persistedReducer,
    donations: donationReducer,
    notifications: notificationsReducer,
    events: eventReducer,
    user: userReducer,
    analytics: analyticReducer,
    userCampaigns: campaignReducer,
    blogs: blogsReducer,
    allEvents: eventsReducer,
    campaigns: campaignsReducer,
    volunteer: volunteerReducer,
    contact: contactReducer,
    newsletter: newsletterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // needed for redux-persist
    }),
});

// ✅ Create persistor
export const persistor = persistStore(store);
