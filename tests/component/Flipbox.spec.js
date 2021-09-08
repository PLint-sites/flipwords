import { mount } from '@cypress/vue'
import FlipBox from '../../src/components/FlipBox.vue'
import chaiColors from 'chai-colors'
chai.use(chaiColors);

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
            propsData: {
                word
            }
        })

        cy.contains('.box', 'Angstig')
        cy.get('.box')
            .should('have.css', 'background-color')
            .and('be.colored', '#ffb74d')
    })

    it('is selected', () => {
        mount(FlipBox, {
            propsData: {
                word: {
                    ...word,
                    selected: true
                }
            }
        })

        cy.get('.box')
            .should('have.css', 'background-color')
            .and('be.colored', '#ef6c00')
    })
})

describe('Mounting FlipBox component with an English word', () => {
    it('is not selected', () => {
        mount(FlipBox, {
            propsData: {
                word: {
                    ...word,
                    type: 'en',
                    word: 'Anxious'
                }
            }
        })

        cy.contains('.box', 'Anxious')
        cy.get('.box')
            .should('have.css', 'background-color')
            .and('be.colored', '#039BE5')
    })

    it('is selected', () => {
        mount(FlipBox, {
            propsData: {
                word: {
                    ...word,
                    type: 'en',
                    word: 'Anxious',
                    selected: true
                }
            }
        })

        cy.get('.box')
            .should('have.css', 'background-color')
            .and('be.colored', '#0277BD')
    })
})

describe('Mounting a word and check correct', () => {
    it('is selected and correct', () => {
        mount(FlipBox, {
            propsData: {
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
            .should('have.css', 'background-color')
            .and('be.colored', '#43a047')
    })

    it('is selected and incorrect', () => {
        mount(FlipBox, {
            propsData: {
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
            .should('have.css', 'background-color')
            .and('be.colored', '#e53935')
    })
})