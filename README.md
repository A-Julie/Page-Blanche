# Page Blanche – Le début de votre histoire

Page Blanche est un site de rencontre narratif où l'on ne swipe pas sur des profils, mais sur des univers à co-créer. Chaque utilisateur incarne un personnage imaginé, accompagné d'un pitch, d'un plot twist ou d'un simple fragment d'histoire. Les autres membres, s'ils sont touchés ou intrigués, peuvent rejoindre l'aventure en ajoutant leur propre personnage et en tissant ensemble une narration commune.

Ce n'est pas juste une rencontre, c'est un récit qui s'écrit à deux, à trois, ou plus : une page blanche à remplir à plusieurs plumes.

🎭 Crée ton rôle.
📖 Lance ton histoire.
💌 Rencontre à travers la fiction.

## Fonctionnalités

- Page d'accueil
- Inscription (pronom, nom de profil, date de naissance, email, mot de passe)
- Connexion
- Header et footer communs à toutes les pages

> Le projet est en cours de développement : la création de personnages, les pitchs et la co-écriture arrivent prochainement.

## Technologies

- [Angular](https://angular.dev/) 20 (composants standalone, mode zoneless)
- Rendu côté serveur (SSR) avec `@angular/ssr` et Express
- Formulaires réactifs (`ReactiveFormsModule`)
- SCSS
- Tests unitaires avec Karma et Jasmine

## Prérequis

- Node.js `^20.19.0` ou `^22.12.0`
- npm
- Angular CLI (`npm install -g @angular/cli`)

## Installation

```bash
git clone https://github.com/A-Julie/page-blanche.git
cd page-blanche
npm install
```

## Lancer le projet

Serveur de développement :

```bash
npm start
```

L'application est accessible sur `http://localhost:4200/` et se recharge automatiquement à chaque modification.

## Build et SSR

```bash
npm run build
npm run serve:ssr:page-blanche
```

Le build est généré dans `dist/`, le serveur SSR écoute sur `http://localhost:4000`.

## Tests

```bash
npm test
```

## Structure du projet

```
src/
├── app/
│   ├── components/     # header, footer
│   ├── pages/          # home, login-form, register
│   ├── app.routes.ts   # routes de l'application
│   └── app.config.ts   # configuration Angular
├── main.ts             # point d'entrée navigateur
├── main.server.ts      # point d'entrée serveur (SSR)
└── server.ts           # serveur Express
```

## Contribuer

1. Créer une branche depuis `main` (`feature/...`, `fix/...`, `docs/...`)
2. Faire des commits clairs ([Conventional Commits](https://www.conventionalcommits.org/fr/))
3. Ouvrir une Pull Request vers `main`

## Licence

Projet sous licence MIT. Voir le fichier [LICENSE](LICENSE).
