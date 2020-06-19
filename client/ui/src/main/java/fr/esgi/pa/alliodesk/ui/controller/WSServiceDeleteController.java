package fr.esgi.pa.alliodesk.ui.controller;

import fr.esgi.pa.alliodesk.core.request.ServiceRequest;
import fr.esgi.pa.alliodesk.core.request.WorkspaceManager;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.ChoiceBox;

import java.util.ArrayList;

public class WSServiceDeleteController {

    private ArrayList<ServiceRequest.Service> myList;
    @FXML
    public ChoiceBox<ServiceRequest.Service> wSList;

    @FXML
    public void initialize() {
        WSController wSC = new WSController();
        this.myList = wSC.findAllServiceWorkspace("1");
        ObservableList<ServiceRequest.Service> allMyWS = FXCollections.observableArrayList();
        allMyWS.addAll(this.myList);
        this.wSList.setItems(allMyWS);
    }

    @FXML
    void deleteWorkspaceServiceUsingId(ActionEvent event) {
        WorkspaceManager wSM = new WorkspaceManager("deleteServiceFromWorkspace", null, null, "1", wSList.getValue().getId());
        int status_code = wSM.requestToServe();
        switch (status_code) {
            case 200:
                System.out.println("Ok");
                break;
            case 204:
                System.out.println("No services to return");
                break;
            case 400:
                System.out.println("Invalid workspace id");
                break;
            case 404:
                System.out.println("Can't find workspace from id");
                break;
            case 500:
                System.out.println("An internal error has occurred");
                break;
            default:
                System.out.println("status code = " + status_code);
                break;
        }
    }


}
