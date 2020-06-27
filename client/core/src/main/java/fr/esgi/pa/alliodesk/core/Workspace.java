package fr.esgi.pa.alliodesk.core;

public class Workspace {
    private String id, name, description, user_id;

   public Workspace(String id, String name, String description, String user_id) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.user_id = user_id;
    }

    public String[] getUsableData() {
        return new String[]{this.id, this.name};
    }

    @Override
    public String toString() {
        return "Workspace{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", user_id='" + user_id + '\'' +
                '}';
    }
}
