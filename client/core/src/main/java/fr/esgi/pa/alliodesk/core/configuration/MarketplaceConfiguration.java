package fr.esgi.pa.alliodesk.core.configuration;

import org.update4j.Configuration;
import org.update4j.FileMetadata;

import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;


public class MarketplaceConfiguration {

    private String url;



    public MarketplaceConfiguration(String url){
        this.url = url;
    }

    public void download() throws IOException {

        URL myUrl = new URL(url);
        try{
            InputStreamReader in = new InputStreamReader(myUrl.openStream());
            Configuration config = Configuration.read(in);
            config.update();
        }catch( Exception e){

        }
    }

}
