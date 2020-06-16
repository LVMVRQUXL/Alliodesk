package fr.esgi.pa.alliodesk.ui.controller;

import java.awt.*;
import java.util.ArrayList;

import fr.esgi.pa.alliodesk.core.request.WorkspaceManager;
import fr.esgi.pa.alliodesk.ui.ChoiceBoxItem;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.ChoiceBox;

public class WSDelete {
    private ArrayList<String[]> myList;
    @FXML
    public ChoiceBox<ChoiceBoxItem> wSList;

    @FXML
    public void initialize() {
        WSController wSC = new WSController();
        this.myList = wSC.findAllUserWS();
        ObservableList<ChoiceBoxItem> allMyWS = FXCollections.observableArrayList();
        for (String[] tab : this.myList) {
            ChoiceBoxItem item = new ChoiceBoxItem(Integer.parseInt(tab[0]), tab[1]);
            allMyWS.add(item);
        }
        this.wSList.setItems(allMyWS);
    }

    @FXML
    public void deleteWSUsingId(ActionEvent actionEvent) {
        actionEvent.consume();
        WorkspaceManager wSM = new WorkspaceManager("removeWSFormId", null, null, "" + wSList.getValue().getId());
        int status_code = wSM.requestToServe();
        switch (status_code) {
            case 200:
                System.out.println("OK");
                ObservableList<ChoiceBoxItem> items = wSList.getItems();
                items.remove(wSList.getValue());
                break;
            case 404:
                System.out.println("Can't find workspace from given id");
                break;
            case 400:
                System.out.println("Invalid workspace's id");
                break;
            case 401:
                System.out.println("Can't find user from given token session");
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
