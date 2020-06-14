package fr.esgi.pa.alliodesk.core.request;

import com.google.gson.Gson;
import fr.esgi.pa.alliodesk.core.InfoInForm;
import org.apache.http.client.methods.*;
import org.apache.http.util.EntityUtils;
import java.io.IOException;
import java.util.ArrayList;

public class WorkspaceManager extends ApiRequest{
    private final InfoInForm wSFrom;
    private final String functionCall;
    private ArrayList<String[]> existedWS = new ArrayList<String[]>();

    public ArrayList<String[]> getExistedWS() {
        return existedWS;
    }

    public WorkspaceManager(String functionCall, String name, String description) {
        this.functionCall = functionCall;
        this.wSFrom = InfoInForm.build()
                .withName(name)
                .withDescription(description);
    }

    //POST JSON

    @Override
    public int requestToServe() {
        switch (this.functionCall) {
            case "create":
                try {
                    final CloseableHttpResponse request = super.request(
                            "/workspaces",
                            new HttpPost(),
                            this.wSFrom
                    );
                    return request.getStatusLine().getStatusCode();
                } catch (IOException e) {
                    e.printStackTrace();
                    return 500;
                }
            case "findAllUserWS":
                try {
                    int n = 1;
                    final CloseableHttpResponse response = super.request(
                            "/users/"+n+"/workspaces",
                            new HttpGet(),
                            this.wSFrom
                    );
                    final int statusCode = response.getStatusLine().getStatusCode();

                    if (statusCode == 200) {
                        final String responseContent = EntityUtils.toString(response.getEntity());
                        System.out.println(responseContent);
                        WS[] yourList = new Gson().fromJson(responseContent,WS[].class);
                        for (WS a : yourList){
                            System.out.println(a);
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
                            "/workspaces/"+this.wSFrom.getName(),
                            new HttpDelete(),
                            this.wSFrom
                    );
                    final int statusCode = response.getStatusLine().getStatusCode();
                    return statusCode;
                } catch (IOException e) {
                    e.printStackTrace();
                    return 2;
                }

            case "updateWS":
                try {
                    int n = 3;
                    final CloseableHttpResponse response = super.request(
                            "/workspaces/"+n,
                            new HttpPut(),
                            this.wSFrom
                    );
                    final int statusCode = response.getStatusLine().getStatusCode();
                    return statusCode;
                } catch (IOException e) {
                    e.printStackTrace();
                    return 500;
                }


            default:
                return 2;
        }
    }


}
class WS{
    String id,name,description,user_id;
    WS(String id,String name,String description,String user_id){
        this.id=id;
        this.name=name;
        this.description=description;
        this.user_id=user_id;
    }
    public String[] getUsableData(){
        String[] res = {this.id,this.name};
        return res;
    }

    @Override
    public String toString() {
        return "WS{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", user_id='" + user_id + '\'' +
                '}';
    }
}