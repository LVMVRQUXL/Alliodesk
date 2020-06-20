package fr.esgi.pa.alliodesk.ui;

import fr.esgi.pa.alliodesk.core.request.ServiceRequest;
import fr.esgi.pa.alliodesk.ui.plugin.PluginGuetter;
import interfacetest.PluginInterface;
import fr.esgi.pa.alliodesk.ui.controller.WSController;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.control.Button;
import javafx.scene.control.Menu;
import javafx.scene.control.MenuBar;
import javafx.scene.control.MenuItem;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.VBox;

import java.io.IOException;
import java.util.ArrayList;


public class AlliodeskMainLayoutController {

    private ArrayList<String[]> myList;
    private ArrayList<ServiceRequest.Service> myServiceList;
    private AlliodeskMainLayoutController alliodeskMainLayoutController;
    private static String workspaceId = "";

    public static String getWorkspaceId() {
        return workspaceId;
    }

    @FXML
    private Menu workspaces;
    @FXML
    private Menu workspacesManager;
    @FXML
    private VBox servicesVBox;
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
    private Button refreshServiceListButton;

    @FXML
    void showRegisterEvent(ActionEvent event) throws IOException {
        AlliodeskMainLayout.showRegisterLayout();
    }
    @FXML
    void showError(ActionEvent event) throws IOException {
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
    void deleteServiceInWS(ActionEvent event) throws IOException {
        refreshServiceListButton.setDisable(false);
        AlliodeskMainLayout.showDeleteServiceIntoWS();
    }

    @FXML
    public void addToWS() throws IOException {
        refreshServiceListButton.setDisable(false);
        AlliodeskMainLayout.showAddServiceIntoWS();
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
                MenuItem item = new MenuItem(ws[1]);
                item.setId(ws[0]);
                item.setOnAction(actionEvent -> {
                    fillServiceInWorkspace(WSController.findAllServiceWorkspace(ws[0]));
                    workspaceId = item.getId();
                    System.out.printf("id = %s name = %s%n", item.getId(), item.getText());
                });
                currentList.add(item);
            }
        }
        afterLoading();
    }


    public void fillServiceInWorkspace(ArrayList<ServiceRequest.Service> yourList) {
        servicesVBox.getChildren().clear();
        if (yourList != null) {
            this.myServiceList = yourList;
            for (ServiceRequest.Service s : myServiceList) {
                Button b = new Button(s.getName());
                b.setPrefHeight(33);
                b.setPrefWidth(125);
                b.setOnAction(actionEvent -> System.out.println(s.toString()));
                servicesVBox.getChildren().add(b);
            }
        }
    }

    @FXML
    void refreshServiceList(ActionEvent event) {
        fillServiceInWorkspace(WSController.findAllServiceWorkspace(workspaceId));
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

