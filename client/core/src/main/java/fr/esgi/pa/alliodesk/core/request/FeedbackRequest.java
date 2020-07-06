package fr.esgi.pa.alliodesk.core.request;

import fr.esgi.pa.alliodesk.core.form.InfoInForm;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;

import java.io.IOException;

public class FeedbackRequest extends ApiRequest{
    private final InfoInForm form;

    public FeedbackRequest(String score, String title,String description,String service_id) {
        this.form = InfoInForm.build()
                .withScore(score)
                .withTitle(title)
                .withDescription(description)
                .withServiceId(service_id);
    }

    @Override
    public int requestToServe() {
        try {
            final CloseableHttpResponse request = super.request(
                    "/feedbacks",
                    new HttpPost(),
                    this.form,
                    true
            );

            return request.getStatusLine().getStatusCode();
        } catch (IOException e) {
            e.printStackTrace();
            return 500;
        }
    }
}
