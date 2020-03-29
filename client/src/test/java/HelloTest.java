import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

class HelloTest {
    @Test
    void addittion() {
        assertEquals(5,5+0);
        assertEquals(11, 5+6);
    }

    @Test
    void soustraction() {
        assertEquals(15,20-5);
    }

    @Test
    void multiplication() {
        assertEquals(100,20*5);
    }
}
