package com.hotel.controller;

import com.hotel.model.Price;
import com.hotel.repository.PriceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PriceController {

    private static final Logger logger = LoggerFactory.getLogger(PriceController.class);

    @Autowired
    private PriceRepository priceRepository;

    @GetMapping("/price")
    public ResponseEntity<List<Price>> getAllPrices() {
        logger.info("Fetching all room prices");
        List<Price> prices = priceRepository.findAll();
        return ResponseEntity.ok(prices);
    }
} 
