describe("Smoke tests", () => {
  beforeEach(() => {
    cy.request("GET", "/api/todos")
      .its("body")
      .each((todo) => cy.request("DELETE", `/api/todos/${todo.id}`));
  });

  context("With no todos", () => {
    it.only("Saves new todos", () => {
      const items = [
        { text: "Todo 1", expectedLength: 1 },
        { text: "Todo 2", expectedLength: 2 },
        { text: "Todo 3", expectedLength: 3 },
      ];

      cy.visit("/");
      cy.server();
      cy.route("POST", "/api/todos").as("create");

      cy.wrap(items).each((todo) => {
        cy.focused().type(todo.text).type("{enter}");

        cy.wait("@create");

        cy.get(".todo-list li").should("have.length", todo.expectedLength);
      });
    });
  });
});
