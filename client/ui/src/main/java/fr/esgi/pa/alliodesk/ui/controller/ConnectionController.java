package fr.esgi.pa.alliodesk.ui.controller;

import fr.esgi.pa.alliodesk.core.request.ConnectionRequest;
import fr.esgi.pa.alliodesk.ui.AlliodeskMainLayout;
import fr.esgi.pa.alliodesk.ui.Router;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;

import java.io.IOException;

public class ConnectionController {
    private ConnectionRequest conn;
    private Router router;
    @FXML
    private TextField login;
    @FXML
    private PasswordField pwd;

    @FXML
    private void logIn(ActionEvent event) {
        event.consume();
        this.conn = new ConnectionRequest(login.getText(), pwd.getText());
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
            default:
                System.out.println("You are already connected with another account");
                break;
        }
    }

    @FXML
    private void signUp(ActionEvent event) throws IOException {
        event.consume();
        AlliodeskMainLayout.showRegisterLayout();
    }

    void setRouter(final Router router) {
        this.router = router;
    }
}
