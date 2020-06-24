package fr.esgi.pa.alliodesk.core.request;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import fr.esgi.pa.alliodesk.core.form.InfoInForm;
import fr.esgi.pa.alliodesk.core.manager.TokenManager;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.util.EntityUtils;

import java.io.IOException;

public class ConnectionRequest extends ApiRequest {
    private final InfoInForm connectionForm;

    public ConnectionRequest(String login, String pwd) {
        this.connectionForm = InfoInForm.build()
                .withLogin(login)
                .withPassword(pwd);
    }

    @Override
    public int requestToServe() {
        try {
            final CloseableHttpResponse response = super.request(
                    "/users/login",
                    new HttpPut(),
                    this.connectionForm,
                    false
            );
            final int statusCode = response.getStatusLine().getStatusCode();
            if (statusCode == 200) {
                final String responseContent = EntityUtils.toString(response.getEntity());
                final JsonObject jsonObject = new Gson().fromJson(responseContent, JsonObject.class);
                String tokenSession = jsonObject.get("token_session").toString();
                tokenSession = tokenSession.substring(1, tokenSession.length() - 1);
                TokenManager.saveTokenInFile(tokenSession);
            }

            return statusCode;
        } catch (IOException e) {
            e.printStackTrace();
            return 500;
        }
    }
}

