import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "../features/auth/adminAuthSlice";
import adminCampaignsReducer from "../features/campaign/adminCampaignSlice";
import adminBlogSlice from "../features/blog/blogSlice";
import settingsReducer from "../features/settings/settingsSlice";
import adminPaymentsReducer from "../features/payment/adminPaymentsSlice";
import adminDonorsReducer from "../features/donor/adminDonorsSlice";
import analyticReducer from "../features/analytics/analyticsSlice";
import adminVolunteersReducer from "../features/volunteer/adminVolunteersSlice";

export const store = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    adminCampaigns: adminCampaignsReducer,
    adminBlogs: adminBlogSlice,
    settings: settingsReducer,
    adminDonors: adminDonorsReducer,
    adminPayments: adminPaymentsReducer,
    analytics: analyticReducer,
    adminVolunteers: adminVolunteersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "adminPayments/exportPayments/fulfilled",
          "adminDonors/exportDonors/fulfilled",
        ],
      },
    }),
  devTools: import.meta.env.VITE_APP_TYPE === "admin",
});

export default store;
