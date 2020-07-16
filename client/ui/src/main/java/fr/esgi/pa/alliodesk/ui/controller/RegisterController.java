package fr.esgi.pa.alliodesk.ui.controller;

import fr.esgi.pa.alliodesk.core.request.RegisterRequest;
import fr.esgi.pa.alliodesk.ui.AlliodeskMainLayout;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.Label;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;

import java.io.IOException;

import static javafx.scene.paint.Color.GREEN;
import static javafx.scene.paint.Color.RED;

public class RegisterController {
    private RegisterRequest reg;
    @FXML
    private TextField name;
    @FXML
    private TextField login;
    @FXML
    private TextField email;
    @FXML
    private PasswordField pwd;
    @FXML
    private Label resultLabel;

    @FXML
    private void registerUser(ActionEvent event) {
        event.consume();
        this.reg = new RegisterRequest(name.getText(), login.getText(), email.getText(), pwd.getText());
        int status_code = this.reg.requestToServe();
        switch (status_code) {
            case 201:
                resultLabel.setTextFill(GREEN);
                resultLabel.setText("Created");
                break;
            case 400:
                resultLabel.setTextFill(RED);
                resultLabel.setText("Invalid inputs");
                break;
            case 409:
                resultLabel.setTextFill(RED);
                resultLabel.setText("User is already existing");
                break;
            case 500:
                resultLabel.setTextFill(RED);
                resultLabel.setText("An internal error has occurred");
                break;
        }
    }

    @FXML
    private void signIn(ActionEvent event) throws IOException {
        event.consume();
        AlliodeskMainLayout.showConnectionLayout();
    }
}
