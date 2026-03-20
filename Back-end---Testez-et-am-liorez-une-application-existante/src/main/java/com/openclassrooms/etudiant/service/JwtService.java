package com.openclassrooms.etudiant.service;


import java.time.Instant;
import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.JWTVerifier;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private static final String ISSUER = "amlBackEnd";

    public String generateToken(UserDetails userDetails) {
        try {
    Algorithm algorithm = Algorithm.HMAC256(secret);
    Instant now = Instant.now();
    String token = JWT.create()
        .withIssuer(ISSUER)
        .withIssuedAt(now)
        .withSubject(userDetails.getUsername())
        .withClaim(
                "roles",
                userDetails.getAuthorities()
                        .stream()
                        .map(GrantedAuthority::getAuthority)
                        .toList()
        )
        .withExpiresAt(now.plusSeconds(expiration))
        .sign(algorithm);
        return token;
            } catch (JWTCreationException exception){
        return "Invalid Signing configuration";
        }  
    }

    public DecodedJWT verifyToken(String token) throws JWTVerificationException   {
        if (token == null || token.isBlank()) {
            throw new JWTVerificationException("Token cannot be null or empty");
        }
        try {
        Algorithm algorithm = Algorithm.HMAC256(secret);
        JWTVerifier verifier = JWT.require(algorithm)
                .withIssuer(ISSUER)
                .build();

        return verifier.verify(token);
         } catch (JWTVerificationException exception) {
            throw new JWTVerificationException("Token validation failed: " + exception.getMessage(), exception);
        }
    }

    public boolean isTokenValid(String token) {
    try {
        verifyToken(token);
        return true;
    } catch (JWTVerificationException exception) {
        return false;
    }
}

    public String extractUsername(String token) {
        try {
            DecodedJWT decodedJWT = verifyToken(token);
            String username = decodedJWT.getSubject();
            
            if (username == null || username.isBlank()) {
                return null;
            }
            
            return username;
        } catch (JWTVerificationException exception) {
            return null;
        }
    }

    public Collection<? extends GrantedAuthority> extractAuthorities(String token) {
        try {
            DecodedJWT decodedJWT = verifyToken(token);
            
            List<String> roles = decodedJWT.getClaim("roles").asList(String.class);
            
            if (roles == null || roles.isEmpty()) {
                return List.of();
            }
            
            return roles.stream()
                .map(SimpleGrantedAuthority::new)
                .toList();
        } catch (JWTVerificationException exception) {
            return List.of();
        }
    }

}
