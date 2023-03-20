// // This file can be replaced during build by using the `fileReplacements` array.
// // `ng build` replaces `environment.ts` with `environment.prod.ts`.

// import { EnvironmentConfiguration } from "src/app/models/environment-configuration";

// // The list of file replacements can be found in `angular.json`.
// export const environment: EnvironmentConfiguration = {
//   env_name: 'dev',
//   production: true,
//   apiUrl:  'https://localhost:7044/api',//'https://lsc-planner-api.azurewebsites.net/api',//'https://localhost:7044/api',
//   apiEndpoints: {
//    planSchedule:'PlanSchedule',
//    accounts: {
//     getUserProfile: 'Account/GetUserProfile',
//     saveProfile: 'Account/SaveProfile'
//   },
//   },
//   cacheTimeInMinutes: 30,
// };

// /*
//  * For easier debugging in development mode, you can import the following file
//  * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
//  *
//  * This import should be commented out in production mode because it will have a negative impact
//  * on performance if an error is thrown.
//  */
// // import 'zone.js/plugins/zone-error';  // Included with Angular CLI.


import { EnvironmentConfiguration } from "src/app/models/environment-configuration";

// The list of file replacements can be found in `angular.json`.
export const environment: EnvironmentConfiguration = {
  env_name: 'prod',
  production: true,
  apiUrl: 'https://lsc-planner-api.azurewebsites.net/api',//'https://localhost:7044/api'
  apiEndpoints: {
    planSchedule:'PlanSchedule',
    accounts: {
      getUserProfile: 'Account/GetUserProfile',
      saveProfile: 'Account/SaveProfile'
    },
  },
  cacheTimeInMinutes: 30,
};