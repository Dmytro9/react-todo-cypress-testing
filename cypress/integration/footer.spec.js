describe("Footer", () => {
  context("with a singule todo", () => {
    it("diplays a singular todo in count", () => {
      cy.seedAndVisit([{ id: 1, name: "Todo 1", isCompleted: false }]);
      cy.get(".todo-count").should("contain", "1 todo left");
    });
  });

  context("with multiple todos", () => {
    beforeEach(() => {
      cy.seedAndVisit();
    });

    it("diplays plural todos in count", () => {
      cy.get(".todo-count").should("contain", "3 todos left");
    });

    it("Handle filter links", () => {
      const filters = [
        { link: "Active", expectedLength: 3 },
        { link: "Completed", expectedLength: 1 },
        { link: "All", expectedLength: 4 },
      ];

      cy.wrap(filters).each((filter) => {
        cy.contains(filter.link).click();

        cy.get(".todo-list li").should("have.length", filter.expectedLength);
      });
    });
  });
});
