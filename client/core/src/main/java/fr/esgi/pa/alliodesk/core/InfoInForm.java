package fr.esgi.pa.alliodesk.core;

class InfoInForm {
    private String name, email, login, password;

    static class FormBuilder {
        private String name = null, email = null, login = null, password = null;

        FormBuilder withName(String name) {
            this.name = name;
            return this;
        }

        FormBuilder withEmail(String email) {
            this.email = email;
            return this;
        }

        FormBuilder withLogin(String login) {
            this.login = login;
            return this;
        }

        FormBuilder withPassword(String pwd) {
            this.name = pwd;
            return this;
        }

        InfoInForm build() {
            InfoInForm res = new InfoInForm();
            res.name = this.name;
            res.email = this.email;
            res.login = this.login;
            res.password = this.password;

            return res;
        }


    }
}
