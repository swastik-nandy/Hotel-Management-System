package com.hotel.service;

import com.hotel.model.Booking;
import com.lowagie.text.DocumentException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;

@Service
public class PdfService {

    @Value("${app.hotel.name}")
    private String hotelName;

    @Autowired
    private TemplateEngine templateEngine;

    public byte[] generateReceipt(Booking booking) {
        try {
            // Prepare dynamic values for the HTML template
            Context context = new Context();
            context.setVariable("hotelName", hotelName);
            context.setVariable("booking", booking);

            // Render HTML using Thymeleaf
            String htmlContent = templateEngine.process("receipt", context);

            // ✅ Log the generated HTML for debugging
            System.out.println("🔍 HTML to render:\n" + htmlContent);

            // Convert HTML to PDF using Flying Saucer
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(htmlContent);
            renderer.layout();

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            renderer.createPDF(baos);

            return baos.toByteArray();

        } catch (DocumentException e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }

    public ByteArrayResource getPdfAsResource(Booking booking) {
        return new ByteArrayResource(generateReceipt(booking));
    }
}
