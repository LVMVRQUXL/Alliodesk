package fr.esgi.pa.alliodesk.core.request;

import com.google.gson.Gson;
import fr.esgi.pa.alliodesk.core.InfoInForm;
import io.github.cdimascio.dotenv.Dotenv;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpEntityEnclosingRequestBase;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;

import java.io.IOException;
import java.net.URI;

abstract class ApiRequest {
    private final Dotenv dotenv = Dotenv.load();
    private final String apiUrl = String.format("http://%s:%s", dotenv.get("API_HOST"), dotenv.get("API_PORT"));

    public abstract int requestToServe();

    <T extends HttpEntityEnclosingRequestBase> CloseableHttpResponse request(
            final String endpoint,
            final T requestType,
            final InfoInForm form
    ) throws IOException {
        final String uri = this.apiUrl + endpoint;
        final Gson gson = new Gson();
        final CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        final StringEntity entity = new StringEntity(gson.toJson(form));

        requestType.setURI(URI.create(uri));
        requestType.setEntity(entity);
        requestType.setHeader("Content-type", "application/json");

        return httpClient.execute(requestType);
    }
}
