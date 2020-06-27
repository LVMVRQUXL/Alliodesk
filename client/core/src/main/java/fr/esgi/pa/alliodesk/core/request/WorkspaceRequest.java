package fr.esgi.pa.alliodesk.core.request;

import com.google.gson.Gson;
import fr.esgi.pa.alliodesk.core.form.InfoInForm;
import org.apache.http.client.methods.*;
import org.apache.http.util.EntityUtils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;

public class WorkspaceRequest extends ApiRequest {
    private final InfoInForm wSForm;
    private final String functionCall;
    private ArrayList<String[]> existedWS = new ArrayList<>();

    private ArrayList<ServiceRequest.Service> existedService = new ArrayList<>();

    public ArrayList<String[]> getExistedWS() {
        return existedWS;
    }

    public ArrayList<ServiceRequest.Service> getExistedService() {
        return existedService;
    }

    public WorkspaceRequest(String functionCall, String name, String description, String id, String service_id) {
        this.functionCall = functionCall;
        this.wSForm = InfoInForm.build()
                .withName(name)
                .withDescription(description)
                .withId(id)
                .withServiceId(service_id);
    }

    @Override
    public int requestToServe() {
        switch (this.functionCall) {
            case "create":
                try {
                    final CloseableHttpResponse request = super.request(
                            "/workspaces",
                            new HttpPost(),
                            this.wSForm,
                            true
                    );
                    return request.getStatusLine().getStatusCode();
                } catch (IOException e) {
                    e.printStackTrace();
                    return 500;
                }
            case "findAllUserWS":
                try {
                    String temp_id = "-1";
                    GetUserData myid = new GetUserData();   // Rendre "myid" plus parlant ( myUser par exemple )
                    myid.requestToServe();
                    if (myid.idNotEmpty()) {
                        temp_id = myid.getId();
                    }
                    final CloseableHttpResponse response = super.request(
                            "/users/" + temp_id + "/workspaces",
                            new HttpGet(),
                            this.wSForm,
                            false
                    );
                    final int statusCode = response.getStatusLine().getStatusCode();

                    if (statusCode == 200) {
                        final String responseContent = EntityUtils.toString(response.getEntity());
                        WS[] yourList = new Gson().fromJson(responseContent, WS[].class);
                        for (WS a : yourList) {
                            existedWS.add(a.getUsableData());
                        }
                    }
                    return statusCode;
                } catch (IOException e) {
                    e.printStackTrace();
                    return 500;
                }

            case "removeWSFormId":
                try {
                    final CloseableHttpResponse response = super.request(
                            "/workspaces/" + this.wSForm.getId(),
                            new HttpDelete(),
                            this.wSForm,
                            true
                    );
                    return response.getStatusLine().getStatusCode();
                } catch (IOException e) {
                    e.printStackTrace();
                    return 2;
                }

            case "updateWS":
                try {
                    final CloseableHttpResponse response = super.request(
                            "/workspaces/" + this.wSForm.getId(),
                            new HttpPut(),
                            this.wSForm,
                            true
                    );
                    return response.getStatusLine().getStatusCode();
                } catch (IOException e) {
                    e.printStackTrace();
                    return 500;
                }
            case "deleteServiceFromWorkspace":
                try {

                    final CloseableHttpResponse response = super.request(
                            "/workspaces/" + this.wSForm.getId() + "/services/" + this.wSForm.getService_id(),
                            new HttpDelete(),
                            this.wSForm,
                            false
                    );
                    return response.getStatusLine().getStatusCode();
                } catch (IOException e) {
                    e.printStackTrace();
                    return 2;
                }
            case "getWorkspaceServices":
                try {

                    final CloseableHttpResponse response = super.request(
                            "/workspaces/" + this.wSForm.getId() + "/services",
                            new HttpGet(),
                            this.wSForm,
                            false
                    );
                    final int statusCode = response.getStatusLine().getStatusCode();
                    if (statusCode == 200) {
                        final String responseContent = EntityUtils.toString(response.getEntity());
                        ServiceRequest.Service[] yourList = new Gson().fromJson(responseContent, ServiceRequest.Service[].class);
                        existedService.addAll(Arrays.asList(yourList));
                    }
                    return statusCode;
                } catch (IOException e) {
                    e.printStackTrace();
                    return 2;
                }
            case "addServiceToWS":
                try {
                    final CloseableHttpResponse response = super.request(
                            "/workspaces/" + this.wSForm.getId() + "/services",
                            new HttpPost(),
                            this.wSForm,
                            false
                    );
                    return response.getStatusLine().getStatusCode();
                } catch (IOException e) {
                    e.printStackTrace();
                    return 500;
                }

            default:
                return 2;
        }
    }

}

