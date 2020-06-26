package fr.esgi.pa.alliodesk.core.request;

import com.google.gson.Gson;
import fr.esgi.pa.alliodesk.core.form.InfoInForm;
import fr.esgi.pa.alliodesk.core.manager.TokenManager;
import io.github.cdimascio.dotenv.Dotenv;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpEntityEnclosingRequestBase;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;

import java.io.IOException;
import java.net.URI;

abstract class ApiRequest {
    private final Dotenv dotenv = Dotenv.load();
    private final String apiUrl = String.format("http://%s:%s", dotenv.get("API_HOST"), dotenv.get("API_PORT"));

    public abstract int requestToServe();

    <T extends HttpRequestBase> CloseableHttpResponse request(
            final String endpoint,
            final T requestType,
            final InfoInForm form,
            final boolean tokenRequired
    ) throws IOException {
        final CloseableHttpClient httpClient = HttpClientBuilder.create().build();
        final String uri = this.apiUrl + endpoint;
        requestType.setURI(URI.create(uri));
        if (requestType.getMethod().equals("POST")
                || requestType.getMethod().equals("PUT")
                || requestType.getMethod().equals("PATCH")) {
            final Gson gson = new Gson();
            final StringEntity entity = new StringEntity(gson.toJson(form));
            ((HttpEntityEnclosingRequestBase) requestType).setEntity(entity);
        }
        requestType.setHeader("Content-type", "application/json");
        if (tokenRequired)
            requestType.setHeader(
                    "Authorization",
                    String.format("Bearer %s", TokenManager.getTokenFromFile())
            );

        return httpClient.execute(requestType);
    }
}
