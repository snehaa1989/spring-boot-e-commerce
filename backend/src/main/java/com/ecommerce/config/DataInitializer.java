package com.ecommerce.config;

import com.ecommerce.model.Role;
import com.ecommerce.model.Category;
import com.ecommerce.model.Product;
import com.ecommerce.repository.RoleRepository;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        // Initialize roles if they don't exist
        if (!roleRepository.findByName("ROLE_USER").isPresent()) {
            Role userRole = new Role();
            userRole.setName("ROLE_USER");
            roleRepository.save(userRole);
            System.out.println("Created ROLE_USER");
        }

        if (!roleRepository.findByName("ROLE_ADMIN").isPresent()) {
            Role adminRole = new Role();
            adminRole.setName("ROLE_ADMIN");
            roleRepository.save(adminRole);
            System.out.println("Created ROLE_ADMIN");
        }
        
        // Initialize categories if they don't exist
        if (categoryRepository.count() == 0) {
            Category electronics = new Category();
            electronics.setName("Electronics");
            electronics.setDescription("Electronic devices and gadgets");
            categoryRepository.save(electronics);
            
            Category clothing = new Category();
            clothing.setName("Clothing");
            clothing.setDescription("Fashion and apparel");
            categoryRepository.save(clothing);
            
            Category books = new Category();
            books.setName("Books");
            books.setDescription("Books and literature");
            categoryRepository.save(books);
            
            System.out.println("Created sample categories");
        }
        
        // Initialize products - clear existing to refresh with new image URLs
        productRepository.deleteAll();
        
        Category electronics = categoryRepository.findByName("Electronics").orElse(null);
        Category clothing = categoryRepository.findByName("Clothing").orElse(null);
        Category books = categoryRepository.findByName("Books").orElse(null);
        
        if (electronics != null) {
            Product laptop = new Product();
            laptop.setName("Laptop Pro");
            laptop.setDescription("High-performance laptop for professionals");
            laptop.setPrice(new BigDecimal("999.99"));
            laptop.setStockQuantity(10);
            laptop.setCategoryId(electronics.getId());
            laptop.setImageUrl("https://p2-ofp.static.pub//fes/cms/2024/07/17/109vq5fdalv01w5jsu6vh35ncnk5jn890135.png");
            productRepository.save(laptop);
            
            Product smartphone = new Product();
            smartphone.setName("Smartphone X");
            smartphone.setDescription("Latest smartphone with advanced features");
            smartphone.setPrice(new BigDecimal("699.99"));
            smartphone.setStockQuantity(25);
            smartphone.setCategoryId(electronics.getId());
            smartphone.setImageUrl("https://platform.theverge.com/wp-content/uploads/sites/2/2025/04/257690_Google_Pixel_9A_AJohnson_0001.jpg?quality=90&strip=all&crop=16.675%2C0%2C66.65%2C100&w=2400");
            productRepository.save(smartphone);
        }
        
        if (clothing != null) {
            Product tshirt = new Product();
            tshirt.setName("Cotton T-Shirt");
            tshirt.setDescription("Comfortable cotton t-shirt");
            tshirt.setPrice(new BigDecimal("29.99"));
            tshirt.setStockQuantity(50);
            tshirt.setCategoryId(clothing.getId());
            tshirt.setImageUrl("");
            productRepository.save(tshirt);
        }
        
        if (books != null) {
            Product novel = new Product();
            novel.setName("Bestseller Novel");
            novel.setDescription("Popular fiction novel");
            novel.setPrice(new BigDecimal("19.99"));
            novel.setStockQuantity(30);
            novel.setCategoryId(books.getId());
            novel.setImageUrl("");
            productRepository.save(novel);
        }
        
        System.out.println("Created sample products");
    }
}
