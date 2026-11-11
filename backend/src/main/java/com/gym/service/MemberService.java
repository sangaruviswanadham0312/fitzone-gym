package com.gym.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gym.model.Member;
import com.gym.repository.MemberRepository;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    // Get all members
    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    // Get member by ID
    public Optional<Member> getMemberById(Long id) {
        return memberRepository.findById(id);
    }

    // Add member
    public Member saveMember(Member member) {
        updateMembershipStatus(member);
        return memberRepository.save(member);
    }

    // Update member
    public Member updateMember(Long id, Member updatedMember) {

        Member existingMember = memberRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Member not found with ID: " + id));

        // Update basic details
        existingMember.setName(updatedMember.getName());
        existingMember.setEmail(updatedMember.getEmail());
        existingMember.setPhone(updatedMember.getPhone());
        existingMember.setAge(updatedMember.getAge());

        // Update Gender
        existingMember.setGender(updatedMember.getGender());

        // Update membership details
        existingMember.setMembershipType(
                updatedMember.getMembershipType());

        existingMember.setStartDate(updatedMember.getStartDate());
        existingMember.setEndDate(updatedMember.getEndDate());

        // Update status
        if (updatedMember.getStatus() != null) {
            existingMember.setStatus(updatedMember.getStatus());
        }

        // Check membership expiry
        updateMembershipStatus(existingMember);

        // Save updated member in database
        return memberRepository.save(existingMember);
    }

    // Update status using membership expiry date
    private void updateMembershipStatus(Member member) {

        if (member.getEndDate() == null) {
            return;
        }

        LocalDate today = LocalDate.now();

        if (member.getEndDate().isBefore(today)) {
            member.setStatus("EXPIRED");
        } else {
            member.setStatus("ACTIVE");
        }
    }

    // Delete member
    public void deleteMember(Long id) {
        memberRepository.deleteById(id);
    }

    // Get active members
    public List<Member> getActiveMembers() {
        return memberRepository.findByEndDateGreaterThanEqual(
                LocalDate.now());
    }

    // Get expired members
    public List<Member> getExpiredMembers() {
        return memberRepository.findByEndDateBefore(
                LocalDate.now());
    }

    // Get members expiring within the next 7 days
    public List<Member> getExpiringSoonMembers() {

        LocalDate today = LocalDate.now();
        LocalDate expiryLimit = today.plusDays(7);

        return memberRepository.findByEndDateBetween(
                today, expiryLimit);
    }

    // Search members by name
    public List<Member> searchMembers(String name) {
        return memberRepository.findByNameContainingIgnoreCase(name);
    }

    // Search members by phone number
    public List<Member> searchByPhone(String phone) {
        return memberRepository.findByPhoneContaining(phone);
    }

    // Search members by membership plan
    public List<Member> searchByMembershipType(String membershipType) {
        return memberRepository.findByMembershipTypeIgnoreCase(
                membershipType);
    }
}