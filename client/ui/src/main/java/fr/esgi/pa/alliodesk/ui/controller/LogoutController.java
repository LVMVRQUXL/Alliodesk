package fr.esgi.pa.alliodesk.ui.controller;

import fr.esgi.pa.alliodesk.core.request.LogoutRequest;

public class LogoutController {

    public void logoutUser() {
        LogoutRequest lr = new LogoutRequest();
        lr.requestToServe();

    }
}
