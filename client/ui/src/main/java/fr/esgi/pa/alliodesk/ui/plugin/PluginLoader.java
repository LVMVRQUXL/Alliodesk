package fr.esgi.pa.alliodesk.ui.plugin;


import fr.esgi.pa.alliodesk.plugin.PluginInterface;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.ArrayList;

public class PluginLoader<C> {
    private ArrayList classPluginInterface = new ArrayList();


    public PluginInterface[] LoadClass(String directory, String classpath, Class<C> parentClass) throws ReflectiveOperationException {
        File pluginsDir = new File(System.getProperty("user.dir") + directory);
        for (File jar : pluginsDir.listFiles()) {
            try {
                URLClassLoader loader = new URLClassLoader(
                        new URL[] { jar.toURL() }
                );

                Class clazz = Class.forName(classpath, true, loader);
                classPluginInterface.add(clazz);
                loader.close();
            } catch (ClassNotFoundException e) {
                continue;
            }  catch (IOException e) {
                e.printStackTrace();
            }

        }
        PluginInterface[] tmpPlugins = new PluginInterface[this.classPluginInterface.size()];

        for(int index = 0 ; index < tmpPlugins.length; index ++ ){
            tmpPlugins[index] = (PluginInterface)((Class)classPluginInterface.get(index)).getDeclaredConstructor().newInstance();
        }
        return  tmpPlugins;


    }
}
