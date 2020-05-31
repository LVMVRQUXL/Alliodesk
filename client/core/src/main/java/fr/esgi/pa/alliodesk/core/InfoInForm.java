package fr.esgi.pa.alliodesk.core;

class InfoInForm {
    private String name, email, login, password;

    private InfoInForm() {
        this.name = null;
        this.email = null;
        this.login = null;
        this.password = null;
    }

    static InfoInForm build() {
        return new InfoInForm();
    }

    InfoInForm withName(final String name) {
        this.name = name;
        return this;
    }

    InfoInForm withEmail(final String email) {
        this.email = email;
        return this;
    }

    InfoInForm withLogin(final String login) {
        this.login = login;
        return this;
    }

    InfoInForm withPassword(final String password) {
        this.password = password;
        return this;
    }

    @Override
    public String toString() {
        return String.format("InfoInForm(name: %s, email: %s, login: %s, password: %s)",
                this.name, this.email, this.login, this.password);
    }
}
