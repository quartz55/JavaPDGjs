public class ExceptionsTest {
    public void exceptionsTest() {
        Widget w;
        int b = 0;

        try {
            w = new Widget();
            if (w == b)
                return w;
            else return null;
        } catch (InvalidError1 e) {
            System.out.println(e);
        } catch (InvalidError2 e) {
            System.out.println(e);
        }

    }
}
