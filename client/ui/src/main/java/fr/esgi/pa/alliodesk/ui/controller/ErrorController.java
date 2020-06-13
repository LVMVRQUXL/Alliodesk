package fr.esgi.pa.alliodesk.ui.controller;

import fr.esgi.pa.alliodesk.core.request.AllioErrorRequest;
import fr.esgi.pa.alliodesk.core.request.ServiceErrorRequest;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.ChoiceBox;
import javafx.scene.control.Label;
import javafx.scene.control.TextArea;

import static javafx.scene.paint.Color.WHITE;

public class ErrorController {
    ObservableList list = FXCollections.observableArrayList();
    ServiceErrorRequest er;
    AllioErrorRequest ar;
    @FXML
    private TextArea textError;

    @FXML
    private Label responseLabel;

    @FXML
    private ChoiceBox<String> servicesChoice;

    @FXML
    public void initialize() {
        loadServices();
    }

// Ajout des String des services en dur pour le moment
// Plus tard, on pourra utiliser directement une liste qui
// sera renvoyée par l'api pour avoir les noms exacts des service en base

    @FXML
    public void loadServices() {
        list.clear();
        String allio = "Alliodesk";
        String todo = "ToDo";
        list.addAll(allio, todo);
        servicesChoice.getItems().addAll(list);
        servicesChoice.setValue(allio);
    }

    @FXML
    void submitError(ActionEvent event) {
        event.consume();
        if (servicesChoice.getValue().equals("Alliodesk")) {
            ar = new AllioErrorRequest(textError.getText());
            int status_code = this.ar.requestToServe();
            statusResponse(status_code);
        } else {
            er = new ServiceErrorRequest(servicesChoice.getValue(), textError.getText());
            int status_code = this.er.requestToServe();
            statusResponse(status_code);
        }

    }

    private void statusResponse(int status_code) {
        switch (status_code) {
            case 201:
                responseLabel.setTextFill(WHITE);
                responseLabel.setText("Error successfully created");
                break;
            case 400:
                responseLabel.setTextFill(WHITE);
                responseLabel.setText("Invalid error's message");
                break;
            case 409:
                responseLabel.setTextFill(WHITE);
                responseLabel.setText("Conflict encountered");
                break;
            case 500:
                responseLabel.setTextFill(WHITE);
                responseLabel.setText("An internal error has occurred");
                break;
        }
    }

}
