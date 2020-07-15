package fr.esgi.pa.alliodesk.ui.controller;

import java.util.ArrayList;

import fr.esgi.pa.alliodesk.core.request.WorkspaceRequest;
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
            ChoiceBoxItem item = new ChoiceBoxItem(tab[0], tab[1]);
            allMyWS.add(item);
        }
        this.wSList.setItems(allMyWS);
    }

    @FXML
    public void deleteWSUsingId(ActionEvent actionEvent) {
        actionEvent.consume();
        WorkspaceRequest wSM = new WorkspaceRequest("removeWSFormId", null, null, wSList.getValue().getId(),null);
        int status_code = wSM.requestToServe();
        switch (status_code) {
            case 200:
                ObservableList<ChoiceBoxItem> items = wSList.getItems();
                items.remove(wSList.getValue());
                break;
            default:
                break;
        }
    }
}
