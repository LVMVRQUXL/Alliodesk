package fr.esgi.pa.alliodesk.ui;

import org.xeustechnologies.jcl.JarClassLoader;
import org.xeustechnologies.jcl.JclObjectFactory;

import java.lang.reflect.Method;
import java.net.URL;
    // Gestionnaire de service
public class ExtensionGetter {
    private static String jarPath = "../services/ToDoList/target/ToDoList-0.1.0-SNAPSHOT.jar";
    public URL url;
    public Object controller; // Le object pourra être une interface
    public void load() {
        JarClassLoader jcl = new JarClassLoader();
        jcl.add(jarPath);
        JclObjectFactory factory = JclObjectFactory.getInstance();
        controller =  factory.create(jcl, "fr.esgi.pa.alliodesk.todolist.ToDoController");
        url = controller.getClass().getResource("/Todo.fxml");
    }

    // Gestionnaire de plugin
//    public static void main(String[] args) throws ClassNotFoundException {
//
//        ExtensionLoader<Object> loader = new ExtensionLoader<>();
//        var somePlugin = loader.LoadClass(jarPath, "fr.esgi.pa.alliodesk.todolist.loader", Object.class); // Le "Object" pourra être une interface
//
//        URL url = somePlugin.getClass().getResource("/Todo.fxml");
//    }

}
