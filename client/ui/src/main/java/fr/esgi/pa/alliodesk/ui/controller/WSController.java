package fr.esgi.pa.alliodesk.ui.controller;

import fr.esgi.pa.alliodesk.core.request.WorkspaceManager;
import fr.esgi.pa.alliodesk.ui.AlliodeskMainLayoutController;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;

import javafx.scene.control.TextField;

import java.util.ArrayList;


public class WSController {

    @FXML
    private TextField name;
    @FXML
    private TextField description;

    public void  resetFields(ActionEvent actionEvent) {
        this.name.setText("");
        this.description.setText("");
    }

    @FXML
    public void createWS(ActionEvent actionEvent) {
        WorkspaceManager wSM = new WorkspaceManager("create",name.getText(),description.getText(),null);
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
        WorkspaceManager wSM = new WorkspaceManager("findAllUserWS",null,null,null);
        int status_code = wSM.requestToServe();
        switch (status_code) {
            case 200:
                System.out.println("Ok");
                return wSM.getExistedWS();
            case 204:
                System.out.println("No workspaces to return");
                return null;
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
}
