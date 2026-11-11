package com.gym.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.gym.model.MembershipPlan;

public interface PlanRepository
        extends JpaRepository<MembershipPlan, Long> {

}