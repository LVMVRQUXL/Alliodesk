package fr.esgi.pa.alliodesk.ui;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.image.Image;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.BorderPane;
import javafx.stage.Stage;

import java.io.IOException;

public class AlliodeskMainLayout extends Application {
    private Stage primaryStage;
    private BorderPane rootLayout;

    @Override
    public void start(Stage primaryStage) throws Exception {
        this.primaryStage = primaryStage;
        this.primaryStage.setTitle("Alliodesk");
        initRootLayout();
        showRegisterLayout();
    }

    private void initRootLayout() throws IOException {
        FXMLLoader loader = new FXMLLoader();
        loader.setLocation(Main.class.getResource("/AlliodeskLayout.fxml"));
        rootLayout = (BorderPane) loader.load();
        Scene scene = new Scene(rootLayout);
        primaryStage.getIcons().add(new Image(Main.class.getResourceAsStream("/AlliodeskLogo.png")));

        primaryStage.setScene(scene);
        primaryStage.show();
    }

    private void showRegisterLayout() throws IOException {
        FXMLLoader loader = new FXMLLoader();
        loader.setLocation(Main.class.getResource("/RegisterView.fxml"));
        AnchorPane RegisterOverview = (AnchorPane) loader.load();
        rootLayout.setCenter(RegisterOverview);
    }

    public static void main(String[] args) {
        launch(args);
    }
}
