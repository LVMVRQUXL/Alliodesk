package fr.esgi.pa.alliodesk.ui;

import fr.esgi.pa.alliodesk.ui.plugin.PluginGuetter;
import interfacetest.PluginInterface;
import fr.esgi.pa.alliodesk.core.request.WorkspaceManager;
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
        ObservableList<MenuItem> itemsWSManager  = workspacesManager.getItems();
        ObservableList<MenuItem> itemsWS  = workspaces.getItems();
        //Create Items
        MenuItem laod = new MenuItem("LoadMyWS");
        MenuItem delete = new MenuItem("Delete a WS");
        MenuItem update = new MenuItem("Update a WS");

        //Update firstRow
        itemsWSManager.get(0).setText("add a WS");
        itemsWSManager.get(0).getText();
        itemsWSManager.get(0).setOnAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent actionEvent) {
                try {
                    forceLoading();
                    AlliodeskMainLayout.showCreateWSLayout();
                    workspacesManager.getItems().get(1).setVisible(true);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        });


        WSController wSC = new WSController();
        laod.setOnAction(actionEvent -> {fillWS(wSC.findAllUserWS());if (!workspaces.isVisible())workspaces.setVisible(true);workspaces.setDisable(false);afterLoading();
            try {
                //TODO LOAD A MENUSLAYOUT
                AlliodeskMainLayout.showRegisterLayout();
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
        update.setOnAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent actionEvent) {
                try {
                    forceLoading();
                    AlliodeskMainLayout.showUpdateWSLayout();
                    workspacesManager.getItems().get(1).setVisible(true);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        });
        delete.setOnAction(new EventHandler<ActionEvent>() {
            @Override
            public void handle(ActionEvent actionEvent) {
                try {
                    forceLoading();
                    workspacesManager.getItems().get(1).setVisible(true);
                    AlliodeskMainLayout.showDeleteWSLayout();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        });

        //add item
        itemsWSManager.add(laod);
        itemsWSManager.add(update);
        itemsWSManager.add(delete);
        forceLoading();

// Setvisible false workspace wiill changing  -> set visible load ws -> set visible workspace ->when quite
    }
    public void fillWS(ArrayList<String[]> yourList){
        this.myList = yourList;
        ObservableList<MenuItem> currentList = this.workspaces.getItems();
        currentList.remove(0,currentList.size());
        for (String[] ws: yourList
             ) {
            MenuItem test = new MenuItem(ws[1]);
            test.setId(ws[0]);
            test.setOnAction(new EventHandler<ActionEvent>() {
                @Override
                public void handle(ActionEvent actionEvent) {
                    System.out.printf("id = %s name = %s%n", test.getId(), test.getText());
                }
            });
            currentList.add(test);
            this.workspacesManager.getItems().get(1).setVisible(false);
        }
    }
    public void forceLoading(){
        workspacesManager.getItems().get(0).setVisible(false);
        workspacesManager.getItems().get(2).setVisible(false);
        workspacesManager.getItems().get(3).setVisible(false);
        workspacesManager.getItems().get(1).setVisible(true);
    }
    public void afterLoading(){
        workspacesManager.getItems().get(0).setVisible(true);
        workspacesManager.getItems().get(2).setVisible(true);
        workspacesManager.getItems().get(3).setVisible(true);
        workspacesManager.getItems().get(1).setVisible(false);
    }



}

