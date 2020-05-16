package fr.esgi.pa.alliodesk.ui;

import fr.esgi.pa.alliodesk.core.Register;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;

import java.io.IOException;


public class RegisterController {
    Register reg;
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
    public void test(ActionEvent event) throws IOException {
        event.consume();
        this.reg = new Register(name.getText(), login.getText(), email.getText(), new String(pwd.getText()));
        int status_code = this.reg.requestToServe();
        //VERIFICATION / ACTION SUITE
        switch (status_code) {
            case 201:
                System.out.println("Created");
                break;
            case 400:
                System.out.println("Invalid inputs");
                break;
            case 409:
                System.out.println("User is already existing");
                break;
            case 500:
                System.out.println("An internal error has occurred");
                break;
        }

    }

    void setRouter(final Router router) {
        this.router = router;
    }
}
