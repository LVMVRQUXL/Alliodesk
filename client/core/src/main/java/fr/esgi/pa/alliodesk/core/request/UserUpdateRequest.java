package fr.esgi.pa.alliodesk.core.request;

import fr.esgi.pa.alliodesk.core.form.InfoInForm;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPut;

import java.io.IOException;

public class UserUpdateRequest extends ApiRequest  {
    InfoInForm form;

    public UserUpdateRequest(String name,String email,String password){
        this.form = InfoInForm.build()
                .withName(name)
                .withEmail(email)
                .withPassword(password);
    }
    @Override
    public int requestToServe() {
        try {
            String temp_id = "-1";
            GetUserData myid = new GetUserData();   // Rendre "myid" plus parlant ( myUser par exemple )
            myid.requestToServe();
            if (myid.idNotEmpty()) {
                temp_id = myid.getId();
            }

            final CloseableHttpResponse response = super.request(
                    "/users/"+temp_id,
                    new HttpPut(),
                    form,
                    false
            );
            return response.getStatusLine().getStatusCode();
        } catch (IOException e) {
            e.printStackTrace();
            return 500;
        }
    }
}
