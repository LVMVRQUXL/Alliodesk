import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Test;

class HelloTest {
    Hello h = new Hello();
    @org.junit.jupiter.api.Test
    void addittion() {
        assertEquals(5,Hello.addittion(5,0));
        assertEquals(11,Hello.addittion(5,6));
    }

    @org.junit.jupiter.api.Test
    void soustraction() {
        assertEquals(15,Hello.soustraction(20,5));
    }

    @org.junit.jupiter.api.Test
    void multiplication() {
        assertEquals(100,Hello.multiplication(20,5));
    }
}
