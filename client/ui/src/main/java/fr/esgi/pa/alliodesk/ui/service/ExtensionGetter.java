package fr.esgi.pa.alliodesk.ui.service;

import org.xeustechnologies.jcl.JarClassLoader;
import org.xeustechnologies.jcl.JclObjectFactory;

import java.io.IOException;
import java.net.URL;
import java.nio.file.Path;

import static java.lang.String.format;

public class ExtensionGetter {

    public static URL url;
    private Object controller;
    public static Path path;
    private final String appName;
    public ExtensionGetter(String appName) throws ReflectiveOperationException, IOException {
        this.appName = appName;
        this.load();
    }

    public URL getUrl() {
        return this.url;
    }

    public Object getController() {
        return this.controller;
    }

    public void setController(Object controller) {
        this.controller = controller;
    }
    private void load() {
        final JarClassLoader jcl = new JarClassLoader();
        final String jarPath = format(System.getProperty("user.home")+"/Alliodesk/services/%s/%s.jar", appName,appName);
        jcl.add(jarPath);
        final JclObjectFactory factory = JclObjectFactory.getInstance();
        controller = factory.create(jcl, format("fr.esgi.pa.alliodesk.%s.%sController",appName,appName));
        url = controller.getClass().getResource(format("/%s.fxml",appName));
        path = Path.of(jarPath);
    }
}
