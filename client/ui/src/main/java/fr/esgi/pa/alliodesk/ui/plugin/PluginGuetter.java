package fr.esgi.pa.alliodesk.ui.plugin;

import fr.esgi.pa.alliodesk.plugin.PluginInterface;

import java.io.File;



public class PluginGuetter {

    final static File file = new File(System.getProperty("user.home") + "/Alliodesk/plugins");

    public static PluginInterface[] pluginList;
    public static void load() throws ReflectiveOperationException {
        if (!file.exists()) {
            file.mkdirs();
        }
        PluginLoader<PluginInterface> loader = new PluginLoader<>();
        pluginList = new PluginInterface[]{};
        pluginList = loader.LoadClass(file.getAbsolutePath(), "Plugin", PluginInterface.class);
    }
}
