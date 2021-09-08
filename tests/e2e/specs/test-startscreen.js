// https://docs.cypress.io/api/introduction/api.html

describe('Startscreen', () => {
  it('Contains title, explanation and button', () => {
    cy.visit('/')
    cy.contains('h1', 'Flip Words')
    cy.contains('p', 'Zoek de Engelse en Nederlandse woorden bij elkaar')
    cy.contains('button', 'Start game')
  })

  it('Starting game shows a list of words', () => {
    cy.visit('/')
    cy.get('button').click()
    cy.get('.box').should('have.length', 10)
    cy.contains('Lives: 3')
  })
})
