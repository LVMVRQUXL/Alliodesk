package fr.esgi.pa.alliodesk.todolist;

import com.google.gson.Gson;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.fxml.Initializable;
import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.control.DatePicker;
import javafx.scene.control.ListView;
import javafx.scene.control.TextField;

import java.io.IOException;
import java.net.URL;
import java.time.LocalDate;
import java.util.Observable;
import java.util.ResourceBundle;

public class ToDoController {
    private static Gson gson = new Gson();
    ObservableList<LocalEvent> list = FXCollections.observableArrayList();

    @FXML
    public void initialize() {
        datePicker.setValue(LocalDate.now());
        LocalEvent[] todos = LocalEvent.todolistReadFromFile();
        if (todos != null) {
            list.addAll(todos);
            eventList.setItems(list);
        }

    }

    @FXML
    private DatePicker datePicker;

    @FXML
    private TextField descriptionTestField;

    @FXML
    private ListView<LocalEvent> eventList;



    @FXML
    private void addEvent(ActionEvent event) {
        LocalEvent todo = new LocalEvent(descriptionTestField.getText(), datePicker.getValue());
        list.add(todo);
        LocalEvent.todolistWriteToFile(list);
        eventList.setItems(list);
        descriptionTestField.setText("");
    }

    @FXML
    void clearEvent(ActionEvent event) {
        LocalEvent.clearFile();
        eventList.getItems().clear();
    }
}
