package fr.esgi.pa.alliodesk.core.request;

import com.google.gson.Gson;
import fr.esgi.pa.alliodesk.core.InfoInForm;
import io.github.cdimascio.dotenv.Dotenv;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpEntityEnclosingRequestBase;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.util.Scanner;

abstract class ApiRequest {
    private String token="";
    private final Dotenv dotenv = Dotenv.load();
    private final String apiUrl = String.format("http://%s:%s", dotenv.get("API_HOST"), dotenv.get("API_PORT"));

    public abstract int requestToServe();

    <T extends HttpRequestBase> CloseableHttpResponse request(
            final String endpoint,
            final T requestType,
            final InfoInForm form
    ) throws IOException {
        final String uri = this.apiUrl + endpoint;
        final CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        requestType.setURI(URI.create(uri));
        if(requestType.getMethod()=="POST" || requestType.getMethod()=="PUT" || requestType.getMethod()=="PATCH"){
            final Gson gson = new Gson();
            final StringEntity entity = new StringEntity(gson.toJson(form));
            ((HttpEntityEnclosingRequestBase)requestType).setEntity(entity);
        }
        requestType.setHeader("Content-type", "application/json");
        initToken();
        requestType.setHeader("Authorization","Bearer "+ this.token );
        return httpClient.execute(requestType);
    }

    private void initToken(){
        try {
            File myObj = new File("Token.txt");

            boolean exists = myObj.exists();
            if(exists){
                Scanner myReader = new Scanner(myObj);
                String data = myReader.nextLine();
                this.token=data;
                myReader.close();
            }else{
                token = "Won'tMatchAnyway";
            }
        } catch (IOException e) {
            System.out.println("File not found.");
            e.printStackTrace();
        }
    }
}
