# API


## Lancement

Pour lancer l'image du module **api** à partir de la racine du projet ***Alliodesk***, 
vous pouvez utiliser les commandes suivantes :
```bash
docker build -t "alliodesk-api:latest" ./api
docker run -p "<PORT>:3000" \
        --name "alliodesk-api" \
        alliodesk-api:latest
```
**ATTENTION** : Pensez à remplacer le bloc `<PORT>` par le port sur lequel vous
souhaitez communiquer avec votre container *Docker* !
