package com.gym.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gym.model.MembershipPlan;
import com.gym.service.PlanService;

@RestController
@RequestMapping("/plans")
@CrossOrigin(origins = {
	    "http://localhost:5173",
	    "http://localhost:5174"
	})
public class PlanController {

    private final PlanService planService;

    public PlanController(PlanService planService) {
        this.planService = planService;
    }

    // Add Membership Plan
    @PostMapping
    public MembershipPlan addPlan(@RequestBody MembershipPlan plan) {
        return planService.savePlan(plan);
    }

    // Get All Membership Plans
    @GetMapping
    public List<MembershipPlan> getAllPlans() {
        return planService.getAllPlans();
    }

    // Get Membership Plan By ID
    @GetMapping("/{id}")
    public MembershipPlan getPlanById(@PathVariable Long id) {
        return planService.getPlanById(id);
    }

    // Update Membership Plan
    @PutMapping("/{id}")
    public MembershipPlan updatePlan(
            @PathVariable Long id,
            @RequestBody MembershipPlan plan) {

        return planService.updatePlan(id, plan);
    }

    // Delete Membership Plan
    @DeleteMapping("/{id}")
    public String deletePlan(@PathVariable Long id) {
        planService.deletePlan(id);
        return "Membership Plan deleted successfully";
    }
}