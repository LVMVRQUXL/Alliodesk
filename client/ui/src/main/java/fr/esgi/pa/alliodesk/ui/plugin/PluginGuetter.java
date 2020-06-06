package fr.esgi.pa.alliodesk.ui.plugin;


import interfacetest.PluginInterface;

import java.lang.reflect.InvocationTargetException;

public class PluginGuetter {
    final static String jarPath = "/lib/plugins";
    public static PluginInterface[] pluginList;
    public static void load() throws ClassNotFoundException, InvocationTargetException, NoSuchMethodException, InstantiationException, IllegalAccessException {
        PluginLoader<PluginInterface> loader = new PluginLoader<>();
        pluginList = new PluginInterface[]{};
        pluginList = loader.LoadClass(jarPath, "testPlugin", PluginInterface.class);

        for( PluginInterface pi : pluginList){
            pi.Print();
        }
    }
}
