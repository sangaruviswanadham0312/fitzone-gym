package com.gym.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.gym.model.Payment;
import com.gym.repository.PaymentRepository;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    // Add or Update Payment
    public Payment savePayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    // Get All Payments
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // Get Payment By ID
    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id).orElse(null);
    }

    // Get Member Payment History
    public List<Payment> getPaymentsByMemberId(Long memberId) {
        return paymentRepository.findByMemberId(memberId);
    }

    // Delete Payment
    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
    }
}