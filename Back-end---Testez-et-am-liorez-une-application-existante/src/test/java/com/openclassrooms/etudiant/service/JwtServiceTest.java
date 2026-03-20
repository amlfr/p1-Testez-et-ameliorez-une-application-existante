package com.openclassrooms.etudiant.service;

import com.auth0.jwt.interfaces.DecodedJWT;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Collection;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(SpringExtension.class)
public class JwtServiceTest {

    private JwtService jwtService;

    private static final String SECRET = "kjpjlqykH2i8th4iAAqtmKJJzldFGByDpAapkixOZ78=";
    private static final long EXPIRATION = 3600L;
    private static final String USERNAME = "Pierre";
    private static final String ROLE = "login";

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secret", SECRET);
        ReflectionTestUtils.setField(jwtService, "expiration", EXPIRATION);
    }

    @Test
    void test_generate_token() {
        // GIVEN
        UserDetails userDetails = new User(
                USERNAME,
                "password",
                List.of(new SimpleGrantedAuthority(ROLE))
        );

        // WHEN
        String token = jwtService.generateToken(userDetails);

        // THEN
        assertThat(token).isNotNull();
        assertThat(token).isNotBlank();
    }

    @Test
    void test_verify_token() {
        // GIVEN
        UserDetails userDetails = new User(
                USERNAME,
                "password",
                List.of(new SimpleGrantedAuthority(ROLE))
        );

        String token = jwtService.generateToken(userDetails);

        // WHEN
        DecodedJWT decodedJWT = jwtService.verifyToken(token);

        // THEN
        assertThat(decodedJWT).isNotNull();
        assertThat(decodedJWT.getSubject()).isEqualTo(USERNAME);
    }

    @Test
    void test_is_token_valid() {
        // GIVEN
        UserDetails userDetails = new User(
                USERNAME,
                "password",
                List.of(new SimpleGrantedAuthority(ROLE))
        );

        String token = jwtService.generateToken(userDetails);

        // WHEN
        boolean result = jwtService.isTokenValid(token);

        // THEN
        assertThat(result).isTrue();
    }

    @Test
    void test_extract_username() {
        // GIVEN
        UserDetails userDetails = new User(
                USERNAME,
                "password",
                List.of(new SimpleGrantedAuthority(ROLE))
        );

        String token = jwtService.generateToken(userDetails);

        // WHEN
        String username = jwtService.extractUsername(token);

        // THEN
        assertThat(username).isEqualTo(USERNAME);
    }

    @Test
    void test_extract_authorities() {
        // GIVEN
        UserDetails userDetails = new User(
                USERNAME,
                "password",
                List.of(new SimpleGrantedAuthority(ROLE))
        );

        String token = jwtService.generateToken(userDetails);

        // WHEN
        Collection<?> authorities = jwtService.extractAuthorities(token);

        // THEN
        assertThat(authorities).hasSize(1);
        assertThat(authorities.iterator().next().toString()).isEqualTo(ROLE);
    }

    @Test
    void test_extract_username_invalid_token() { 
        
    }
}
