package fr.esgi.pa.alliodesk.ui.controller;

import fr.esgi.pa.alliodesk.core.request.ServiceRequest;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;

import static javafx.scene.paint.Color.GREEN;
import static javafx.scene.paint.Color.RED;

public class SendServiceController {

    @FXML
    private TextField name;

    @FXML
    private TextField version;

    @FXML
    private TextField githubLink;

    @FXML
    private Label resultLabel;

    @FXML
    private TextField xmlLink;

    @FXML
    void sendService(ActionEvent event) {
        ServiceRequest serviceRequest = new ServiceRequest("sendService", null, name.getText(), version.getText(),githubLink.getText(), xmlLink.getText());
        int status_code = serviceRequest.requestToServe();
        switch (status_code) {
            case 201:
                resultLabel.setTextFill(GREEN);
                resultLabel.setText("New service submitted");
                break;
            case 400:
                resultLabel.setTextFill(RED);
                resultLabel.setText("Invalid input(s)");
                break;
            case 401:
                resultLabel.setTextFill(RED);
                resultLabel.setText("Invalid user's token session");
                break;
            case 409:
                resultLabel.setTextFill(RED);
                resultLabel.setText("A service with the given name already exists");
                break;
            case 500:
                resultLabel.setTextFill(RED);
                resultLabel.setText("An internal error has occurred");
                break;
        }

    }

}
