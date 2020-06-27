package fr.esgi.pa.alliodesk.ui.controller;

import fr.esgi.pa.alliodesk.core.Service;
import fr.esgi.pa.alliodesk.core.request.AllioErrorRequest;
import fr.esgi.pa.alliodesk.core.request.ServiceErrorRequest;
import fr.esgi.pa.alliodesk.core.request.ServiceRequest;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.ChoiceBox;
import javafx.scene.control.Label;
import javafx.scene.control.TextArea;

import java.util.ArrayList;

import static javafx.scene.paint.Color.WHITE;

public class ErrorController {
    private ObservableList<Service> list = FXCollections.observableArrayList();
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


    @FXML
    public void loadServices() {
        list.clear();
        list.addAll(findAllServiceWorkspace());
        if (list.size() > 0) {
            for (Service service : list) {
                servicesChoice.getItems().add(service.getName());
            }
            servicesChoice.setValue(servicesChoice.getItems().get(0));
        } else {
            servicesChoice.setValue("Aucun service trouvé");
        }
    }

    @FXML
    void submitError(ActionEvent event) {
        event.consume();
        if (servicesChoice.getValue().equals("Alliodesk")) {
            AllioErrorRequest allioErrorRequest = new AllioErrorRequest(textError.getText());
            int status_code = allioErrorRequest.requestToServe();
            statusResponse(status_code);
        } else {
            ServiceErrorRequest serviceErrorRequest = new ServiceErrorRequest(servicesChoice.getValue(), textError.getText());
            int status_code = serviceErrorRequest.requestToServe();
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

    public static ArrayList<Service> findAllServiceWorkspace() {
        ServiceRequest serviceRequest = new ServiceRequest("findUserAllServices", null);
        int status_code = serviceRequest.requestToServe();
        switch (status_code) {
            case 200:
                System.out.println("Ok");
                return serviceRequest.getExistedService();
            case 204:
                System.out.println("No services to return");
                return new ArrayList<Service>();
            case 400:
                System.out.println("Invalid workspace id");
                return null;
            case 404:
                System.out.println("Can't find workspace from id");
                return null;
            case 500:
                System.out.println("An internal error has occurred");
                return null;
            default:
                System.out.println("status code = " + status_code);
                return null;
        }
    }

}
