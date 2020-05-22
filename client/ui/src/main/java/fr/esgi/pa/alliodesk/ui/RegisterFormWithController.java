package fr.esgi.pa.alliodesk.ui;

import javafx.application.Application;
import javafx.event.ActionEvent;
import javafx.stage.Stage;

public class RegisterFormWithController extends Application {
    private Router router;

    @Override
    public void start(final Stage stage) {
        this.router = new Router(stage);
        router.<RegisterController>goTo("Register", controller -> controller.setRouter(router));

        stage.setTitle("Register Form");
        stage.show();
    }
}
