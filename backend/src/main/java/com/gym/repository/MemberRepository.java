package com.gym.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gym.model.Member;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    // Active members
    List<Member> findByEndDateGreaterThanEqual(LocalDate date);

    // Expired members
    List<Member> findByEndDateBefore(LocalDate date);

    // Members expiring between two dates
    List<Member> findByEndDateBetween(
            LocalDate startDate,
            LocalDate endDate);

    // Search by name
    List<Member> findByNameContainingIgnoreCase(String name);

    // Search by phone
    List<Member> findByPhoneContaining(String phone);

    // Search by membership type
    List<Member> findByMembershipTypeIgnoreCase(String membershipType);
}