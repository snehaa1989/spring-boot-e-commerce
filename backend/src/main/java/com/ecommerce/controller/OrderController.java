package com.ecommerce.controller;

import com.ecommerce.model.Order;
import com.ecommerce.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:3000", "http://127.0.0.1:4200", "http://127.0.0.1:3000"})
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }
    
    @GetMapping("/my-orders")
    public List<Order> getMyOrders() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();
        return orderService.getOrdersByUserId(userId);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @orderService.getOrderById(#id).get().userId == authentication.name")
    public ResponseEntity<Order> getOrderById(@PathVariable String id) {
        return orderService.getOrderById(id)
                .map(order -> ResponseEntity.ok().body(order))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();
        order.setUserId(userId);
        return orderService.createOrder(order);
    }
    
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable String id, @RequestBody Order.OrderStatus status) {
        return orderService.getOrderById(id)
                .map(order -> ResponseEntity.ok(orderService.updateOrderStatus(id, status)))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN') or @orderService.getOrderById(#id).get().userId == authentication.name")
    public ResponseEntity<?> cancelOrder(@PathVariable String id) {
        return orderService.getOrderById(id)
                .map(order -> {
                    if (order.getStatus() == Order.OrderStatus.PENDING) {
                        return ResponseEntity.ok(orderService.updateOrderStatus(id, Order.OrderStatus.CANCELLED));
                    } else {
                        return ResponseEntity.badRequest().body("Order can only be cancelled if it's in PENDING status");
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteOrder(@PathVariable String id) {
        return orderService.getOrderById(id)
                .map(order -> {
                    orderService.deleteOrder(id);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
