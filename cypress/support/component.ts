import { mount } from "@cypress/react18";

// Add mount command
Cypress.Commands.add("mount", mount);

// Optional global styles
import "../../src/index.css";
