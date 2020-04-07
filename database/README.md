# Database

## Pré-requis

Avant de pouvoir lancer l'image *Docker* du module **database**, vous devez avoir un fichier
nommé `env_file`, à la racine du module `./database`.
Ce fichier doit contenir les 3 variables suivantes :
- `POSTGRES_USER` : correspond au profil utilisateur *PostgreSQL* à utiliser ;
- `POSTGRES_PASSWORD` : correspond au mot de passe de ce profil ;
- `POSTGRES_DB` : correspond à la base de données qui sera créée.

## Lancement

Pour lancer l'image du module **database** à partir de la racine du projet ***Alliodesk***, 
vous pouvez utiliser les commandes suivantes :
```bash
docker build -t "alliodesk-db:latest" ./database
docker run -p "5432:5432" -v "/database/datas:/var/lib/postgresql" --env-file="./database/env_file" alliodesk-db:latest
```
