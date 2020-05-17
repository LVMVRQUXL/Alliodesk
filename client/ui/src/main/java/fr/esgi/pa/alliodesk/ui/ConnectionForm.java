package fr.esgi.pa.alliodesk.ui;

import javafx.application.Application;
import javafx.event.ActionEvent;
import javafx.stage.Stage;

public class ConnectionForm extends Application{

        private Router router;

        @Override
        public void start(final Stage stage) {
            this.router = new Router(stage);
            router.<ConnectionController>goTo("Connection", controller -> controller.setRouter(router));

            stage.setTitle("Connection");
            stage.show();
        }

        public static void main(final String[] args) {
            launch(args);
        }



}
