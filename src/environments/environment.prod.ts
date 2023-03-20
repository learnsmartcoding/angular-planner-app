import { EnvironmentConfiguration } from "src/app/models/environment-configuration";

// The list of file replacements can be found in `angular.json`.
export const environment: EnvironmentConfiguration = {
  env_name: 'prod',
  production: true,
  apiUrl: 'https://lsc-planner-api.azurewebsites.net/api',
  apiEndpoints: {
    planSchedule:'PlanSchedule',
    accounts: {
      getUserProfile: 'Account/GetUserProfile',
      saveProfile: 'Account/SaveProfile'
    },
  },
  cacheTimeInMinutes: 30,
};