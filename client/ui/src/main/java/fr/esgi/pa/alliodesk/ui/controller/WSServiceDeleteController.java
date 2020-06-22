package fr.esgi.pa.alliodesk.ui.controller;

import fr.esgi.pa.alliodesk.core.request.ServiceRequest;
import fr.esgi.pa.alliodesk.core.request.WorkspaceManager;
import fr.esgi.pa.alliodesk.ui.AlliodeskMainLayoutController;
import fr.esgi.pa.alliodesk.ui.ChoiceBoxItem;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.ChoiceBox;
import javafx.scene.control.Label;

import static javafx.scene.paint.Color.*;

import java.util.ArrayList;

public class WSServiceDeleteController {


    private String workspaceId = AlliodeskMainLayoutController.getWorkspaceId();
    @FXML
    public ChoiceBox<ChoiceBoxItem> servicesList;
    @FXML
    private Label deleteLabel;

    @FXML
    public void initialize() {
        WorkspaceManager workspaceManager = new WorkspaceManager("getWorkspaceServices", null, null, workspaceId, null);
        workspaceManager.requestToServe();
        ArrayList<ServiceRequest.Service> myServices = workspaceManager.getExistedService();
        ObservableList<ChoiceBoxItem> allMyWS = FXCollections.observableArrayList();
        if (myServices.size() > 0) {
            for (ServiceRequest.Service tab : myServices) {
                ChoiceBoxItem item = new ChoiceBoxItem(tab.getId(), tab.getName());
                allMyWS.add(item);
            }
            this.servicesList.setItems(allMyWS);
            this.servicesList.setValue(servicesList.getItems().get(0));
        }
    }

    @FXML
    void deleteWorkspaceServiceUsingId(ActionEvent event) {
        String serviceId = servicesList.getValue().getId();
        WorkspaceManager wSM = new WorkspaceManager("deleteServiceFromWorkspace", null, null, workspaceId, serviceId);
        int status_code = wSM.requestToServe();
        switch (status_code) {
            case 200:
                deleteLabel.setTextFill(WHITE);
                deleteLabel.setText("Service successfully delete");
                servicesList.getItems().remove(servicesList.getValue());
                break;
            case 204:
                deleteLabel.setTextFill(WHITE);
                deleteLabel.setText("No services to return");
                break;
            case 400:
                deleteLabel.setTextFill(WHITE);
                deleteLabel.setText("Invalid inputs");
                break;
            case 404:
                deleteLabel.setTextFill(WHITE);
                deleteLabel.setText("Can't find workspace or service from id");
                break;
            case 500:
                deleteLabel.setTextFill(WHITE);
                deleteLabel.setText("An internal error has occurred");
                break;
            default:
                deleteLabel.setTextFill(WHITE);
                deleteLabel.setText("status code = " + status_code);
                break;
        }
    }


}
