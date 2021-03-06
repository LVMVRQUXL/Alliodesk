package fr.esgi.pa.alliodesk.core.models;

public class Service {
   private final String id, name, version, source_url, user_id, service_status_id,update_config_link;


    public Service(String id, String name, String version, String source_url, String user_id, String service_status_id, String update_config_link) {
        this.id = id;
        this.name = name;
        this.version = version;
        this.source_url = source_url;
        this.user_id = user_id;
        this.service_status_id = service_status_id;
        this.update_config_link = update_config_link;
    }

    @Override
    public String toString() {
        return String.format("Service{ id = %s, name = %s, version = %s, source_url = %s, user_id = %s, service_status_id = %s, update_config_link= %s",
                id,name,version,source_url,user_id,service_status_id, update_config_link);
    }

    public String getName() {
        return name;
    }

    public String getId() {
        return id;
    }

    public String getSource_url() {
        return source_url;
    }

    public String getUpdate_config_link() { return update_config_link; }
}
