package fr.esgi.pa.alliodesk.ui;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.image.Image;
import javafx.stage.Stage;

public class AlliodeskMainLayout extends Application {
    @Override
    public void start(Stage primaryStage) throws Exception {
        Parent root = FXMLLoader.load(Main.class.getResource("/AlliodeskLayout.fxml"));
        Scene scene = new Scene (root);
        primaryStage.getIcons().add(new Image(Main.class.getResourceAsStream("/AlliodeskLogo.png")));
        primaryStage.setTitle("Alliodesk");
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
