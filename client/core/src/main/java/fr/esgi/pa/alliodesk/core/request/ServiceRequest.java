package fr.esgi.pa.alliodesk.core.request;

import com.google.gson.Gson;
import fr.esgi.pa.alliodesk.core.InfoInForm;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.util.EntityUtils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;

public class ServiceRequest extends ApiRequest {
    private final InfoInForm srFrom;
    private final String functionCall;

    private ArrayList<Service> existedService = new ArrayList<>();

    public ServiceRequest(String functionCall, String id) {
        this.functionCall = functionCall;
        this.srFrom = InfoInForm.build()
                .withId(id);
    }

    public ArrayList<Service> getExistedService() {
        return existedService;
    }

    @Override
    public int requestToServe() {
        // TODO: put global try...catch
        switch (this.functionCall) {
            case "create":
                try {
                    final CloseableHttpResponse request = super.request(
                            "/services",
                            new HttpPost(),
                            this.srFrom
                    );
                    return request.getStatusLine().getStatusCode();
                } catch (IOException e) {
                    e.printStackTrace();
                    return 500;
                }
            case "findUserAllServices":
                try {
                    String temp_id = "-1";
                    GetUserData myUser = new GetUserData();
                    myUser.requestToServe();
                    if (myUser.idNotEmpty()) {
                        temp_id = myUser.getId();
                    }
                    final CloseableHttpResponse response = super.request(
                            "/users/" + temp_id + "/services",
                            new HttpGet(),
                            this.srFrom
                    );
                    final int statusCode = response.getStatusLine().getStatusCode();

                    if (statusCode == 200) {
                        final String responseContent = EntityUtils.toString(response.getEntity());
                        Service[] yourList = new Gson().fromJson(responseContent, Service[].class);
                        existedService.addAll(Arrays.asList(yourList));
                    }
                    return statusCode;
                } catch (IOException e) {
                    e.printStackTrace();
                    return 500;
                }
            case "deleteService":
                try {
                    final CloseableHttpResponse response = super.request(
                            "/services/" + this.srFrom.getId(),
                            new HttpDelete(),
                            this.srFrom
                    );
                    return response.getStatusLine().getStatusCode();
                } catch (IOException e) {
                    e.printStackTrace();
                    return 500;
                }
        }
        return 500;
    }

    public static class Service {
        String id, name, version, source_url, user_id, service_status_id;


        public Service(String id, String name, String version, String source_url, String user_id, String service_status_id) {
            this.id = id;
            this.name = name;
            this.version = version;
            this.source_url = source_url;
            this.user_id = user_id;
            this.service_status_id = service_status_id;
        }

        @Override
        public String toString() {
            return "Service{" +
                    "id='" + id + '\'' +
                    ", name='" + name + '\'' +
                    ", version='" + version + '\'' +
                    ", source_url='" + source_url + '\'' +
                    ", user_id='" + user_id + '\'' +
                    ", service_status_id='" + service_status_id + '\'' +
                    '}';
        }

        public String getName() {
            return name;
        }

        public String getId() {
            return id;
        }
    }
}
