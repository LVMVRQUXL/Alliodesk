package fr.esgi.pa.alliodesk.core.request;

import com.google.gson.Gson;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.util.EntityUtils;

import java.io.IOException;

public class GetUserData extends ApiRequest {
    private UserData userInfo;
    private String id="";

    public boolean idNotEmpty(){
        return !id.equals("");
    }

    public String getId() {
        return id;
    }

    @Override
    public int requestToServe() {
        try {
            final CloseableHttpResponse response = super.request(
                    "/users/me/infos",
                    new HttpGet(),
                    null
            );
            int statusCode =  response.getStatusLine().getStatusCode();
            if (statusCode == 200) {
                final String responseContent = EntityUtils.toString(response.getEntity());
                System.out.println(responseContent);
                this.userInfo = new Gson().fromJson(responseContent,UserData.class);
                this.id = userInfo.getId();
                System.out.println(userInfo);
            }

            return statusCode;
        } catch (IOException e) {
            e.printStackTrace();
            return 500;
        }
    }

    class UserData{
        private String id,name,email,login;

        @Override
        public String toString() {
            return "UserData{" +
                    "id='" + id + '\'' +
                    ", name='" + name + '\'' +
                    ", email='" + email + '\'' +
                    ", login='" + login + '\'' +
                    '}';
        }

        public String getId() {
            return id;
        }
    }


}
