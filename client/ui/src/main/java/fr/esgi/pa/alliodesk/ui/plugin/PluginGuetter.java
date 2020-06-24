package fr.esgi.pa.alliodesk.ui.plugin;


import interfacetest.PluginInterface;


public class PluginGuetter {
    final static String jarPath = "/ui/lib/plugins";
    public static PluginInterface[] pluginList;
    public static void load() throws ReflectiveOperationException {
        PluginLoader<PluginInterface> loader = new PluginLoader<>();
        pluginList = new PluginInterface[]{};
        pluginList = loader.LoadClass(jarPath, "Plugin", PluginInterface.class);
        System.out.println("Plugin loaded !");
    }
}
