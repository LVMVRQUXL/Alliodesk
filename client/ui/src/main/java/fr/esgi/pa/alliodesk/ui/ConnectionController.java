package fr.esgi.pa.alliodesk.ui;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;

import java.io.IOException;

public class ConnectionController {
    private Router router;
    @FXML
    private TextField login;
    @FXML
    private PasswordField pwd;

    @FXML
    public void test(ActionEvent event) throws IOException {
        event.consume();
    }
    @FXML
    public void signUp(ActionEvent event) throws IOException{
        event.consume();
    }




    void setRouter(final Router router) {
        this.router = router;
    }
}
