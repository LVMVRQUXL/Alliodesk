package fr.esgi.pa.alliodesk.core.request;

import com.google.gson.Gson;
import fr.esgi.pa.alliodesk.core.models.Service;
import fr.esgi.pa.alliodesk.core.form.InfoInForm;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.util.EntityUtils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;

public class ServiceRequest extends ApiRequest {
    private final InfoInForm form;
    private final String functionCall;

    private ArrayList<Service> existedService = new ArrayList<>();

    public ServiceRequest(String functionCall, String id, String name, String version, String source_url) {
        this.functionCall = functionCall;
        this.form = InfoInForm.build()
                .withServiceId(id)
                .withName(name)
                .withVersion(version)
                .withSourceUrl(source_url);
    }

    public ArrayList<Service> getExistedService() {
        return existedService;
    }

    private CloseableHttpResponse requestFindAllServicesOfUser() throws IOException {
        String tempId = "-1";
        final GetUserData myUser = new GetUserData();
        myUser.requestToServe();
        if (myUser.idNotEmpty()) tempId = myUser.getId();
        final CloseableHttpResponse response = super.request(
                "/users/" + tempId + "/services",
                new HttpGet(),
                this.form,
                true
        );

        if (response.getStatusLine().getStatusCode() == 200) {
            final String responseContent = EntityUtils.toString(response.getEntity());
            Service[] yourList = new Gson().fromJson(responseContent, Service[].class);
            existedService.addAll(Arrays.asList(yourList));
        }

        return response;
    }
    private CloseableHttpResponse requestFindAllServices() throws IOException {
        final GetUserData myUser = new GetUserData();
        myUser.requestToServe();
        final CloseableHttpResponse response = super.request(
                "/services",
                new HttpGet(),
                this.form,
                true
        );

        if (response.getStatusLine().getStatusCode() == 200) {
            final String responseContent = EntityUtils.toString(response.getEntity());
            Service[] yourList = new Gson().fromJson(responseContent, Service[].class);
            existedService.addAll(Arrays.asList(yourList));
        }

        return response;
    }

    private CloseableHttpResponse requestSendService() throws IOException{

        final CloseableHttpResponse response = super.request(
                "/services",
                new HttpPost(),
                this.form,
                true
        );

        return response;
    }

    private CloseableHttpResponse RequestAddServiceToUser() throws IOException {
        String tempId = "-1";
        GetUserData myUser = new GetUserData();
        myUser.requestToServe();
        if (myUser.idNotEmpty()) {
            tempId = myUser.getId();
        }

        CloseableHttpResponse response = super.request("/users/" + tempId + "/services",
                new HttpPost(),
                this.form,
                true);
        return response;
    }

    private CloseableHttpResponse requestDeleteServiceToUser() throws IOException {
        String tempId = "-1";
        GetUserData myUser = new GetUserData();
        myUser.requestToServe();
        if (myUser.idNotEmpty()) {
            tempId = myUser.getId();
        }

        CloseableHttpResponse response = super.request("/users/" + tempId + "/services/" + this.form.getService_id(),
                new HttpDelete(),
                this.form,
                true);
        return response;
    }

    @Override
    public int requestToServe() {
        try {
            CloseableHttpResponse response = null;
            switch (this.functionCall) {
                case "create":
                    response = super.request(
                            "/services",
                            new HttpPost(),
                            this.form,
                            true
                    );
                    break;
                case "addServiceToUser":
                    response = this.RequestAddServiceToUser();
                    break;
                case "deleteServiceToUser":
                    response = this.requestDeleteServiceToUser();
                    break;
                case "findAllService":
                    response = this.requestFindAllServices();
                    break;
                case "sendService":
                    response = this.requestSendService();
                    break;
                case "findUserAllServices":
                    response = this.requestFindAllServicesOfUser();
                    break;
                case "deleteService":
                    response = super.request(
                            "/services/" + this.form.getId(),
                            new HttpDelete(),
                            this.form,
                            true
                    );
                    break;
            }

            return (response != null) ? response.getStatusLine().getStatusCode() : 500;
        } catch (IOException e) {
            e.printStackTrace();
            return 500;
        }
    }

}
