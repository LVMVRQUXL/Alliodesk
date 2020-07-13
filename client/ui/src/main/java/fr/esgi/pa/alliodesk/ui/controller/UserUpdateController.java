package fr.esgi.pa.alliodesk.ui.controller;

import fr.esgi.pa.alliodesk.core.request.GetUserData;
import fr.esgi.pa.alliodesk.core.request.UserUpdateRequest;
import javafx.fxml.FXML;
import javafx.scene.control.Label;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;

public class UserUpdateController {
    @FXML
    public PasswordField password;
    @FXML
    public TextField name;
    @FXML
    public TextField email;
    @FXML
    public Label resultLabel;

    @FXML
    void initialize(){
        GetUserData gud = new GetUserData();
        gud.requestToServe();
        this.name.setPromptText(gud.getName());
        this.email.setPromptText(gud.getEmail());
    }


    @FXML
    public void updateUser(){
        UserUpdateRequest uur = new UserUpdateRequest(this.name.getText(),this.email.getText(),this.password.getText());
        int status_code = uur.requestToServe();
        switch (status_code){
            case 200:
                resultLabel.setText("success");
                System.out.println("Ok");
                break;
            case 404:
                resultLabel.setText("Can't find user");
                System.out.println("Can't find user");
                break;
            case 400:
                resultLabel.setText("Invalid inputs");
                System.out.println("Invalid inputs");
                break;
            case 500:
                resultLabel.setText("Error");
                System.out.println("An internal error has occurred");
                break;
            default:
                System.out.println("status_code = "+status_code);
                break;
        }
    }
}
