package fr.esgi.pa.alliodesk.todolist;


import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class RunFxMain extends Application {
    Scene scene;
    public RunFxMain() throws Exception {
        Parent root = FXMLLoader.load(getClass().getResource("/Todo.fxml"));
        this.scene = new Scene(root);
    }
    public Scene getScene(){
        return scene;
    }

    @Override
    public void start(Stage primaryStage){

        primaryStage.setTitle("ToDo");
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    public static void main(String[] args) {

        launch(args);
    }
}
