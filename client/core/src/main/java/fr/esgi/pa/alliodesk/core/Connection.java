package fr.esgi.pa.alliodesk.core;


import com.google.gson.Gson;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;

import java.io.IOException;

public class Connection {
    private InfoInForm connectionForm;
    public Connection(String login, String pwd) {
        this.connectionForm = new InfoInForm.FormBuilder()
                .withLogin(login)
                .withPassword(pwd)
                .build();

    }
    public int requestToServe() throws IOException {

        String postUrl = "http://localhost:3000/users/login";// put in your url
        Gson gson = new Gson();
        HttpClient httpClient = HttpClientBuilder.create().build();
        StringEntity postingString = new StringEntity(gson.toJson(connectionForm));
        String visual = gson.toJson(connectionForm);
        System.out.println(visual);
        HttpPost post = new HttpPost(postUrl);
        post.setEntity(postingString);
        post.setHeader("Content-type", "application/json");
        HttpResponse response = httpClient.execute(post);
        return response.getStatusLine().getStatusCode();
    }
}
