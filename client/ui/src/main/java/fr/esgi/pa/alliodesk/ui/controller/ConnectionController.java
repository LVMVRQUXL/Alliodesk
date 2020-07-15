package fr.esgi.pa.alliodesk.ui.controller;

import fr.esgi.pa.alliodesk.core.request.ConnectionRequest;
import fr.esgi.pa.alliodesk.ui.AlliodeskMainLayout;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.Label;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;

import java.io.IOException;

import static javafx.scene.paint.Color.GREEN;
import static javafx.scene.paint.Color.RED;

public class ConnectionController {
    private ConnectionRequest conn;
    @FXML
    private TextField login;
    @FXML
    private PasswordField pwd;
    @FXML
    private Label infoLabel;

    @FXML
    private void logIn(ActionEvent event) {
        event.consume();
        this.conn = new ConnectionRequest(login.getText(), pwd.getText());
        int status_code = this.conn.requestToServe();
        switch (status_code) {
            case 200:
                infoLabel.setTextFill(GREEN);
                infoLabel.setText("Created");
                break;
            case 404:
                infoLabel.setTextFill(RED);
                infoLabel.setText("Can't find user");
                break;
            case 400:
                infoLabel.setTextFill(RED);
                infoLabel.setText("Invalid login and/or password");
                break;
            case 500:
                infoLabel.setTextFill(RED);
                infoLabel.setText("An internal error has occurred");
                break;
            default:
                infoLabel.setTextFill(RED);
                infoLabel.setText("You are already connected with another account");
                break;
        }
    }

    @FXML
    private void signUp(ActionEvent event) throws IOException {
        event.consume();
        AlliodeskMainLayout.showRegisterLayout();
    }

}
