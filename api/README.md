# API

## Pré-requis

Avant de pouvoir lancer l'image *Docker* du module **api**, vous devez avoir un fichier
nommé `.env`, à la racine du dossier `./api`.
Ce fichier doit contenir les variables suivantes :
- `API_PORT` : correspond au port sur lequel l'API va écouter les requêtes ;
- `API_HOST` : correspond à l'hôte sur lequel l'API va se lancer (ex : `API_HOST=localhost`).

## Lancement

Pour lancer l'image du module **api** à partir de la racine du projet ***Alliodesk***, 
vous pouvez utiliser les commandes suivantes :
```bash
docker build -t "alliodesk-api:latest" ./api
docker run -p "<API_PORT>:<API_PORT>" \
        --name "alliodesk-api" \
        alliodesk-api:latest
```
**ATTENTION** : Pensez à remplacer les blocs `<API_PORT>` par la valeur de la variable
`API_PORT` présent dans votre fichier `.env` !
