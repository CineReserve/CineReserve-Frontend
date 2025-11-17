describe("UI Smoke Test – Critical Screens Render", () => {

  beforeEach(() => {
    cy.visit("/", {
      onBeforeLoad(win) { win.__cypressTesting = true; }
    });
  });

  const pages = [
    "/dashboard",
    "/users",
    "/theaters",
    "/staff-dashboard"
  ];

  pages.forEach(page => {
    it(`renders ${page} without crashing`, () => {
      cy.visit(page, {
        onBeforeLoad(win) { win.__cypressTesting = true; }
      });

      cy.get("body").should("be.visible");
      cy.contains(/dashboard|management|user|theater/i, { matchCase: false }).should("exist");
    });
  });

});
