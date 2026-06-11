import { mount } from 'cypress/vue'
import FlipBox from '../../src/components/FlipBox.vue'

const word = {
    correct: null,
    flipping: false,
    selected: false,
    type: 'nl',
    word: 'Angstig'
}

describe('Mounting FlipBox component with a Dutch word', () => {
    it('is not selected', () => {
        mount(FlipBox, {
            props: {
                word
            }
        })

        cy.contains('.box', 'Angstig')
        cy.get('.box')
            .should('have.css', 'background-color', 'rgb(255, 183, 77)')
    })

    it('is selected', () => {
        mount(FlipBox, {
            props: {
                word: {
                    ...word,
                    selected: true
                }
            }
        })

        cy.get('.box')
            .should('have.css', 'background-color', 'rgb(239, 108, 0)')
    })
})

describe('Mounting FlipBox component with an English word', () => {
    it('is not selected', () => {
        mount(FlipBox, {
            props: {
                word: {
                    ...word,
                    type: 'en',
                    word: 'Anxious'
                }
            }
        })

        cy.contains('.box', 'Anxious')
        cy.get('.box')
            .should('have.css', 'background-color', 'rgb(3, 155, 229)')
    })

    it('is selected', () => {
        mount(FlipBox, {
            props: {
                word: {
                    ...word,
                    type: 'en',
                    word: 'Anxious',
                    selected: true
                }
            }
        })

        cy.get('.box')
            .should('have.css', 'background-color', 'rgb(2, 119, 189)')
    })
})

describe('Mounting a word and check correct', () => {
    it('is selected and correct', () => {
        mount(FlipBox, {
            props: {
                word: {
                    ...word,
                    selected: true,
                    correct: true
                }
            }
        })

        cy.get('.box')
            .should(($box) => {
                expect($box).to.have.length(1)
                const className = $box[0].className
                expect(className).to.contain('correct')
            })
            .should('have.css', 'background-color', 'rgb(67, 160, 71)')
    })

    it('is selected and incorrect', () => {
        mount(FlipBox, {
            props: {
                word: {
                    ...word,
                    selected: true,
                    correct: false
                }
            }
        })

        cy.get('.box')
        .should(($box) => {
                expect($box).to.have.length(1)
                const className = $box[0].className
                expect(className).to.contain('incorrect')
            })
            .should('have.css', 'background-color', 'rgb(229, 57, 53)')
    })
})