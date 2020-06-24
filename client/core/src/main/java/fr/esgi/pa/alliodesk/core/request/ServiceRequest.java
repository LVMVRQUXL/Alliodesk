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

    private CloseableHttpResponse requestFindAllServicesFromUser() throws IOException {
        String tempId = "-1";
        final GetUserData myUser = new GetUserData();
        myUser.requestToServe();
        if (myUser.idNotEmpty()) tempId = myUser.getId();
        final CloseableHttpResponse response = super.request(
                "/users/" + tempId + "/services",
                new HttpGet(),
                this.srFrom
        );

        if (response.getStatusLine().getStatusCode() == 200) {
            final String responseContent = EntityUtils.toString(response.getEntity());
            Service[] yourList = new Gson().fromJson(responseContent, Service[].class);
            existedService.addAll(Arrays.asList(yourList));
        }

        return response;
    }

    @Override
    public int requestToServe() {
        try {
            CloseableHttpResponse response = null;
            int statusCode;
            switch (this.functionCall) {
                case "create":
                    response = super.request(
                            "/services",
                            new HttpPost(),
                            this.srFrom
                    );
                    break;
                case "findUserAllServices":
                    response = this.requestFindAllServicesFromUser();
                    break;
                case "deleteService":
                    response = super.request(
                            "/services/" + this.srFrom.getId(),
                            new HttpDelete(),
                            this.srFrom
                    );
                    break;
            }
            statusCode = (response != null) ? response.getStatusLine().getStatusCode() : 500;
            return statusCode;
        } catch (IOException e) {
            e.printStackTrace();
            return 500;
        }
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
