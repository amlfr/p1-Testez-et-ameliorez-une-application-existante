package com.openclassrooms.etudiant.filter;

import com.openclassrooms.etudiant.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
public class JwtFilterTest {
    private static final String TOKEN = "validToken";
    private static final String USERNAME = "john";

    @Mock
    private JwtService jwtService;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    private JWTFilter jwtFilter;

    @BeforeEach
    void setUp() {
        jwtFilter = new JWTFilter(jwtService);
        SecurityContextHolder.clearContext();
    }

    @Test
    void test_doFilterInternal_valid_token() throws Exception {
        // GIVEN
        when(request.getHeader("Authorization")).thenReturn("Bearer " + TOKEN);
        when(jwtService.extractUsername(TOKEN)).thenReturn(USERNAME);
        when(jwtService.isTokenValid(TOKEN)).thenReturn(true);
        doReturn(List.of(new SimpleGrantedAuthority("ROLE_USER")))
                .when(jwtService).extractAuthorities(TOKEN);

        // WHEN
        jwtFilter.doFilterInternal(request, response, filterChain);

        // THEN
        verify(filterChain).doFilter(request, response);
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNotNull();
        assertThat(SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .isEqualTo(USERNAME);
    }
}