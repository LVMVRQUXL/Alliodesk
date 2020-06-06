package fr.esgi.pa.alliodesk.ui.service;

import org.xeustechnologies.jcl.JarClassLoader;
import org.xeustechnologies.jcl.JclObjectFactory;

import java.net.URL;

public class ExtensionGetter {
    private URL url;
    private Object controller;

    public ExtensionGetter() {
        this.load();
    }

    public URL getUrl() {
        return this.url;
    }

    public Object getController() {
        return this.controller;
    }

    private void load() {
        final JarClassLoader jcl = new JarClassLoader();
        final String jarPath = "lib/services/ToDoList-1.0.0.jar";
        jcl.add(jarPath);
        final JclObjectFactory factory = JclObjectFactory.getInstance();
        controller = factory.create(jcl, "fr.esgi.pa.alliodesk.todolist.ToDoController");
        url = controller.getClass().getResource("/Todo.fxml");
    }
}
