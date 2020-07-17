package fr.esgi.pa.alliodesk.ui.controller;

import fr.esgi.pa.alliodesk.core.request.WorkspaceRequest;
import fr.esgi.pa.alliodesk.ui.ChoiceBoxItem;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.ChoiceBox;
import javafx.scene.control.TextField;

import java.util.ArrayList;

public class WSUpdate {
    private ArrayList<String[]> myList;
    @FXML
    TextField name;
    @FXML
    TextField description;
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
    public void updateWS(ActionEvent actionEvent) {
        actionEvent.consume();
        WorkspaceRequest wSM = new WorkspaceRequest("updateWS", name.getText(), description.getText(), wSList.getValue().getId(),null);
        int status_code = wSM.requestToServe();
        switch (status_code) {
            case 200:
                ObservableList<ChoiceBoxItem> items = wSList.getItems();
                int index = items.indexOf(wSList.getValue());
                ChoiceBoxItem a = new ChoiceBoxItem(items.get(index).getId(), name.getText());
                items.set(index, a);
                break;
            default:
                break;
        }
    }
}
