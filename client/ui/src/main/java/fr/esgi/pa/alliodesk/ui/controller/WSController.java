package fr.esgi.pa.alliodesk.ui.controller;

import fr.esgi.pa.alliodesk.core.Service;
import fr.esgi.pa.alliodesk.core.request.ServiceRequest;
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
        int status_code = wSM.requestToServe();
        switch (status_code) {
            case 201:
                System.out.println("Created");
                break;
            case 400:
                System.out.println("Invalid workspace's name or description");
                break;
            case 401:
                System.out.println("Token Unauthorized");
                break;
            case 500:
                System.out.println("An internal error has occurred");
                break;
            default:
                System.out.println("status code = " + status_code);
                break;
        }
    }

    public ArrayList<String[]> findAllUserWS() {
        WorkspaceRequest wSM = new WorkspaceRequest("findAllUserWS", null, null, null,null);
        int status_code = wSM.requestToServe();
        switch (status_code) {
            case 200:
                System.out.println("Ok");
                return wSM.getExistedWS();
            case 204:
                System.out.println("No workspaces to return");
                return new ArrayList<>();
            case 400:
                System.out.println("Invalid user's id");
                return null;
            case 404:
                System.out.println("Can't find user from id");
                return null;
            case 500:
                System.out.println("An internal error has occurred");
                return null;
            default:
                System.out.println("status code = " + status_code);
                return null;
        }
    }
    public static ArrayList<Service> findAllServiceWorkspace(String workspaceId){
        WorkspaceRequest wSM = new WorkspaceRequest("getWorkspaceServices", null, null, workspaceId,null);
        int status_code = wSM.requestToServe();
        switch (status_code) {
            case 200:
                System.out.println("Ok");
                return wSM.getExistedService();
            case 204:
                System.out.println("No services to return");
                return new ArrayList<>();
            case 400:
                System.out.println("Invalid workspace's id");
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
