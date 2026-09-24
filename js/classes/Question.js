/**
 * Classe Question
 * Représente une question de quiz avec ses options et la bonne réponse.
 */
class Question {

    #enonce;
    #options;
    #indexCorrect;

    /**
     * @param {Object} data - Données de la question
     * @param {string} data.question - L'intitulé de la question
     * @param {string[]} data.options - Tableau des 4 propositions
     * @param {number} data.correct - Index de la bonne réponse (0..3)
     */
    constructor({question, options, correct}) {
        this.#enonce = question;
        this.#options = options;
        this.#indexCorrect = correct;
    }


    get enonce() {
        return this.#enonce;
    }

    get options() {
        return this.#options;
    }

    get indexCorrect() {
        return this.#indexCorrect;
    }

    estCorrect(index) {
        return index === this.indexCorrect;
    }

    /**
     * Retourne la lettre correspondant à un index (A, B, C, D…).
     * @param {number} index
     * @returns {string}
     */
    lettreA(index) {
        let correspondant;
        switch (index) {
            case 0:
                correspondant = 'A';
                break;
            case 1:
                correspondant = 'B';
                break;
            case 2:
                correspondant = 'C';
                break;
            case 3:
                correspondant = 'D';
                break;
        }
        return correspondant;
    }
}