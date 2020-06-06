package fr.esgi.pa.alliodesk.ui.plugin;


import interfacetest.PluginInterface;

import java.io.File;
import java.lang.reflect.InvocationTargetException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.ArrayList;

public class PluginLoader<C> {
    private ArrayList classPluginInterface = new ArrayList();


    public PluginInterface[] LoadClass(String directory, String classpath, Class<C> parentClass) throws ClassNotFoundException, NoSuchMethodException, IllegalAccessException, InvocationTargetException, InstantiationException {
        File pluginsDir = new File(System.getProperty("user.dir") + directory);
        System.out.println(pluginsDir.listFiles().length);
        for (File jar : pluginsDir.listFiles()) {
            try {
                URLClassLoader loader = new URLClassLoader(
                        new URL[] { jar.toURL() }
                );

                Class clazz = Class.forName(classpath, true, loader);
                classPluginInterface.add(clazz);

            } catch (ClassNotFoundException e) {
                // There might be multiple JARs in the directory,
                // so keep looking
                continue;
            } catch (MalformedURLException e) {
                e.printStackTrace();
            }

        }
        PluginInterface[] tmpPlugins = new PluginInterface[this.classPluginInterface.size()];

        for(int index = 0 ; index < tmpPlugins.length; index ++ ){
            //On crée une nouvelle instance de l'objet contenu dans la liste grâce à newInstance()
            //et on le caste en PluginInterface. Vu que la classe implémente PluginInterface, le cast est toujours correct
            tmpPlugins[index] = (PluginInterface)((Class)classPluginInterface.get(index)).getDeclaredConstructor().newInstance();
        }
        return  tmpPlugins;


    }
}
