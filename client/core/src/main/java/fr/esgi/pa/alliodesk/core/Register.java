package fr.esgi.pa.alliodesk.core;

import com.google.gson.Gson;
import io.github.cdimascio.dotenv.Dotenv;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;

import java.io.IOException;


public class Register {
    private final InfoInForm registerForm;
    private final String apiUrl;

    public Register(String name, String email, String login, String pwd) {
        this.registerForm = InfoInForm.build()
                .withName(name)
                .withEmail(email)
                .withLogin(login)
                .withPassword(pwd);
        final Dotenv dotenv = Dotenv.load();
        this.apiUrl = String.format("http://%s:%s",
                dotenv.get("API_HOST"), dotenv.get("API_PORT"));
    }

    public int requestToServe() throws IOException {
        final String postUrl = String.format("%s/users", this.apiUrl);
        final Gson gson = new Gson();
        final HttpClient httpClient = HttpClientBuilder.create().build();
        final HttpPost post = new HttpPost(postUrl);
        final StringEntity postingString = new StringEntity(gson.toJson(registerForm));

        post.setEntity(postingString);
        post.setHeader("Content-type", "application/json");
        final HttpResponse response = httpClient.execute(post);

        return response.getStatusLine().getStatusCode();
    }
}

