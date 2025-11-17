describe("Protected Route Security Tests", () => {

  it("redirects unauthenticated user to login", () => {
    cy.visit("/users");
    cy.url().should("include", "/login");
  });

  it("blocks staff from accessing owner-only pages", () => {

    // login as staff
    cy.request("POST", `${API_URL}/login`, {
      email: "staff@northstar.fi",
      password: "password123"
    }).then(res => {
      cy.window().then((win: any) => {
        win.__appSetToken(res.body.token);
        win.__appSetRole("staff");
      });
    });

    cy.visit("/users");

    cy.url().should("include", "/unauthorized");
  });

});
