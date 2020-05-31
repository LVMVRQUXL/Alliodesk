package fr.esgi.pa.alliodesk.ui;

import com.sun.scenario.effect.impl.sw.java.JSWBlend_GREENPeer;
import fr.esgi.pa.alliodesk.core.Register;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.Label;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;

import java.io.IOException;

import static javafx.scene.paint.Color.GREEN;
import static javafx.scene.paint.Color.RED;


public class RegisterController {
    private Register reg;
    private Router router;
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

    public void registerUser(ActionEvent event) throws IOException {
        event.consume();
        this.reg = new Register(name.getText(), login.getText(), email.getText(), pwd.getText());
        int status_code = this.reg.requestToServe();
        switch (status_code) {
            case 201:
                System.out.println("Created");
                resultLabel.setTextFill(GREEN);
                resultLabel.setText("Created");
                break;
            case 400:
                System.out.println("Invalid inputs");
                resultLabel.setTextFill(RED);
                resultLabel.setText("Invalid inputs");
                break;
            case 409:
                System.out.println("User is already existing");
                resultLabel.setTextFill(RED);
                resultLabel.setText("User is already existing");
                break;
            case 500:
                System.out.println("An internal error has occurred");
                resultLabel.setTextFill(RED);
                resultLabel.setText("An internal error has occurred");
                break;
        }

    }

    void setRouter(final Router router) {
        this.router = router;
    }
}
