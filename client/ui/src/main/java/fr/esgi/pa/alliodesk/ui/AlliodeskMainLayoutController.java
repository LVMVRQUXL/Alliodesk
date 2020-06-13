package fr.esgi.pa.alliodesk.ui;

import fr.esgi.pa.alliodesk.ui.plugin.PluginGuetter;
import interfacetest.PluginInterface;
import fr.esgi.pa.alliodesk.ui.controller.WSController;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.control.Menu;
import javafx.scene.control.MenuBar;
import javafx.scene.control.MenuItem;
import javafx.scene.layout.BorderPane;

import java.io.IOException;
import java.util.ArrayList;


public class AlliodeskMainLayoutController {

    private ArrayList<String[]> myList;
    private AlliodeskMainLayoutController alliodeskMainLayoutController;
    @FXML
    private Menu workspaces;
    @FXML
    private Menu workspacesManager;

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
    void ShowError(ActionEvent event) throws IOException {
        AlliodeskMainLayout.showErrorLayout();
    }
    @FXML
    void addPluginInMenuBar(PluginInterface[] pi) {
        int index = 0;
        pluginMenu.getItems().clear();
        for (PluginInterface plugin : pi) {
            MenuItem mi = new MenuItem(plugin.getName());
            int finalIndex = index;
            mi.setOnAction(event -> PluginGuetter.pluginList[finalIndex].start());
            pluginMenu.getItems().add(mi);
            index++;
        }
    }

    @FXML
    void loadPlugin(ActionEvent event) throws ReflectiveOperationException {
        PluginGuetter.load();
        addPluginInMenuBar(PluginGuetter.pluginList);
    }

    @FXML
    void showTodoEvent(ActionEvent event) throws IOException {
        AlliodeskMainLayout.showToDoListLayout();
    }

    @FXML
    void addWS() {
        ObservableList<MenuItem> itemsWSManager = workspacesManager.getItems();
        ObservableList<MenuItem> itemsWS = workspaces.getItems();
        MenuItem load = new MenuItem("LoadMyWS");
        MenuItem delete = new MenuItem("Delete a WS");
        MenuItem update = new MenuItem("Update a WS");
        itemsWSManager.get(0).setText("add a WS");
        itemsWSManager.get(0).setOnAction(actionEvent -> {
            try {
                forceLoading();
                AlliodeskMainLayout.showCreateWSLayout();
                workspacesManager.getItems().get(1).setVisible(true);
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
        WSController wSC = new WSController();
        load.setOnAction(actionEvent -> {
            fillWS(wSC.findAllUserWS());
            if (!workspaces.isVisible()) workspaces.setVisible(true);
            workspaces.setDisable(false);
            afterLoading();
            try {
                //TODO LOAD A MENUSLAYOUT
                AlliodeskMainLayout.showRegisterLayout();
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
        update.setOnAction(actionEvent -> {
            try {
                forceLoading();
                AlliodeskMainLayout.showUpdateWSLayout();
                workspacesManager.getItems().get(1).setVisible(true);
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
        delete.setOnAction(actionEvent -> {
            try {
                forceLoading();
                workspacesManager.getItems().get(1).setVisible(true);
                AlliodeskMainLayout.showDeleteWSLayout();
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
        itemsWSManager.add(load);
        itemsWSManager.add(update);
        itemsWSManager.add(delete);
        forceLoading();
    }

    public void fillWS(ArrayList<String[]> yourList) {
        if (yourList != null) {
            this.myList = yourList;
            ObservableList<MenuItem> currentList = this.workspaces.getItems();
            currentList.remove(0, currentList.size());
            for (String[] ws : yourList
            ) {
                MenuItem test = new MenuItem(ws[1]);
                test.setId(ws[0]);
                test.setOnAction(actionEvent -> System.out.printf("id = %s name = %s%n", test.getId(), test.getText()));
                currentList.add(test);
            }
        }
        afterLoading();
    }

    public void forceLoading() {
        workspacesManager.getItems().get(0).setVisible(false);
        workspacesManager.getItems().get(2).setVisible(false);
        workspacesManager.getItems().get(3).setVisible(false);
        workspacesManager.getItems().get(1).setVisible(true);
        workspaces.setDisable(true);
    }

    public void afterLoading() {
        workspacesManager.getItems().get(0).setVisible(true);
        workspacesManager.getItems().get(2).setVisible(true);
        workspacesManager.getItems().get(3).setVisible(true);
        workspacesManager.getItems().get(1).setVisible(false);
        workspaces.setDisable(false);
    }
}

