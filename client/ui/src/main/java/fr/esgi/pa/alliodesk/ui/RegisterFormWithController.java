package fr.esgi.pa.alliodesk.ui;

import javafx.application.Application;
import javafx.stage.Stage;

public class RegisterFormWithController extends Application {
    private Router router;

    @Override
    public void start(final Stage stage) {
        this.router = new Router(stage);
        router.goTo("Register");

        stage.setTitle("Register Form");
        stage.show();
    }

    public static void main(final String[] args) {
        launch(args);
    }
}
