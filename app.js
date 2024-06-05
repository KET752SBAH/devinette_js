let sectionCreateUser = document.querySelector('.createUser');
let profileDiv = document.querySelector('.profileDiv');
let pseudoInput = document.getElementById('pseudo')
let images = document.querySelector('.profileDiv img');
let btnCreateValider = document.querySelector('.createValider');
let SectionDevinette = document.querySelector('.devinette');
let imageDiv = document.querySelector('.imageDiv');
let pseudoName = document.querySelector('.pseudoName');
let Sectionleaderboard = document.getElementById("leaderboard");

let accueil = document.querySelector('.accueil');


// Sélection des éléments du DOM
const sectionLogin = document.getElementById('sectionLogin');
const sectionUpdateUser = document.getElementById('sectionUpdateUser');
const loginForm = document.getElementById('loginForm');
const loginPseudo = document.getElementById('loginPseudo');


let currentUser = null;

const words = [
                "javascript", 
                "ordinateur", 
                "programmation", 
                "developpeur", 
                "internet",
                "telephone",
                "angular",
                "django"
            ];
let secretWord;
let hiddenWordArray;
// let attempts = 0;
let score = 0;
let successStreak = 0;
let failStreak = 0;


function initializeGame() {
    secretWord = words[Math.floor(Math.random() * words.length)];
    hiddenWordArray = motSecret(secretWord);
    // attempts = 0;
    document.getElementById('hiddenWord').textContent = hiddenWordArray.join(' ');
    document.getElementById('message').textContent = '';
    document.getElementById('guessInput').disabled = false;
    // console.log("Mot secret (à des fins de test) :", secretWord); // Afficher le mot secret dans la console pour le test
}


let users = JSON.parse(localStorage.getItem('users')) || [];
let highScores = JSON.parse(localStorage.getItem('highScores')) || [];


let srcImg = ''
document.addEventListener('DOMContentLoaded', (event) => {

    const images = document.querySelectorAll('.profileDiv .profile');

    images.forEach(image => {
        image.addEventListener('click', () => {
            images.forEach(img => img.classList.remove('selected'));
            image.classList.add('selected');

            srcImg = image.src;
        });
    });
});



// Gestion de la connexion
loginForm.addEventListener('submit', function (event) {

    let image = document.createElement('img')
    event.preventDefault();
    const pseudo = loginPseudo.value.trim();

    currentUser = users.find(user => user.pseudo === pseudo);
    if (currentUser) {
        SectionDevinette.style.display = "block"
        sectionLogin.style.display = 'none';
        // sectionUpdateUser.style.display = '';
        image.src = currentUser.imageSrc;
        console.log(image);
        imageDiv.appendChild(image)
        pseudoName.innerHTML = currentUser.pseudo;
    } else {
        alert('Utilisateur non trouvé.');
        return
    }
});



// Creer un compte
function createCompte() {

    let pseudo = pseudoInput.value;
    let image = document.createElement('img')
    image.src = '' + srcImg + '';
    image.alt = srcImg;


    if (!pseudo || !image) {
        alert("Veuillez entrez le nom et la photo ");
        return
    }

    currentUser = users.find(user => user.pseudo === pseudo);

    // alert(image)
    if (currentUser) {
        alert("Le Joueur existe")
        // createCompte()
    } else {
        accueil.style.display = "none"
        // SectionDevinette.style.display = "block"
        sectionCreateUser.style.display = "none";
        sectionLogin.style.display = "block"

        imageDiv.appendChild(image);
        pseudoName.innerHTML = pseudo
        console.log(pseudoName);
        // const reader = new FileReader();

        const user = {
            pseudo: pseudo,
            imageSrc: image.src,
            score: 0
        };

        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
    }

}


btnCreateValider.addEventListener('click', () => {
    createCompte();
})


function btnLoginA() {
    accueil.style.display = "none";
    sectionLogin.style.display = "block"
}

function btnCreateA() {
    accueil.style.display = "none";
    sectionLogin.style.display = "none"
    sectionCreateUser.style.display = "flex"
}




// ****************************************************

function motSecret(word) {
    let hiddenArray = [];
    for (let i = 0; i < word.length; i++) {
        if (i < 3 || i === word.length - 1) {
            hiddenArray.push('*');
        } else {
            hiddenArray.push(word[i]);
        }
    }
    return hiddenArray;
}

function makeGuess() {
    const userGuess = document.getElementById('guessInput').value.toLowerCase();
    const messageElement = document.getElementById('message');

    // attempts++;

    if (userGuess === secretWord) {
        successStreak++;
        failStreak = 0;
        messageElement.textContent = "Félicitations ! Vous avez deviné le mot.";

        // score += calculateScore(attempts);
        if (successStreak % 5 === 0) {
            score += (successStreak / 5) * 10;
        } 
        score +=1; 
        updateScore();
        document.getElementById('guessInput').disabled = true; // Désactiver l'entrée après la bonne réponse
        saveScore(score); 
        setTimeout(initializeGame, 1000); // Réinitialiser le jeu après 1 secondes
    } else {

        failStreak++;
        successStreak = 0;
        if (failStreak <= 2) {
            score--;
        } else if (failStreak === 3) {
            score = Math.max(0, score - Math.floor(score / 5));
        } else if (failStreak === 5) {
            alert("5 essaie")
            initializeGame(); // Générer un nouveau mot immédiatement
        }

        updateScore();
        saveScore(score);
        setTimeout(initializeGame, 1000)
        messageElement.textContent = "Mauvaise réponse, un nouveau mot a été généré.";
    }

    document.getElementById('guessInput').value = ''; // Réinitialiser le champ de saisie
}

function updateScore() {
    document.getElementById('scoreValue').textContent = score;
}

function saveScore(score) {
    const pseudo = loginPseudo.value.trim();

    currentUser = users.findIndex(user => user.pseudo === pseudo);
    users[currentUser].score += score
    localStorage.setItem("users", JSON.stringify(users));
}

// Récupérer le score depuis le stockage local au chargement de la page
if (localStorage.getItem('score')) {
    score = parseInt(localStorage.getItem('score'));
    updateScore();
}

Sectionleaderboard.style.display = "none";

function displayHighScores() {
    accueil.style.display = "none"
    Sectionleaderboard.style.display = "block";
    const scoreList = document.getElementById('score-list');
    scoreList.innerHTML = ''; // Vider la liste actuelle

    // Trier les scores en ordre décroissant
    const sortedUsers = [...users].sort((a, b) => b.score - a.score);

    // Ajouter chaque score dans la liste
    const tr = document.createElement('tr');
    sortedUsers.forEach(user => {
        const td = document.createElement('td');
        const td2 = document.createElement('td');
        const image = document.createElement('img');
        image.src = user.imageSrc;
        image.style.width = "50px"

        image.src = user.imageSrc
        tr.appendChild(image)

        td2.innerText = user.pseudo
        tr.appendChild(td2)

        td.innerHTML = user.score
        tr.appendChild(td)

        // console.log(image);
        // scoreItem.textContent = `${user.pseudo}: ${user.score}`;
        scoreList.appendChild(tr);
    });
}


// Initialiser le jeu au chargement de la page
initializeGame();