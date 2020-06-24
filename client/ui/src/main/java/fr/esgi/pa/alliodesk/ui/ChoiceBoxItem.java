package fr.esgi.pa.alliodesk.ui;

public class ChoiceBoxItem {
    private String id;
    private String name;

    public ChoiceBoxItem(String id, String name) {
        this.id = id;
        this.name = name;
    }

    @Override
    public String toString() {
        return this.name;
    }

    public String getId() {
        return id;
    }
}
