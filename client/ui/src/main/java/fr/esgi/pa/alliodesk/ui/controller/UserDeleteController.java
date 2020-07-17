package fr.esgi.pa.alliodesk.ui.controller;

import fr.esgi.pa.alliodesk.core.request.UserDeleteRequest;

public class UserDeleteController {

    public void deleteUser() {
        UserDeleteRequest udr = new UserDeleteRequest();
        udr.requestToServe();

    }
}
