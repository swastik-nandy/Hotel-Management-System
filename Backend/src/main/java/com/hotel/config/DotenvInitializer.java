import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class DotenvInitializer {

    @PostConstruct
    public void init() {
        Dotenv dotenv = Dotenv.configure()
            .ignoreIfMalformed()
            .ignoreIfMissing() 
            .load();

        // Load vars into system properties
        dotenv.entries().forEach(entry ->
            System.setProperty(entry.getKey(), entry.getValue())
        );
    }
}
