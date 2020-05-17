package fr.esgi.pa.alliodesk.ui;
import fr.esgi.pa.alliodesk.todolist.RunFxMain;
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
        showToDoListLAyout();
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
    public void showToDoListLAyout() throws IOException {
        FXMLLoader loader = new FXMLLoader();
        loader.setLocation(RunFxMain.class.getResource("/Todo.fxml"));
        SplitPane TodoOverview = (SplitPane) loader.load();
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
