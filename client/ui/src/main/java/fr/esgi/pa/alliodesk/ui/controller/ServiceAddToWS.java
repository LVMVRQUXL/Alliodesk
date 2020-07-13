package fr.esgi.pa.alliodesk.ui.controller;

import fr.esgi.pa.alliodesk.core.models.Service;
import fr.esgi.pa.alliodesk.core.request.ServiceRequest;
import fr.esgi.pa.alliodesk.core.request.WorkspaceRequest;
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
        ServiceRequest serviceRequest = new ServiceRequest("findUserAllServices",null,null,null,null,null);
        serviceRequest.requestToServe();
        ArrayList<Service> myServices = serviceRequest.getExistedService();
        ObservableList<ChoiceBoxItem> allMyWS = FXCollections.observableArrayList();
        for (Service tab : myServices) {
            ChoiceBoxItem item = new ChoiceBoxItem(tab.getId(), tab.getName());
            allMyWS.add(item);
        }
        this.serviceList.setItems(allMyWS);
    }

    public void addService(){
        System.out.println("currentID = "+currentID);
        System.out.println("currentID = "+AlliodeskMainLayoutController.getWorkspaceId() );
        WorkspaceRequest wSM = new WorkspaceRequest("addServiceToWS",null,null,currentID,serviceList.getValue().getId());
        int status_code = wSM.requestToServe();
        switch (status_code) {
            case 201:
                System.out.println("Service successfully added");
                break;
            case 400:
                System.out.println("Invalid inputs");
                break;
            case 404:
                System.out.println("Can't find service or workspace from ids");
                break;
            case 500:
                System.out.println("An internal error has occurred");
                break;
            default:
                System.out.println("status code = " + status_code);
        }

    }


}
