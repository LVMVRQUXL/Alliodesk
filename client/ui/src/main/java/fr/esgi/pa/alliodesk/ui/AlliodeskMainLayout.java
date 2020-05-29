package fr.esgi.pa.alliodesk.ui;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.control.SplitPane;
import javafx.scene.image.Image;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.BorderPane;
import javafx.stage.Stage;

import java.io.IOException;

public class AlliodeskMainLayout extends Application {
    private Stage primaryStage;
    private static BorderPane rootLayout;

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
        rootLayout = loader.load();
        Scene scene = new Scene(rootLayout);
        primaryStage.getIcons().add(new Image(Main.class.getResourceAsStream("/AlliodeskLogo.png")));
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    public static void showRegisterLayout() throws IOException {
        FXMLLoader loader = new FXMLLoader();
        loader.setLocation(Main.class.getResource("/RegisterView.fxml"));
        AnchorPane RegisterOverview = loader.load();
        rootLayout.setCenter(RegisterOverview);
    }

    static void showToDoListLayout() throws IOException {
        ExtensionGetter eg = new ExtensionGetter();
        eg.load();
        FXMLLoader loader = new FXMLLoader(eg.url);
        loader.setController(eg.controller);
        SplitPane TodoOverview = loader.load();
        rootLayout.setCenter(TodoOverview);
    }

    public static void showConnectionLayout() throws IOException {
        FXMLLoader loader = new FXMLLoader();
        loader.setLocation(Main.class.getResource("/ConnectionView.fxml"));
        AnchorPane RegisterOverview = (AnchorPane) loader.load();
        rootLayout.setCenter(RegisterOverview);
    }

    public static void main(String[] args) {
        launch(args);
    }
}
