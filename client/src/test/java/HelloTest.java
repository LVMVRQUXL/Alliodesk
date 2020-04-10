import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

class HelloTest {
    @Test
    void addittion() {
        assertEquals(5,5+1);
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
