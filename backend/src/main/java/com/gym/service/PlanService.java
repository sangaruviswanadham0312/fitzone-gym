package com.gym.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.gym.model.MembershipPlan;
import com.gym.repository.PlanRepository;

@Service
public class PlanService {

    private final PlanRepository planRepository;

    public PlanService(PlanRepository planRepository) {
        this.planRepository = planRepository;
    }

    // Add Plan
    public MembershipPlan savePlan(MembershipPlan plan) {
        return planRepository.save(plan);
    }

    // Get All Plans
    public List<MembershipPlan> getAllPlans() {
        return planRepository.findAll();
    }

    // Get Plan By ID
    public MembershipPlan getPlanById(Long id) {
        return planRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Plan not found"));
    }

    // Update Plan
    public MembershipPlan updatePlan(
            Long id, MembershipPlan plan) {

        MembershipPlan existingPlan = getPlanById(id);

        existingPlan.setPlanName(plan.getPlanName());
        existingPlan.setDurationMonths(plan.getDurationMonths());
        existingPlan.setPrice(plan.getPrice());
        existingPlan.setDescription(plan.getDescription());

        return planRepository.save(existingPlan);
    }

    // Delete Plan
    public void deletePlan(Long id) {
        if (!planRepository.existsById(id)) {
            throw new RuntimeException("Plan not found");
        }

        planRepository.deleteById(id);
    }
}