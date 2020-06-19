package fr.esgi.pa.alliodesk.ui.controller;

import fr.esgi.pa.alliodesk.core.request.ServiceRequest;
import fr.esgi.pa.alliodesk.core.request.WorkspaceManager;
import fr.esgi.pa.alliodesk.ui.AlliodeskMainLayoutController;
import fr.esgi.pa.alliodesk.ui.ChoiceBoxItem;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.scene.control.ChoiceBox;

import java.util.ArrayList;

public class ServiceAddToWS{
    @FXML
    private ChoiceBox<ChoiceBoxItem> serviceList;

    private String currentID = AlliodeskMainLayoutController.getWorkspaceId();

    @FXML
    void initialize() {
        System.out.println(currentID);
        ServiceRequest serviceRequest = new ServiceRequest("findUserAllServices",null);
        serviceRequest.requestToServe();
        ArrayList<ServiceRequest.Service> myServices = serviceRequest.getExistedService();
        ObservableList<ChoiceBoxItem> allMyWS = FXCollections.observableArrayList();
        for (ServiceRequest.Service tab : myServices) {
            ChoiceBoxItem item = new ChoiceBoxItem(tab.getId(), tab.getName());
            allMyWS.add(item);
        }
        this.serviceList.setItems(allMyWS);
    }

    public void addService(){
        System.out.println("currentID = "+currentID);
        System.out.println("currentID = "+AlliodeskMainLayoutController.getWorkspaceId() );
        WorkspaceManager wSM = new WorkspaceManager("addServiceToWS",null,null,currentID,serviceList.getValue().getId());
        int status_code = wSM.requestToServe();
        switch (status_code) {
            case 201:
                System.out.println("Service successfully added");
            case 400:
                System.out.println("Invalid inputs");
            case 404:
                System.out.println("Can't find service or workspace from ids");
            case 500:
                System.out.println("An internal error has occurred");
            default:
                System.out.println("status code = " + status_code);
        }

    }


}
