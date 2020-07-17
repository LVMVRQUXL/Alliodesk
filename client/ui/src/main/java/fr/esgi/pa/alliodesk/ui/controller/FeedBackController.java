package fr.esgi.pa.alliodesk.ui.controller;

import fr.esgi.pa.alliodesk.core.models.Service;
import fr.esgi.pa.alliodesk.core.request.FeedbackRequest;
import fr.esgi.pa.alliodesk.core.request.ServiceRequest;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.scene.control.ChoiceBox;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import org.controlsfx.control.Rating;
import org.jetbrains.annotations.Nullable;

import java.util.ArrayList;

public class FeedBackController {
    private ObservableList<Service> list = FXCollections.observableArrayList();
    @FXML
    private Rating my_rate;
    @FXML
    private ChoiceBox<String> myList;
    @FXML
    private TextArea feedback;
    @FXML
    private TextField title;

    @FXML
    public void initialize() {
        loadServices();
    }

    @FXML
    public void loadServices() {
        list.clear();
        list.addAll(findUserAllService());
        if (list.size() > 0) {
            for (Service service : list) {
                myList.getItems().add(service.getName());
            }
            myList.setValue(myList.getItems().get(0));
        } else {
            myList.setValue("Aucun service trouvé");
        }
    }

    public static ArrayList<Service> findUserAllService() {
        ServiceRequest serviceRequest = new ServiceRequest("findUserAllServices", null,null,null,null,null);
        int status_code = serviceRequest.requestToServe();
        if(status_code == 200){
            return serviceRequest.getExistedService();
        }
        return new ArrayList<>();
    }

    @FXML
    public void sendFeedback(){
        FeedbackRequest feedbackRequest = new FeedbackRequest(my_rate.getRating()+"",title.getText(),feedback.getText(),myList.getValue());
        feedbackRequest.requestToServe();

    }

}
