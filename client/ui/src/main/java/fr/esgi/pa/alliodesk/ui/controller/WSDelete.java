package fr.esgi.pa.alliodesk.ui.controller;

import java.util.ArrayList;

import fr.esgi.pa.alliodesk.core.request.WorkspaceManager;
import fr.esgi.pa.alliodesk.ui.AlliodeskMainLayoutController;
import fr.esgi.pa.alliodesk.ui.ChoiceBoxItem;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.ChoiceBox;
import javafx.scene.control.Label;

public class WSDelete {
    AlliodeskMainLayoutController alliodeskMainLayoutController = new AlliodeskMainLayoutController();
    private ArrayList<String[]> myList;
    @FXML
    public Label resultLabel;
    @FXML
    public ChoiceBox<ChoiceBoxItem> wSList;

    @FXML
    public void initialize(){
        WSController wSC = new WSController();
        this.myList = wSC.findAllUserWS();
        ObservableList<ChoiceBoxItem> allMyWS = FXCollections.observableArrayList();
        for (String[] tab: this.myList) {
            ChoiceBoxItem item = new ChoiceBoxItem(Integer.parseInt(tab[0]),tab[1]);
            allMyWS.add(item);
        }
        this.wSList.setItems(allMyWS);
    }

    @FXML
    public void deleteWSUsingId(ActionEvent actionEvent) {
        actionEvent.consume();
        WorkspaceManager wSM = new WorkspaceManager("removeWSFormId",""+wSList.getValue().getId(),null);
        int status_code = wSM.requestToServe();
        switch (status_code) {
            case 200:
                System.out.println("OK");
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
