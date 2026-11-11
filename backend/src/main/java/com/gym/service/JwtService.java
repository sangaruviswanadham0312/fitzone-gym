package com.gym.service;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final SecretKey secretKey = Keys.hmacShaKeyFor(
        "FitZoneGymSecretKey2026ForJwtTokenGeneration123456"
            .getBytes(java.nio.charset.StandardCharsets.UTF_8)
    );

    public String generateToken(String username, String role) {

        long expirationTime = 1000 * 60 * 60;

        return Jwts.builder()
                .subject(username)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(
                    new Date(System.currentTimeMillis() + expirationTime)
                )
                .signWith(secretKey)
                .compact();
    }

    public String extractUsername(String token) {

        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public String extractRole(String token) {

        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("role", String.class);
    }

    public boolean isTokenValid(String token, String username) {

        try {
            return username.equals(extractUsername(token));
        } catch (Exception e) {
            return false;
        }
    }
}