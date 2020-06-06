package fr.esgi.pa.alliodesk.ui;

import fr.esgi.pa.alliodesk.ui.plugin.PluginGuetter;
import interfacetest.PluginInterface;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.control.Menu;
import javafx.scene.control.MenuBar;
import javafx.scene.control.MenuItem;
import javafx.scene.layout.BorderPane;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;



public class AlliodeskMainLayoutController {
    @FXML
    private BorderPane rootLayout;
    @FXML
    private Button todolistButton;
    @FXML
    private MenuBar menu;
    @FXML
    private Button RegisterButton;
    @FXML
    private Menu pluginMenu;
    @FXML
    void showRegisterEvent(ActionEvent event) throws IOException {
        AlliodeskMainLayout.showRegisterLayout();
    }

    @FXML
    void addPluginInMenuBar(PluginInterface[] pi){
        int index = 0;
        pluginMenu.getItems().clear();
        for( PluginInterface plugin: pi){
            MenuItem mi = new MenuItem(plugin.getName());
            int finalIndex = index;
            mi.setOnAction(event -> PluginGuetter.pluginList[finalIndex].start());
            pluginMenu.getItems().add(mi);
            index++;
        }
    }
    @FXML
    void loadPlugin(ActionEvent event) throws ClassNotFoundException, NoSuchMethodException, InstantiationException, IllegalAccessException, InvocationTargetException {
        PluginGuetter.load();
        addPluginInMenuBar(PluginGuetter.pluginList);
    }
    @FXML
    void showTodoEvent(ActionEvent event) throws IOException {
        AlliodeskMainLayout.showToDoListLayout();

    }

}

