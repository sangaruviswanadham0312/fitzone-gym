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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gym.model.Member;
import com.gym.service.MemberService;

@RestController
@RequestMapping("/members")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    // Get all members
    @GetMapping
    public List<Member> getAllMembers() {
        return memberService.getAllMembers();
    }

    // Get member by ID
    @GetMapping("/{id}")
    public Member getMemberById(@PathVariable Long id) {
        return memberService.getMemberById(id)
                .orElseThrow(() ->
                        new RuntimeException("Member not found with ID: " + id));
    }

    // Add member
    @PostMapping
    public Member addMember(@RequestBody Member member) {
        return memberService.saveMember(member);
    }

    // Update member
    @PutMapping("/{id}")
    public Member updateMember(
            @PathVariable Long id,
            @RequestBody Member member) {
        return memberService.updateMember(id, member);
    }

    // Delete member
    @DeleteMapping("/{id}")
    public String deleteMember(@PathVariable Long id) {
        memberService.deleteMember(id);
        return "Member deleted successfully";
    }

    // Get active members
    @GetMapping("/active")
    public List<Member> getActiveMembers() {
        return memberService.getActiveMembers();
    }

    // Get expired members
    @GetMapping("/expired")
    public List<Member> getExpiredMembers() {
        return memberService.getExpiredMembers();
    }

    // Get members expiring soon
    @GetMapping("/expiring-soon")
    public List<Member> getExpiringSoonMembers() {
        return memberService.getExpiringSoonMembers();
    }

    // Search members by name
    @GetMapping("/search")
    public List<Member> searchMembers(@RequestParam String name) {
        return memberService.searchMembers(name);
    }

    // Search members by phone
    @GetMapping("/phone/{phone}")
    public List<Member> searchByPhone(@PathVariable String phone) {
        return memberService.searchByPhone(phone);
    }

    // Search members by membership plan
    @GetMapping("/plan/{membershipType}")
    public List<Member> searchByMembershipType(
            @PathVariable String membershipType) {
        return memberService.searchByMembershipType(membershipType);
    }
}