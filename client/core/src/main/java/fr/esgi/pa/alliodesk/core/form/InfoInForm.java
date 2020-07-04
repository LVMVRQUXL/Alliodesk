package fr.esgi.pa.alliodesk.core.form;

public class InfoInForm {
    private String name,
            email,
            login,
            password,
            description,
            id,
            message,
            service_name,
            service_id,
            score,
            title,
            version,
            source_url;

    private InfoInForm() {
        this.name = null;
        this.email = null;
        this.login = null;
        this.password = null;
        this.description = null;
        this.id = null;
        this.message = null;
        this.service_name = null;
        this.service_id = null;
        this.title=null;
        this.score=null;
        this.version = null;
        this.source_url = null;
    }

    public static InfoInForm build() {
        return new InfoInForm();
    }

    public InfoInForm withName(final String name) {
        this.name = name;
        return this;
    }

    public InfoInForm withEmail(final String email) {
        this.email = email;
        return this;
    }

    public InfoInForm withLogin(final String login) {
        this.login = login;
        return this;
    }

    public InfoInForm withPassword(final String password) {
        this.password = password;
        return this;
    }

    public InfoInForm withDescription(final String desc) {
        this.description = desc;
        return this;
    }

    public InfoInForm withId(final String id) {
        this.id = id;
        return this;
    }

    public InfoInForm withMessage(final String message) {
        this.message = message;
        return this;
    }

    public InfoInForm withServiceName(final String service_name) {
        this.service_name = service_name;
        return this;
    }

    public InfoInForm withServiceId(final String service_id) {
        this.service_id = service_id;
        return this;
    }
    public InfoInForm withScore(final String score) {
        this.score = score;
        return this;
    }
    public InfoInForm withTitle(final String title) {
        this.title = title;
        return this;
    }

    public InfoInForm withVersion(final String version){
        this.version = version;
        return this;
    }

    public InfoInForm withSourceUrl(final String source_url){
        this.source_url = source_url;
        return this;
    }

    @Override
    public String toString() {
        return String.format("InfoInForm(name: %s, email: %s, login: %s, password: %s, message: %s, service_name: %s)",
                this.name, this.email, this.login, this.password, this.message, this.service_name);
    }

    public String getId() {
        return id;
    }

    public String getService_id() {
        return service_id;
    }
}
