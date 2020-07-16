package fr.esgi.pa.alliodesk.ui.controller;

import fr.esgi.pa.alliodesk.core.models.Service;
import fr.esgi.pa.alliodesk.core.request.WorkspaceRequest;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;

import javafx.scene.control.TextField;

import java.util.ArrayList;


public class WSController {

    @FXML
    private TextField name;
    @FXML
    private TextField description;

    public void resetFields(ActionEvent actionEvent) {
        this.name.setText("");
        this.description.setText("");
    }

    @FXML
    public void createWS(ActionEvent actionEvent) {
        WorkspaceRequest wSM = new WorkspaceRequest("create", name.getText(), description.getText(), null,null);
        wSM.requestToServe();

    }

    public ArrayList<String[]> findAllUserWS() {
        WorkspaceRequest wSM = new WorkspaceRequest("findAllUserWS", null, null, null,null);
        int status_code = wSM.requestToServe();
        switch (status_code) {
            case 200:
                return wSM.getExistedWS();
            case 204:
                return new ArrayList<>();
            default:
                return null;
        }
    }
    public static ArrayList<Service> findAllServiceWorkspace(String workspaceId){
        WorkspaceRequest wSM = new WorkspaceRequest("getWorkspaceServices", null, null, workspaceId,null);
        int status_code = wSM.requestToServe();
        switch (status_code) {
            case 200:
                return wSM.getExistedService();
            case 204:
                return new ArrayList<>();
            default:
                return null;
        }
    }
}
