

package fr.esgi.pa.alliodesk.ui;

import fr.esgi.pa.alliodesk.ui.service.ExtensionGetter;

import java.io.IOException;

import javafx.application.Application;
import javafx.application.HostServices;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.control.SplitPane;
import javafx.scene.image.Image;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.BorderPane;
import javafx.stage.Stage;

public class AlliodeskMainLayout extends Application {
    private Stage primaryStage;
    private static BorderPane rootLayout;
    private static HostServices hostServices;
    private static FXMLLoader loader;

    public AlliodeskMainLayout() {}

    public static HostServices getHostService() {
        return hostServices;
    }

    @Override
    public void start(Stage primaryStage) throws Exception {
        this.primaryStage = primaryStage;
        this.primaryStage.setTitle("Alliodesk");
        hostServices = getHostServices();
        initRootLayout();
        showRegisterLayout();
    }

    private void initRootLayout() throws IOException {
        FXMLLoader loader = new FXMLLoader();
        loader.setLocation(AlliodeskMainLayout.class.getResource("/AlliodeskLayoutView.fxml"));
        rootLayout = loader.load();
        Scene scene = new Scene(rootLayout);
        primaryStage.getIcons().add(new Image(AlliodeskMainLayout.class.getResourceAsStream("/AlliodeskLogo.png")));
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    public static void showRegisterLayout() throws IOException {
        loader = new FXMLLoader();
        loader.setLocation(Main.class.getResource("/RegisterView.fxml"));
        AnchorPane RegisterOverview = loader.load();
        rootLayout.setCenter(RegisterOverview);
    }

    public static void showErrorLayout() throws IOException {
        loader = new FXMLLoader();
        loader.setLocation(Main.class.getResource("/ErrorView.fxml"));
        AnchorPane RegisterOverview = loader.load();
        rootLayout.setCenter(RegisterOverview);
    }


    static void showServiceLayout(String appName) throws IOException, ReflectiveOperationException {
        ExtensionGetter eg = new ExtensionGetter(appName);
        loader = new FXMLLoader(eg.getUrl());
        loader.setController(eg.getController());
        SplitPane ServiceOverview = loader.load();
        rootLayout.setCenter(ServiceOverview);
    }

    public static void showConnectionLayout() throws IOException {
        loader = new FXMLLoader();
        loader.setLocation(Main.class.getResource("/ConnectionView.fxml"));
        AnchorPane RegisterOverview = loader.load();
        rootLayout.setCenter(RegisterOverview);
    }

    public static void showCreateWSLayout() throws IOException {
        loader = new FXMLLoader();
        loader.setLocation(Main.class.getResource("/WSCreationView.fxml"));
        AnchorPane RegisterOverview = loader.load();
        rootLayout.setCenter(RegisterOverview);
    }

    public static void showUpdateWSLayout() throws IOException {
        loader = new FXMLLoader();
        loader.setLocation(Main.class.getResource("/WSUpdate.fxml"));
        AnchorPane RegisterOverview = loader.load();
        rootLayout.setCenter(RegisterOverview);
    }

    public static void showDeleteWSLayout() throws IOException {
        loader = new FXMLLoader();
        loader.setLocation(Main.class.getResource("/WSDelete.fxml"));
        AnchorPane RegisterOverview = loader.load();
        rootLayout.setCenter(RegisterOverview);
    }

    public static void showAddServiceIntoWS() throws IOException {
        loader = new FXMLLoader();
        loader.setLocation(Main.class.getResource("/AddServiceIntoWS.fxml"));
        AnchorPane RegisterOverview = loader.load();
        rootLayout.setCenter(RegisterOverview);

    }

    public static void showDeleteServiceIntoWS() throws IOException {
        loader = new FXMLLoader();
        loader.setLocation(Main.class.getResource("/WSServiceDelete.fxml"));
        AnchorPane deleteOverview = loader.load();
        rootLayout.setCenter(deleteOverview);
    }

    public static void showFeedbackLayout() throws IOException {
        FXMLLoader loader = new FXMLLoader();
        loader.setLocation(Main.class.getResource("/FeedBackView.fxml"));
        AnchorPane RegisterOverview = loader.load();
        rootLayout.setCenter(RegisterOverview);
    }

    public static void showUserUpdateLayout() throws IOException {
        FXMLLoader loader = new FXMLLoader();
        loader.setLocation(Main.class.getResource("/UpdateUserView.fxml"));
        AnchorPane RegisterOverview = loader.load();
        rootLayout.setCenter(RegisterOverview);
    }

    public static void showSendService() throws IOException{
        FXMLLoader loader = new FXMLLoader();
        loader.setLocation(Main.class.getResource("/SendServiceView.fxml"));
        AnchorPane sendSendOverview = loader.load();
        rootLayout.setCenter(sendSendOverview);
    }
    public static void main(String[] args) {
        launch(args);

    }
}
