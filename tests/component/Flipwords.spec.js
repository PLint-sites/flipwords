import { mount } from '@cypress/vue'
import Flipwords from '../../src/components/Flipwords.vue'
import chaiColors from 'chai-colors'
chai.use(chaiColors);

const wordBox = {
    correct: null,
    flipping: false,
    selected: false,
    type: 'en',
    word: '',
}

beforeEach(() => {
    mount(Flipwords, {
        propsData: {
            remainingNumberOfWords: 101,
            wordsForLevel: [
                {
                    ...wordBox,
                    word: 'abide by'
                },
                {
                    ...wordBox,
                    word: 'accrued'
                },
                {
                    ...wordBox,
                    word: 'adage'
                },
                {
                    ...wordBox,
                    word: 'advent'
                },
                {
                    ...wordBox,
                    word: 'arduous'
                },
                {
                    ...wordBox,
                    type: 'nl',
                    word: 'zwaar'
                },
                {
                    ...wordBox,
                    type: 'nl',
                    word: 'komst'
                },
                {
                    ...wordBox,
                    type: 'nl',
                    word: 'gezegde'
                },
                {
                    ...wordBox,
                    type: 'nl',
                    word: 'opgebouwd'
                },
                {
                    ...wordBox,
                    type: 'nl',
                    word: 'zich houden aan'
                },
            ],
        }
    })

    cy.contains('button', 'Start game').click()
    cy.get('.box').as('boxes')
    cy.get('#scoreboard span:last-child').as('score')
    cy.get('#scoreboard span:first-child').as('lives')
})

it('Checks correct and wrong match', () => {
    // By defaut we have 10 boxes and 0 score
    cy.get('@boxes').should('have.length', 10)
    cy.get('@score').should('have.text', 'Points: 0')

    cy.get('.box:first-child').should('have.text', 'abide by')
    cy.get('.box:nth-child(10)').should('have.text', 'zich houden aan')

    // Correct match => remove words and increment points
    cy.get('.box:first-child').click()
    cy.get('.box:nth-child(10)').click()
    cy.get('@boxes').should('have.length', 8)
    cy.get('@score').should('have.text', 'Points: 1')

    // Wrong match => decrement lives
    cy.get('.box:first-child').click()
    cy.get('.box:nth-child(6)').click()
    cy.get('@lives').should('have.text', 'Lives: 2')
})

it.only('Shows game over screen', () => {
    cy.get('@lives').should('have.text', 'Lives: 3')

    // First wrong match
    cy.get('.box:first-child').click()
    cy.get('.box:nth-child(9)').click()
    
    cy.get('.box:nth-child(-n+5)')
        .should('have.css', 'background-color')
        .and('be.colored', '#039BE5')
    .then(() => {
        cy.get('@lives').should('have.text', 'Lives: 2')

        // Second wrong match
        cy.get('.box:first-child').click()
        cy.get('.box:nth-child(8)').click()
    })

    cy.get('.box:nth-child(-n+5)')
        .should('have.css', 'background-color')
        .and('be.colored', '#039BE5')
    .then(() => {
        cy.get('@lives').should('have.text', 'Lives: 1')

        // Third wrong match
        cy.get('.box:first-child').click()
        cy.get('.box:nth-child(7)').click()
    })

    cy.get('#gameover').should('have.text', ' GAME OVER Play again?')
})

it('Levels up when all is correct', () => {
    cy.get('.box:first-child').click()
    cy.get('.box:nth-child(10)').click()

    cy.get('@boxes').should('have.length', 8)
    .then(() => {
        cy.get('.box:first-child').click()
        cy.get('.box:nth-child(8)').click()
    })

    cy.get('@boxes').should('have.length', 6)
    .then(() => {
        cy.get('.box:first-child').click()
        cy.get('.box:nth-child(6)').click()
    })

    cy.get('@boxes').should('have.length', 4)
    .then(() => {
        cy.get('.box:first-child').click()
        cy.get('.box:nth-child(4)').click()
    })

    cy.get('@boxes').should('have.length', 2)
    .then(() => {
        cy.get('.box:first-child').click()
        cy.get('.box:last-child').click()
    })

    cy.get('@score').should('have.text', 'Points: 5')
    cy.get('@lives').should('have.text', 'Lives: 3')
})
