export interface EnvironmentConfiguration {
    env_name: string;
    production: boolean;
    apiUrl: string;    
    apiEndpoints: {        
        planSchedule: string       ,
        accounts: {
            getUserProfile:string;
            saveProfile: string;
        },
    },
    cacheTimeInMinutes: number;
}