/**
 * Classe Joueur
 * Représente un joueur avec son nom et son score.
 */
export class Joueur {
    #nom
    #score


    constructor(nom, score) {
        this.#nom = nom;
        this.#score = score;

    }


    set nom(value) {
        this.#nom = value;
    }

    set score(value) {
        this.#score = value;
    }




    /**
     * Compare le score avec un autre joueur.
     * @param {Joueur} autre
     * @returns {number} 1 si supérieur, -1 si inférieur, 0 si égalité
     */
    comparerA(autre) {
    }
}
