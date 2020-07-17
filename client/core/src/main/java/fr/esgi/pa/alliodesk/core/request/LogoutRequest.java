package fr.esgi.pa.alliodesk.core.request;

import fr.esgi.pa.alliodesk.core.manager.TokenManager;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPut;

import java.io.IOException;

public class LogoutRequest extends ApiRequest{

    @Override
    public int requestToServe() {
        try {
            String temp_id = "-1";
            GetUserData myid = new GetUserData();
            myid.requestToServe();
            if (myid.idNotEmpty()) {
                temp_id = myid.getId();
            }

            final CloseableHttpResponse response = super.request(
                    "/users/"+temp_id+"/logout",
                    new HttpPut(),
                    null,
                    true
            );
            int statusCode = response.getStatusLine().getStatusCode();
            if (statusCode == 200) {
                TokenManager.deleteTokenFile();
            }

            return statusCode;
        } catch (IOException e) {
            e.printStackTrace();
            return 500;
        }
    }
}
