import {defineConfig,devices} from '@playwright/test';
const port=Number(process.env.TEST_PORT||4321);
const baseURL=`http://127.0.0.1:${port}`;
export default defineConfig({testDir:'./tests/e2e',fullyParallel:false,workers:1,timeout:30000,use:{baseURL,headless:true,channel:process.env.PLAYWRIGHT_CHANNEL||undefined,colorScheme:'light',trace:'retain-on-failure'},projects:[{name:'desktop',use:{...devices['Desktop Chrome'],viewport:{width:1440,height:1000}}},{name:'mobile',use:{...devices['iPhone 13'],defaultBrowserType:'chromium'}}],webServer:{command:`npm run preview -- --ignore-lock --port ${port}`,url:baseURL,reuseExistingServer:!process.env.CI,timeout:30000}});
