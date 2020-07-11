# Alliodesk - Client

## Lancement de l'application

Pour commencer, il faut générer l'exécutable Java avec Maven. Pour cela, vous
devez exécuter la commande suivante, en vous plaçant à la racine du module
***client*** : `mvn clean package`.
Cette commande va générer l'exécutable de notre application, qui se trouvera
au chemin `client/ui/target/client-ui-shaded.jar`.

Pour lancer l'application à partir de l'archive JAR générée par Maven, vous
devez exécuter la commande suivante : 
`java -DenvFile="<path>/<filename>.env" -jar "./ui/target/client-ui-shaded.jar"`.

L'argument `-DenvFile` permet d'inclure un fichier d'environnement lors de
l'exécution de l'archive JAR.
Pensez à remplacer les balises `<path>` et `<filename>` par le chemin et le nom
du fichier d'environnement correspondants.
