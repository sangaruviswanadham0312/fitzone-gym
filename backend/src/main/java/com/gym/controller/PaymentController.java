package com.gym.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.gym.model.Payment;
import com.gym.service.PaymentService;

@RestController
@RequestMapping("/payments")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174"
})
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // Add Payment
    @PostMapping
    public Payment addPayment(@RequestBody Payment payment) {
        return paymentService.savePayment(payment);
    }

    // Get All Payments
    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentService.getAllPayments();
    }

    // Get Payment By ID
    @GetMapping("/{id}")
    public Payment getPaymentById(@PathVariable Long id) {
        Payment payment = paymentService.getPaymentById(id);

        if (payment == null) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Payment not found"
            );
        }

        return payment;
    }

    // Get Member Payment History
    @GetMapping("/member/{memberId}")
    public List<Payment> getPaymentsByMemberId(
            @PathVariable Long memberId) {
        return paymentService.getPaymentsByMemberId(memberId);
    }

    // Update Payment
    @PutMapping("/{id}")
    public Payment updatePayment(
            @PathVariable Long id,
            @RequestBody Payment updatedPayment) {

        Payment existingPayment = paymentService.getPaymentById(id);

        if (existingPayment == null) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Payment not found"
            );
        }

        existingPayment.setMemberId(updatedPayment.getMemberId());
        existingPayment.setAmount(updatedPayment.getAmount());
        existingPayment.setPaymentDate(updatedPayment.getPaymentDate());
        existingPayment.setPaymentMethod(updatedPayment.getPaymentMethod());
        existingPayment.setPaymentStatus(updatedPayment.getPaymentStatus());

        return paymentService.savePayment(existingPayment);
    }

    // Delete Payment
    @DeleteMapping("/{id}")
    public String deletePayment(@PathVariable Long id) {

        Payment existingPayment = paymentService.getPaymentById(id);

        if (existingPayment == null) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Payment not found"
            );
        }

        paymentService.deletePayment(id);

        return "Payment deleted successfully";
    }
}