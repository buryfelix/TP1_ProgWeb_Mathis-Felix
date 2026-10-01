// =============================================================================
// Templates HTML (Constantes)
// =============================================================================

import {
    TEMPLATE_BADGE_JOUEUR,
    TEMPLATE_BIENVENUE,
    TEMPLATE_QUIZ,
    TEMPLATE_OPTION, TEMPLATE_RESULTAT, TEMPLATE_JOUEUR_RESULTAT
} from "../VuesDynamiques.js";
import {handleDemarrer, handleQuestionSuivante, handleChoixDeReponse, handleRecommancer} from "../evenements.js";

/**
 * Classe VueQuiz
 * Responsable de l'affichage dans le DOM.
 * Ne contient aucune logique de jeu.
 */
export class VueQuiz {
    #conteneur;
    #quiz;
    #nomsJoueurs = ['', ''];

    /**
     * @param {HTMLElement} conteneur - Élément racine qui accueille la vue
     * @param {Quiz} quiz - Le modèle Quiz
     */
    constructor(quiz) {
        this.#conteneur = document.getElementById('app');
        this.#quiz = quiz;
        quiz.surChangement = () => {
            this.affiche()
        };

    }

    // ---------- Getters & Setters ----------
    get nomsJoueurs() {
        return [...this.#nomsJoueurs];
    }

    get quiz() {
        return this.#quiz;
    }

    definirNomsJoueurs(p1, p2) {
        this.#nomsJoueurs = [p1, p2];
    }

    // ---------- Point d'entrée du rendu ----------
    affiche() {
        if (!this.#quiz.estDemarre) {
            this.#afficheBienvenue();
        } else if (this.#quiz.estTermine) {
            this.#afficheResultat();
        } else {
            this.#afficheQuiz();
        }
    }

    // ---------- Écran d'accueil ----------
    #afficheBienvenue() {
        this.#conteneur.innerHTML = TEMPLATE_BIENVENUE;
        document.getElementById('startBtn').addEventListener('click', (ev) => {
            handleDemarrer(ev, this)
        });

        const champJoueur1 = this.#conteneur.querySelector('#player1');
        const champJoueur2 = this.#conteneur.querySelector('#player2');

        if (champJoueur1 && this.#nomsJoueurs[0]) {
            champJoueur1.value = this.#nomsJoueurs[0];
        }
        if (champJoueur2 && this.#nomsJoueurs[1]) {
            champJoueur2.value = this.#nomsJoueurs[1];
        }
    }

    // ---------- Écran de quiz ----------
    #afficheQuiz() {

        let q = this.#quiz.questionActuelle;

        let estRepondu = this.#quiz.estRepondu;
        let reponseChoisie = this.#quiz.reponseChoisie;
        // Construction des choix de réponse
        let htmlOptions = '';
        for (let i = 0; i < q.options.length; i++) {
            const option = q.options[i];
            const classes = this.#determinerClasseAppropriee(i, q, estRepondu, reponseChoisie);
            htmlOptions += '' + TEMPLATE_OPTION(classes, i, q.lettreA(i), option);
        }

        //NOTE: UTILISER handleChoixDeReponse pour le clic de bouton Options

        // Construction des Badges joueurs

        let htmlJoueurs = '';
        for (let i = 0; i < this.#nomsJoueurs.length; i++) {
            let actif = this.#quiz.indexJoueurActuel;
            actif = actif === i;
            htmlJoueurs += '' + TEMPLATE_BADGE_JOUEUR(this.#nomsJoueurs[i], this.#quiz.joueurs[i].score, actif);
        }

        // Construction du Quiz avec htmlOptions et les Badges des joueurs


        this.#conteneur.innerHTML = TEMPLATE_QUIZ(htmlJoueurs, q.enonce, htmlOptions);

        const choixReponses = this.#conteneur.querySelectorAll('.option-btn');
        choixReponses.forEach((choix) => {
            choix.addEventListener('click', (ev) => {
                    handleChoixDeReponse(ev, this.#quiz);
                }
            );
        });

        const boutonSuivant = document.getElementById('nextBtn');
        boutonSuivant.disabled = !this.#quiz.estRepondu;

        boutonSuivant.addEventListener('click', (ev) => {


                handleQuestionSuivante(ev, this.#quiz, this.#quiz.joueurs[0].score, this.#quiz.joueurs[1].score);
            }
        );
    }

    // ---------- Écran de résultat ----------
    #afficheResultat() {

        let joueurGagnant = [false, true, this.#quiz.joueurs[1].nom];
        let htmlJoueurResultat = '';

        if (this.#quiz.joueurs[0].score > this.#quiz.joueurs[1].score) {
            joueurGagnant[0] = true;
            joueurGagnant[1] = false;
            joueurGagnant[2] = this.#quiz.joueurs[0].nom;
        }

        for (let i = 0; i < this.#nomsJoueurs.length; i++) {
            htmlJoueurResultat += '' + TEMPLATE_JOUEUR_RESULTAT(this.#nomsJoueurs[i], this.#quiz.joueurs[i].score, joueurGagnant[i]);
        }

        let messageGagnant = `🏆 ${joueurGagnant[2]} remporte la partie!`

        this.#conteneur.innerHTML = TEMPLATE_RESULTAT(htmlJoueurResultat, messageGagnant);

        const boutonRestart = document.getElementById('restartBtn');

        boutonRestart.addEventListener('click', (ev) => {

                handleRecommancer(ev, this.#quiz);
            }
        );

    }

    // ---------- Utilitaires ----------
    /**
     * Détermine les classes CSS d'une option en fonction de l'état de la question.
     */
    #determinerClasseAppropriee(index, question, estRepondu, reponseChoisie) {
        const classes = ['option-btn'];
        let retClasses = "";

        if (!estRepondu) {
            retClasses = classes.join(' '); // pour retirer le tableau
        } else {
            classes.push('disabled');
            if (index === question.indexCorrect) {
                classes.push('correct');
            } else if (index === reponseChoisie) {
                classes.push('incorrect');
            }
            if (index === reponseChoisie) {
                classes.push('selected');
            }
            retClasses = classes.join(' '); // pour retirer le tableau et joindre les classes sélectionnées
        }

        return retClasses;

    }
}
