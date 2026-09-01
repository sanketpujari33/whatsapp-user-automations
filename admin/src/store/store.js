import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import localeReducer from './slices/localeSlice';
import adminsReducer from './slices/adminsSlice';
import breakpointReducer from './slices/breakpointSlice';
import teamReducer from './slices/teamSlice';
import teamRolesReducer from './slices/teamRolesSlice';
import teamTypeReducer from './slices/teamTypeSlice';
import fundManagementReducer from './slices/fundManagementSlice';
import botManagementReducer from './slices/botManagementSlice';
import dashboardReducer from './slices/dashboardSlice';
import configReducer from './slices/configSlice';
import usersReducer from './slices/usersSlice';
import sidebarReducer from './slices/sidebarSlice';
import languagesReducer from './slices/languagesSlice';
import notificationsReducer from './slices/notificationsSlice';


export const stores = configureStore({
    reducer: {
        auth: authReducer,
        theme: themeReducer,
        locale: localeReducer,
        breakpoint: breakpointReducer,
        sidebar: sidebarReducer,
        admins: adminsReducer,
        team: teamReducer,
        teamRoles: teamRolesReducer,
        teamType: teamTypeReducer,
        fundManagement: fundManagementReducer,
        botManagement: botManagementReducer,
        dashboard: dashboardReducer,
        config: configReducer,
        users: usersReducer,
        languages: languagesReducer,
        notifications: notificationsReducer,
    },
});

export const RootState = () => stores.getState();
export const AppDispatch = () => stores.dispatch();
