package fr.esgi.pa.alliodesk.ui;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.layout.BorderPane;
import java.io.IOException;


public class AlliodeskMainLayoutController {
    @FXML
    private BorderPane rootLayout;
    @FXML
    private Button todolistButton;

    @FXML
    private Button RegisterButton;

    @FXML
    void showRegisterEvent(ActionEvent event) throws IOException {
        AlliodeskMainLayout.showRegisterLayout();

    }

    @FXML
    void showTodoEvent(ActionEvent event) throws IOException {
        AlliodeskMainLayout.showToDoListLayout();

    }

}

