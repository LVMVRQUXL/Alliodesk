package fr.esgi.pa.alliodesk.core.request;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import fr.esgi.pa.alliodesk.core.InfoInForm;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.util.EntityUtils;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
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
                    this.connectionForm
            );
            final int statusCode = response.getStatusLine().getStatusCode();

            if (statusCode == 200) {
                final String responseContent = EntityUtils.toString(response.getEntity());
                final JsonObject jsonObject = new Gson().fromJson(responseContent, JsonObject.class);
                String tokenSession = jsonObject.get("token_session").toString();
                tokenSession = tokenSession.substring(1, tokenSession.length() - 1);
                this.addTokenFile(tokenSession);
            }

            return statusCode;
        } catch (IOException e) {
            e.printStackTrace();
            return 500;
        }
    }

    private void addTokenFile(String token) {
        File f = new File("Token.txt");
        if (!f.exists()) {
            try {
                BufferedWriter writer = new BufferedWriter(new FileWriter("Token.txt"));
                writer.write(token);
                writer.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}

