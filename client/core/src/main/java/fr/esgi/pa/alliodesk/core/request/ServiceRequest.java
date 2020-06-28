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

    public ServiceRequest(String functionCall, String id) {
        this.functionCall = functionCall;
        this.form = InfoInForm.build()
                .withId(id);
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
