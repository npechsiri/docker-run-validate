/// <reference types="cypress" />

context('Go to validator', () => {

    // beforeEach(() => {
        // cy.visit('https://validate-serp.monetoring.com/');
    // });

    it('insert your title here', ()=> {
        let keyword = "bmw";
        cy.visit(`https://www.google.fr/search?q=${keyword}`);

        cy.get("html").then((htmlElems) => {
            let htmlElem = htmlElems.get(0);
            console.log(htmlElem);
        })
    });

    

})