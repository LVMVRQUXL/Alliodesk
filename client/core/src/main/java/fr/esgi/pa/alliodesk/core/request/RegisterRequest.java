package fr.esgi.pa.alliodesk.core.request;

import fr.esgi.pa.alliodesk.core.form.InfoInForm;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;

import java.io.IOException;

public class RegisterRequest extends ApiRequest {
    private final InfoInForm registerForm;

    public RegisterRequest(String name, String email, String login, String pwd) {
        this.registerForm = InfoInForm.build()
                .withName(name)
                .withEmail(email)
                .withLogin(login)
                .withPassword(pwd);
    }

    @Override
    public int requestToServe() {
        try {
            final CloseableHttpResponse request = super.request(
                    "/users",
                    new HttpPost(),
                    this.registerForm
            );
            return request.getStatusLine().getStatusCode();
        } catch (IOException e) {
            e.printStackTrace();
            return 500;
        }
    }
}

