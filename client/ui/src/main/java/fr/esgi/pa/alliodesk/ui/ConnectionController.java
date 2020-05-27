package fr.esgi.pa.alliodesk.ui;


import fr.esgi.pa.alliodesk.core.Connection;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;

import java.io.IOException;


public class ConnectionController {
    private Connection conn;
    private Router router;
    @FXML
    private TextField login;
    @FXML
    private PasswordField pwd;

    @FXML
    public void logIn(ActionEvent event) throws IOException {
        event.consume();
        this.conn = new Connection(login.getText(), pwd.getText());
        int status_code = this.conn.requestToServe();
        switch (status_code) {
            case 200:
                System.out.println("Ok");

                break;
            case 404:
                System.out.println("Can't find user");

                break;
            case 400:
                System.out.println("Invalid login and/or password");

                break;
            case 500:
                System.out.println("An internal error has occurred");

                break;
        }
    }

    @FXML
    public void signUp(ActionEvent event) throws IOException {
        event.consume();

    }


    void setRouter(final Router router) {
        this.router = router;
    }
}
