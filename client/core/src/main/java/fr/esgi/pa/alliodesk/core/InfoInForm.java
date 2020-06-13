package fr.esgi.pa.alliodesk.core;

public class InfoInForm {
    private String name, email, login, password, description, id, message, serviceName;

    private InfoInForm() {
        this.name = null;
        this.email = null;
        this.login = null;
        this.password = null;
        this.description = null;
        this.id = null;
        this.message = null;
        this.serviceName = null;
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

    public InfoInForm withServiceName(final String serviceName) {
        this.serviceName = serviceName;
        return this;
    }

    @Override
    public String toString() {
        return String.format("InfoInForm(name: %s, email: %s, login: %s, password: %s, message: %s, serviceName: %s)",
                this.name, this.email, this.login, this.password, this.message, this.serviceName);
    }

    public String getId() {
        return id;
    }
}
