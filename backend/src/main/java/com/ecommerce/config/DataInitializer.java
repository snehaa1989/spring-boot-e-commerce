package com.ecommerce.config;
import com.ecommerce.model.Role;
import com.ecommerce.model.Category;
import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.repository.RoleRepository;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

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
        
        // Create default admin user if it doesn't exist
        if (!userRepository.findByEmail("admin@ecommerce.com").isPresent()) {
            User adminUser = new User();
            adminUser.setEmail("admin@ecommerce.com");
            adminUser.setUsername("admin");
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setFirstName("Admin");
            adminUser.setLastName("User");
            adminUser.setPhone("1234567890");
            adminUser.setRoles(Arrays.asList(roleRepository.findByName("ROLE_ADMIN").orElse(null)));
            userRepository.save(adminUser);
            System.out.println("Created default admin user: admin@ecommerce.com / admin123");
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
                laptop.setImageUrl("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbmEkUkVV1nnzjp14mZCIo6Qe6upwRP3QBuw&s");
                productRepository.save(laptop);
                
                Product smartphone = new Product();
                smartphone.setName("Smartphone X");
                smartphone.setDescription("Latest smartphone with advanced features");
                smartphone.setPrice(new BigDecimal("699.99"));
                smartphone.setStockQuantity(25);
                smartphone.setCategoryId(electronics.getId());
                smartphone.setImageUrl("https://resize.indiatvnews.com/en/resize/newbucket/355_-/2025/12/all-the-new-smartphones-launching-in-december-1764583010.webp");
                productRepository.save(smartphone);
                
                Product tablet = new Product();
                tablet.setName("Tablet Pro");
                tablet.setDescription("Professional tablet for work and entertainment");
                tablet.setPrice(new BigDecimal("449.99"));
                tablet.setStockQuantity(15);
                tablet.setCategoryId(electronics.getId());
                tablet.setImageUrl("https://media-ik.croma.com/prod/https://media.tatacroma.com/Croma%20Assets/Computers%20Peripherals/Tablets%20and%20iPads/Images/308032_eo0iwq.png");
                productRepository.save(tablet);
                
                Product headphones = new Product();
                headphones.setName("Wireless Headphones");
                headphones.setDescription("Premium noise-cancelling wireless headphones");
                headphones.setPrice(new BigDecimal("199.99"));
                headphones.setStockQuantity(30);
                headphones.setCategoryId(electronics.getId());
                headphones.setImageUrl("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgXIusqnwOJaWdIteYYGqYQBS63qEzu4gALA&s");
                productRepository.save(headphones);
                
                Product smartwatch = new Product();
                smartwatch.setName("Smart Watch Ultra");
                smartwatch.setDescription("Advanced fitness and health tracking smartwatch");
                smartwatch.setPrice(new BigDecimal("299.99"));
                smartwatch.setStockQuantity(20);
                smartwatch.setCategoryId(electronics.getId());
                smartwatch.setImageUrl("https://m.media-amazon.com/images/I/61+wwNBP7aL._AC_UF1000,1000_QL80_.jpg");
                productRepository.save(smartwatch);
            }
            
            if (clothing != null) {
                Product tshirt = new Product();
                tshirt.setName("Cotton T-Shirt");
                tshirt.setDescription("Comfortable cotton t-shirt");
                tshirt.setPrice(new BigDecimal("29.99"));
                tshirt.setStockQuantity(50);
                tshirt.setCategoryId(clothing.getId());
                tshirt.setImageUrl("https://cottonworld.net/cdn/shop/files/L-TSHIRT-11670-21499-RUST_1.jpg?v=1753678084");
                productRepository.save(tshirt);
                
                Product jeans = new Product();
                jeans.setName("Denim Jeans");
                jeans.setDescription("Classic fit denim jeans");
                jeans.setPrice(new BigDecimal("79.99"));
                jeans.setStockQuantity(35);
                jeans.setCategoryId(clothing.getId());
                jeans.setImageUrl("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQexDWNRxpg8Z7iogV91DThbA7gevOkyjrgA&s");
                productRepository.save(jeans);
                
                Product dress = new Product();
                dress.setName("Summer Dress");
                dress.setDescription("Elegant summer dress for women");
                dress.setPrice(new BigDecimal("89.99"));
                dress.setStockQuantity(25);
                dress.setCategoryId(clothing.getId());
                dress.setImageUrl("https://assets.myntassets.com/w_200,q_50,,dpr_3,fl_progressive,f_webp/assets/images/2025/AUGUST/6/D9t86q5R_0223c9c2190c429499916f319f05b037.jpg");
                productRepository.save(dress);
                
                Product hoodie = new Product();
                hoodie.setName("Pullover Hoodie");
                hoodie.setDescription("Comfortable cotton hoodie with kangaroo pocket");
                hoodie.setPrice(new BigDecimal("59.99"));
                hoodie.setStockQuantity(40);
                hoodie.setCategoryId(clothing.getId());
                hoodie.setImageUrl("https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/NOVEMBER/25/S9gst3Da_15e9afc3d9504158b3a70d943f7125b0.jpg");
                productRepository.save(hoodie);
            }
            
            if (books != null) {
                Product novel = new Product();
                novel.setName("Bestseller Novel");
                novel.setDescription("Popular fiction novel");
                novel.setPrice(new BigDecimal("19.99"));
                novel.setStockQuantity(30);
                novel.setCategoryId(books.getId());
                novel.setImageUrl("https://via.placeholder.com/300x200/9C27B0/ffffff?text=Bestseller+Novel");
                productRepository.save(novel);
                
                Product textbook = new Product();
                textbook.setName("Programming Textbook");
                textbook.setDescription("Comprehensive guide to modern programming");
                textbook.setPrice(new BigDecimal("89.99"));
                textbook.setStockQuantity(20);
                textbook.setCategoryId(books.getId());
                textbook.setImageUrl("https://via.placeholder.com/300x200/4CAF50/ffffff?text=Programming+Textbook");
                productRepository.save(textbook);
                
                Product cookbook = new Product();
                cookbook.setName("International Cookbook");
                cookbook.setDescription("Collection of recipes from around the world");
                cookbook.setPrice(new BigDecimal("34.99"));
                cookbook.setStockQuantity(25);
                cookbook.setCategoryId(books.getId());
                cookbook.setImageUrl("https://via.placeholder.com/300x200/FF9800/ffffff?text=International+Cookbook");
                productRepository.save(cookbook);
                
                Product journal = new Product();
                journal.setName("Leather Journal");
                journal.setDescription("Premium leather-bound writing journal");
                journal.setPrice(new BigDecimal("24.99"));
                journal.setStockQuantity(40);
                journal.setCategoryId(books.getId());
                journal.setImageUrl("https://via.placeholder.com/300x200/795548/ffffff?text=Leather+Journal");
                productRepository.save(journal);
            }
            
            System.out.println("Created sample products");
        }
    }

