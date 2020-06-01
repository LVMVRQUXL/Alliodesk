package fr.esgi.pa.alliodesk.ui;

import org.xeustechnologies.jcl.JarClassLoader;
import org.xeustechnologies.jcl.JclObjectFactory;

import java.net.URL;

class ExtensionGetter {
    private URL url;
    private Object controller;

    ExtensionGetter() {
        this.load();
    }

    URL getUrl() {
        return this.url;
    }

    Object getController() {
        return this.controller;
    }

    private void load() {
        final JarClassLoader jcl = new JarClassLoader();
        final String jarPath = "../services/ToDoList/target/ToDoList-0.1.0-SNAPSHOT.jar";
        jcl.add(jarPath);
        final JclObjectFactory factory = JclObjectFactory.getInstance();
        controller = factory.create(jcl, "fr.esgi.pa.alliodesk.todolist.ToDoController");
        url = controller.getClass().getResource("/Todo.fxml");
    }
}
