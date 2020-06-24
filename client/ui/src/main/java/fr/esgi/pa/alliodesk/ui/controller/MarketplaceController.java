package fr.esgi.pa.alliodesk.ui.controller;

import fr.esgi.pa.alliodesk.core.request.ServiceRequest;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.ChoiceBox;
import javafx.scene.control.MenuItem;

import java.util.ArrayList;

public class MarketplaceController {
    private ObservableList<ServiceRequest.Service> list = FXCollections.observableArrayList();
    @FXML
    private ChoiceBox<String> servicesChoice;
    @FXML
    public void initialize() {
        loadService();
    }

    private void loadService(){
        list.clear();
        list.addAll(findAllService());
        if (list.size() > 0) {
            for (ServiceRequest.Service service : list) {
                MenuItem i = new MenuItem(service.getName());
                servicesChoice.getItems().add(service.getName());
            }
            servicesChoice.setValue(servicesChoice.getItems().get(0));
        } else {
            servicesChoice.setValue("Aucun service trouvé");
        }
    }

    @FXML
    void addService(ActionEvent event) {

    }

    public static ArrayList<ServiceRequest.Service> findAllService(){
        ServiceRequest serviceRequest = new ServiceRequest("findAllService", null);
        int status_code = serviceRequest.requestToServe();
        switch (status_code) {
            case 200:
                System.out.println("Ok");
                return serviceRequest.getExistedService();
            case 204:
                System.out.println("No services to return");
                return new ArrayList<ServiceRequest.Service>();
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
