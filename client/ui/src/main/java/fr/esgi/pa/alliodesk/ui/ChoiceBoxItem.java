package fr.esgi.pa.alliodesk.ui;

public class ChoiceBoxItem {
    private int id;
    private String name;

    public ChoiceBoxItem(int id, String name) {
        this.id = id;
        this.name = name;
    }

    @Override
    public String toString() {
        return this.name;
    }

    public int getId() {
        return id;
    }
}
