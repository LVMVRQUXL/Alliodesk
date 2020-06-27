package fr.esgi.pa.alliodesk.core;

public class Service {
    String id, name, version, source_url, user_id, service_status_id;


    public Service(String id, String name, String version, String source_url, String user_id, String service_status_id) {
        this.id = id;
        this.name = name;
        this.version = version;
        this.source_url = source_url;
        this.user_id = user_id;
        this.service_status_id = service_status_id;
    }

    @Override
    public String toString() {
        return "Service{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", version='" + version + '\'' +
                ", source_url='" + source_url + '\'' +
                ", user_id='" + user_id + '\'' +
                ", service_status_id='" + service_status_id + '\'' +
                '}';
    }

    public String getName() {
        return name;
    }

    public String getId() {
        return id;
    }
}
