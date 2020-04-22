# Alliodesk


## Table des matières

- [Description fonctionnel](#description-fonctionnel)
    - [A retenir](#a-retenir)
- [Plugins](#plugins)
- [Organisation du projet](#organisation-du-projet)
- [Contribuer](#contribuer)
    - [Pré-requis](#pré-requis)
    - [Lancement en environnement de développement](#lancement-en-environnement-de-développement)
    - [Utilisation de Git](#utilisation-de-git)
- [Liste des technologies](#liste-des-technologies)
    - [API RESTful](#api-restful)
    - [Database](#database)
    - [Client](#client)
    - [Frontend](#frontend)
    - [Autres outils](#autres-outils)
- [Auteurs](#auteurs)


## Description fonctionnel

*Alliodesk* est un outil tout-en-un réunissant plusieurs services qui faciliteront
la vie des travailleurs soucieux de leur productivité.

Grâce à ses principaux services, ce logiciel offre la possibilité de gérer ses
tâches quotidiennes avec une liste de tâches (*todolist*), de planifier ses événements
quotidiens dans un planning, ainsi qu'un simple tableau *kanban* permettant
d'organiser au mieux les étapes d'un projet, et bien d'autres.

De plus, *Alliodesk* est complètement personnalisable par les utilisateurs. 
Par exemple, un utilisateur ne souhaitant pas utiliser le service *todolist* aura 
la possibilité de le supprimer. 
D'autres services développés par notre équipe ou bien par la communauté *Alliodesk*, 
mis à disposition sur un site web dédié, seront proposés dans l'application. 
Nous voulons vous offrir une expérience utilisateur unique adaptée 
à vos besoins. 
A ce sujet, les utilisateurs pourront aussi changer le thème de l'application 
(ex : light mode, dark mode...).

**Notre souhait : créer une application utile qui vous ressemble !**

Si vous rencontrez des problèmes liés à son utilisation, n'hésitez pas à nous 
les communiquez grâce au formulaire inclus dans l'application.


### A retenir

- outil tout-en-un ;
- 3 services par défaut : todolist, planning et tableau kanban ;
- application personnalisable (thème, ajout ou suppression de services disponibles) ;
- formulaire de soumission d'erreur ;
- un site dédié à la gestion de nouveaux services.


## Plugins

Dans ce projet, nous considérons l’ensemble des services offerts par *Alliodesk* comme 
des plugins : les utilisateurs auront la possibilité de les supprimer ou les ajouter 
selon leur utilisation. Ainsi, ce programme contiendra par défaut 3 services activés : 
*todolist*, *planning*, tableau *kanban*. 
Notre équipe se chargera aussi de développer de nouveaux services disponibles à l’ajout, 
tels qu’un calendrier ou un bloc-notes, par exemple.

De plus, les utilisateurs pourront aussi créer et développer de nouveaux services en 
respectant certaines contraintes et en suivant les directives qui seront énoncées sur 
le site web recensant la totalité des services. 
Une fois créée, le service sera soumis à une vérification brève de la part de notre 
équipe (on pourrait ainsi développer un programme validant ou non le service développé), 
puis il sera ajouté dans la liste des services recensés sur le site dédié ainsi que 
dans l’application sous la forme de proposition (lorsqu’un utilisateur souhaite ajouter 
un nouveau service).


## Organisation du projet

Ce projet est divisé en trois modules :
- le module **api** contient uniquement les fichiers relatifs au développement de
l'API RESTful ;
- le module **client** contient uniquement les fichiers relatifs au développement de
l'application ***Alliodesk*** et son interface utilisateur ; 
- le module **frontend** contient uniquement les fichiers relatifs au développement du
site web, qui est à la fois le marketplace réunissant tous les services disponibles et
la plateforme administrateur permettant à l'équipe ***Alliodesk*** de gérer l'ensemble
des demandes utilisateurs (ex : erreurs remontés par les utilisateurs, soumission de
service...).

**ATTENTION :** les modules **client** et **frontend** ne peuvent pas fonctionner
convenablement sans le module **api** ! Son existence est donc nécessaire à ces deux modules.


## Contribuer

Cette section correspond à toutes les informations importantes à prendre en
compte pour contribuer à ce projet.


### Pré-requis

Après avoir cloné le dépôt, vous devez créer les fichiers d'environnements nécessaires 
au bon fonctionnement des scripts pour être capable de lancer le projet localement.

Concernant le module **"parent"** (donc l'ensemble des modules du projet), vous devez
créer un fichier `.env` contenant les variables suivantes :
- `POSTGRES_USER` : correspond au profil utilisateur *PostgreSQL* à utiliser (nécessaire 
pour le module **database**) ;
- `POSTGRES_PASSWORD` : correspond au mot de passe de ce profil utilisateur (nécessaire 
pour le module **database**) ;
- `POSTGRES_DB` : correspond au nom de la base de données qui sera créée (nécessaire 
pour le module **database**).


### Lancement en environnement de développement

Après avoir respecté les différents pré-requis signalés précédemment, vous serez en mesure
de lancer le projet en environnement de développement grâce à la commande suivante :
```bash
docker-compose up --build
```

Il est conseillé d'utiliser cette commande avec l'option `--build`, car elle vous permettra
de recréer une image *Docker* des services énumérés dans le fichier `docker-compose.yml`,
et donc d'écraser l'ancienne image de celles-ci (si elles existaient déjà bien sûr).


### Utilisation de Git

Cette section concerne les différentes informations liées au versioning du projet
avec Git.


#### Workflow

Le workflow choisi par notre équipe est le 
[Git flow](https://nvie.com/posts/a-successful-git-branching-model/).


#### Message des commits

Concernant le message des commits avec Git, nous avons choisi de respecter
le pattern suivant :

```bash
<type>(<scope>): [<trello-card-id>] <gitmoji> <short-description>
```

Pour plus d'information sur les différents `<type>`,
vous pouvez visiter l'article suivant : 
[Karma's article about Git Commit Msg](http://karma-runner.github.io/4.0/dev/git-commit-msg.html).

Les différents `<scope>` et `<trello-card-id>` sont définis à la création de la carte
correspondante dans le tableau *Trello* de notre équipe.

Pour plus d'information sur les différents `<gitmoji>`,
vous pouvez visiter le site suivant : 
[Gitmoji website](https://gitmoji.carloscuesta.me/).


#### Nom d'une feature ou d'un hotfix

Concernant le nom d'une branche du type `feature` ou `hotfix` avec Git, nous avons
choisi de respecter les patterns suivants :
- `feature/<trello-card-id>` ;
- `hotfix/<trello-card-id>`.


## Liste des technologies


### API RESTful

- [Node.js 12.16.1](https://nodejs.org/en/) ;
- [Sequelize 5.21.5](https://www.npmjs.com/package/sequelize/v/5.21.5) ;
- [Express 4.17.1](https://www.npmjs.com/package/express/v/4.17.1) ;
- [Dotenv 8.2.0](https://www.npmjs.com/package/dotenv/v/8.2.0) ;
- [Body-parser 1.19.0](https://www.npmjs.com/package/body-parser/v/1.19.0) ;
- [Mocha 7.1.1](https://www.npmjs.com/package/mocha/v/7.1.1).


### Client

- [OpenJDK 11](https://adoptopenjdk.net/?variant=openjdk11&jvmVariant=hotspot) ;
- [JavaFX 11](https://openjfx.io/) ;
- [JUnit 5](https://junit.org/junit5/) ;
- [Maven](https://maven.apache.org/).


### Frontend

- [Angular CLI 9.0.7](https://www.npmjs.com/package/@angular/cli/v/9.0.7).


### Autres outils

- [PostgreSQL 12.2-alpine](https://hub.docker.com/_/postgres) ;
- [Git](https://git-scm.com/) ;
- [Github](https://github.com/) ;
- [Github Actions](https://github.com/features/actions) ;
- [Docker](https://www.docker.com/) ;
- [Trello](https://trello.com/fr).


## Auteurs

Ce projet a été imaginé et développé par :
- KANTE Cheick ;
- HUANG Hervé ;
- LAMARQUE Loïc.

