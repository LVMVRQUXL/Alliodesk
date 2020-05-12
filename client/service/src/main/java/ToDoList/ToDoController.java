package ToDoList;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.fxml.Initializable;
import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.control.DatePicker;
import javafx.scene.control.ListView;
import javafx.scene.control.TextField;

import java.net.URL;
import java.time.LocalDate;
import java.util.Observable;
import java.util.ResourceBundle;

public class ToDoController {
    @FXML
    public void initialize(){

        datePicker.setValue(LocalDate.now());
    }
    @FXML
    private Button addButton;

    @FXML
    private DatePicker datePicker;

    @FXML
    private TextField descriptionTestField;

    @FXML
    private ListView<LocalEvent> eventList;

    ObservableList<LocalEvent> list = FXCollections.observableArrayList();
    @FXML
    private void addEvent(ActionEvent event) {
        list.add(new LocalEvent(descriptionTestField.getText(),datePicker.getValue()));
        eventList.setItems(list);
        descriptionTestField.setText("");
    }
}
