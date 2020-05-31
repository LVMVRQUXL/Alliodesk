package fr.esgi.pa.alliodesk.core;


import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

public class Connection {
    private InfoInForm connectionForm;
    private String tok;
    public Connection(String login, String pwd) {
        this.connectionForm = InfoInForm.build()
                .withLogin(login)
                .withPassword(pwd);
    }
    public int requestToServe() throws IOException {

        String postUrl = "http://localhost:3000/users/login";// put in your url
        Gson gson = new Gson();
        HttpClient httpClient = HttpClientBuilder.create().build();
        StringEntity postingString = new StringEntity(gson.toJson(connectionForm));
        String visual = gson.toJson(connectionForm);
        System.out.println(visual);
        HttpPut post = new HttpPut(postUrl);
        post.setEntity(postingString);
        post.setHeader("Content-type", "application/json");
        HttpResponse response = httpClient.execute(post);
        if (response.getStatusLine().getStatusCode() == 200) {
            String jsonContent = EntityUtils.toString(response.getEntity());
            JsonObject myObjectGson = new Gson().fromJson(jsonContent, JsonObject.class);
            String token = myObjectGson.get("token_session").toString();
            token = token.substring(1,token.length()-1);
            AddTokenFile(token);
        }

        return response.getStatusLine().getStatusCode();
    }

    public void AddTokenFile(String token) throws IOException {
        File f = new File("Token.txt");
        if(!f.exists()){
            BufferedWriter writer = new BufferedWriter(new FileWriter("Token.txt"));
            writer.write(token);
            writer.close();
        }
    }
}

