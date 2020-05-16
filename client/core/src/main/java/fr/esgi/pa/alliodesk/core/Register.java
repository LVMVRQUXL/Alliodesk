package fr.esgi.pa.alliodesk.core;

import com.google.gson.Gson;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;

import java.io.IOException;


public class Register {
    private InfoInForm registerForm;

    public Register(String name, String email, String login, String pwd) {
        this.registerForm = new InfoInForm(name, email, login, pwd);
    }

    public int requestToServe() throws IOException {

        String postUrl = "http://localhost:3000/users";// put in your url
        Gson gson = new Gson();
        HttpClient httpClient = HttpClientBuilder.create().build();
        StringEntity postingString = new StringEntity(gson.toJson(registerForm));
        HttpPost post = new HttpPost(postUrl);
        post.setEntity(postingString);
        post.setHeader("Content-type", "application/json");
        HttpResponse response = httpClient.execute(post);
        int code = response.getStatusLine().getStatusCode();

        return code;
    }
}

class InfoInForm {
    private String name, email, login, password;

    InfoInForm(String n, String e, String l, String p) {
        this.name = n;
        this.email = e;
        this.login = l;
        this.password = p;
    }
}
