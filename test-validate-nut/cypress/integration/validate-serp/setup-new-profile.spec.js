/// <reference types="cypress" />

// npx cypress run --spec "cypress/integration/validate-serp/setup-new-profile.spec.js"
// npx cypress run --record --key 9743f662-48e6-4242-b52d-4bddbb60ee67 --spec "cypress/integration/validate-serp/setup-new-profile.spec.js"

/**
 * #chai's BDD no meaning chainable
 * to, be, been, is, that, which, and, has, have, with, at, of, same
 * 
 * # each it() will run separately
 */

context('setup new profile', () => {

    let keyword;
    let selector;

    before(() => {
        cy.visit('https://validate-serp.monetoring.com/');

        cy.location('href', { timeout: 10000 })
            .should('contain', 'validate-serp.monetoring');
        // wait for 
        cy.server();
        cy.route("/api/task/date*").as("inquireAvailableData");
        cy.route("/api/task/get*").as("getLatestProfile");
        cy.wait("@inquireAvailableData", {timeout: 10000}).then((xhr) => {
            console.log(`available data list status : ${xhr.statusMessage}`);
        });

        cy.fixture("validate-serp/selector.json").then((selectorFixture) => {
            selector = selectorFixture;
        });
        cy.fixture("validate-serp/keyword.json").then((keywordFixture) => {
            keyword = keywordFixture;
        });

    });

    // we need to combine all process because if any command failing it should stop, preventing unintended action.
    it('setup new Analyze profile', () => {

        // #1 set-up new profile.
        cy.get(".dropdown > .btn").then((htmlElems) => {
            let htmlElem = htmlElems.get(0);
            let currDate = new Date(htmlElem.textContent);
            let now = new Date();
            let isValidatorUpToDate = compareDate(currDate, now);
            // console.log(`is validator up-to-date: ${isValidatorUpToDate}`);
            if (!isValidatorUpToDate) {
                console.log(`validator is currently not up-to-date`);

                // wait profile to load first.
                cy.wait("@getLatestProfile", { timeout: 15000 }).then((xhr) => {
                    console.log(`lastest serp profile is : ${xhr.statusMessage}`);
                })

                // click New date
                cy.get('[data-cy=new-date]', { timeout: 10000  }).should("be.enabled").click();

            } else {
                console.log(`validator is currently up-to-date`);
                // if it's up-to-date , it's mean that it's has been already done

                // remove date because you have to clear all recent SERP page.
                cy.get('[data-cy=remove-date]', {timeout: 10000}).should("be.enabled").click();
                // confirm
                cy.get('modal-content > modal-footer > .modal-footer > .btn-primary').click();

                // click New date
                cy.get('[data-cy=new-date]', {timeout: 10000}).should("be.enabled").click();
            }
        })

        // loop, requesting and testing content.
        keyword.keyword.forEach(kw => {
            let url = `https://www.google.fr/search?q=${kw}&start=0&ie=UTF-8&oe=UTF8&hl=fr&gl=fr&uule=w+CAIQICIGRnJhbmNl`;
            cy.request(url).then((response) => {

                // click on ADD SERP
                cy.get('[data-cy=add-serp]').click();
    
                // wait for pop-up modal
                cy.get(".modal-content");
    
                let serp = response.body;
                let wrappedSerp = new String(serp);
                // paste SERP to textarea, and trigger input event
                cy.get("textarea").then((htmlElem) => {
                    let textArea = htmlElem.get(0);
                    textArea.value = serp;
                }).trigger("input");
                                   
                //Organic
                if (wrappedSerp.includes(selector.organic)) {
                    cy.get("[data-cy=task-type-0]").click();
                }
    
                // Adtop
                if (wrappedSerp.includes(selector.adTop)) {
                    cy.get("[data-cy=task-type-1]").click();
                }
    
                // Ad bottom
                if (wrappedSerp.includes(selector.adBottom)) {
                    cy.get("[data-cy=task-type-2]").click();
                }
    
                // Image
                if (wrappedSerp.includes(selector.image)) {
                    cy.get("[data-cy=task-type-3]").click();
                }
    
                // News
                if (wrappedSerp.includes(selector.news)) {
                    cy.get("[data-cy=task-type-4]").click();
                }
    
                // Map
                if (wrappedSerp.includes(selector.map)) {
                    cy.get("[data-cy=task-type-5]").click();
                }
    
                // Shopping
                if (wrappedSerp.includes(selector.shopping)) {
                    cy.get("[data-cy=task-type-6]").click();
                }
    
                // Video
                if (wrappedSerp.includes(selector.video)) {
                    cy.get("[data-cy=task-type-7]").click();
                }
    
                // Flight
                if (wrappedSerp.includes(selector.flight)) {
                    cy.get("[data-cy=task-type-8]").click();
                }
    
                // Hotel
                if (wrappedSerp.includes(selector.hotel)) {
                    cy.get("[data-cy=task-type-9]").click();
                }
    
                // Number of pages indexed
                if (wrappedSerp.includes(selector.numberOfPagesIndex)) {
                    cy.get("[data-cy=task-type-10]").click();
                }
    
                // Featured snippet
                if (wrappedSerp.includes(selector.featuredSnippet)) {
                    cy.get("[data-cy=task-type-11]").click();
                }
    
                // click Apply button
                cy.get("[data-cy=apply]").click();
    
                // wait for pop-up modal to disappear
                cy.get(".modal-content", { timeout: 10000 }).should("not.exist");
            })
        }); // end looping all specified keyword

        // add  GMB
        addBlankGmb();

        // analyze button should be enable
        cy.get('[data-cy=analyze]').should("not.be.disabled").click();

        // wait for result

        // assertion line

        // what to do next?
    });
})

// function is run instantly but I think action is queue.
function clickAddSerp() {
    cy.get('[data-cy=add-serp]').click();
}

function addBlankGmb() {
    console.log(`addBlankGmb()`);
    // click AddSerp
    clickAddSerp();
    // click gmb
    cy.get("[data-cy=task-type-12]").click();
    // click Apply button
    cy.get("[data-cy=apply]").click();
    // wait for pop-up modal to disappear
    cy.get(".modal-content", { timeout: 10000 }).should("not.exist");
}


/**
 * @param {Date} date1 
 * @param {Date} date2
 * UTC time is adjusting +00 time with offset.
 */
function compareDate(date1, date2) {
    let isYearEqual = date1.getFullYear() === date2.getFullYear() ? true : false;
    let isMonthEqual = date1.getMonth() === date2.getMonth() ? true : false;
    let isDayOfMonthEqual = date1.getDate() === date2.getDate();
    return isYearEqual && isMonthEqual && isDayOfMonthEqual;
}

class TestClass2 {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

}