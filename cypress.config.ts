import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  env: {
    API_URL: "https://cinereserve-backend-g3czcqb6cvavdqcx.swedencentral-01.azurewebsites.net",
  },
});