import { defineConfig } from "cypress";

/* Cypress 10: https://docs.cypress.io/guides/getting-started/installing-cypress */
/* - 'cypress.config.ts' is Newly Created */
/* - 'support/index.js' is Deprecated → Replaced by 'support/e2e.ts' */
/* - 'integration/' is Deprecated → Replaced by 'e2e/' */
/* - 'npx cypress open' for Execution */

/* TypeScript for Cypress: https://docs.cypress.io/guides/tooling/typescript-support */
/* - Manually Create 'cypress/tsconfig.json' */

/* 'cypress.json' is Deprecated → Insert JSON Here */
export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      /* 'cypress/plugins/index.js' is Deprecated → Insert Plugins Here */
      const _ = require('@testing-library/cypress')
    },
  },
});
