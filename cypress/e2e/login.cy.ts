describe("Login Page", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("shows error when both email and password are empty", () => {
    cy.get('button[type="submit"]').click();
    cy.contains("Please enter both email and password").should("be.visible");
  });

  it("shows error when email is empty and password is filled", () => {
    cy.get('input[type="password"]').type("123456");
    cy.get('button[type="submit"]').click();
    cy.contains("Please enter both email and password").should("be.visible");
  });

  it("shows error when email is filled and password is empty", () => {
    cy.get('input[type="text"]').type("owner@northstar.fi");
    cy.get('button[type="submit"]').click();
    cy.contains("Please enter both email and password").should("be.visible");
  });
});
it("shows error for incorrect password (401)", () => {
  cy.intercept("POST", "**/login", {
    statusCode: 401,
    body: { message: "Invalid password. Please try again." },
  });

  cy.visit("/login");

  cy.get('input[type="text"]').type("owner@northstar.fi");
  cy.get('input[type="password"]').type("wrongpassword");
  cy.get('button[type="submit"]').click();

  cy.contains("Invalid password. Please try again.").should("be.visible");
});
it("shows error when user is not found (404)", () => {
  cy.intercept("POST", "**/login", {
    statusCode: 404,
    body: { message: "User not found. Please register first." },
  });

  cy.visit("/login");

  cy.get('input[type="text"]').type("unknown@northstar.fi");
  cy.get('input[type="password"]').type("somepassword");
  cy.get('button[type="submit"]').click();

  cy.contains("User not found. Please register first.").should("be.visible");
});
it("redirects owner to /dashboard on successful login", () => {
  cy.intercept("POST", "**/login", {
    statusCode: 200,
    body: {
      result: true,
      token: "mocked-token",
      userRole: "owner",
    },
  });

  cy.visit("/login");

  cy.get('input[type="text"]').type("owner@northstar.fi");
  cy.get('input[type="password"]').type("correctpassword");
  cy.get('button[type="submit"]').click();

  cy.url().should("include", "/dashboard");
});
//Add Staff role redirect test
it("redirects staff to /staff-dashboard on successful login", () => {
  cy.intercept("POST", "**/login", {
    statusCode: 200,
    body: {
      result: true,
      token: "mocked-token",
      userRole: "staff",
    },
  });

  cy.visit("/login");

  cy.get('input[type="text"]').type("staff@northstar.fi");
  cy.get('input[type="password"]').type("correctpassword");
  cy.get('button[type="submit"]').click();

  cy.url().should("include", "/staff-dashboard");
});
//others
it("shows loading state while logging in", () => {
  cy.intercept("POST", "**/login", (req) => {
    req.on("response", (res) => {
      res.setDelay(1500); // simulate slow response
    });
    req.reply({
      statusCode: 200,
      body: {
        result: true,
        token: "mock-token",
        userRole: "owner"
      }
    });
  });

  cy.visit("/login");

  cy.get('input[type="text"]').type("owner@northstar.fi");
  cy.get('input[type="password"]').type("correctpassword");

  cy.get('button[type="submit"]').click();

  // Check loading state
  cy.contains("Signing In...").should("be.visible");

  // After response delay, URL changes
  cy.url().should("include", "/dashboard");
});

