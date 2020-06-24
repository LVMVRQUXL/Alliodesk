package fr.esgi.pa.alliodesk.core.request;

import fr.esgi.pa.alliodesk.core.form.InfoInForm;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;

import java.io.IOException;

public class AllioErrorRequest extends ApiRequest {
    private final InfoInForm errorForm;

    public AllioErrorRequest(String message) {
        this.errorForm = InfoInForm.build()
                .withMessage(message);
    }

    @Override
    public int requestToServe() {
        try {
            final CloseableHttpResponse request = super.request(
                    "/errors",
                    new HttpPost(),
                    this.errorForm,
                    true
            );
            return request.getStatusLine().getStatusCode();
        } catch (IOException e) {
            e.printStackTrace();
            return 500;
        }
    }
}
