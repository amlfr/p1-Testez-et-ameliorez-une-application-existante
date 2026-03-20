package com.openclassrooms.etudiant.controller;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.openclassrooms.etudiant.dto.LoginDTO;
import com.openclassrooms.etudiant.dto.RegisterDTO;
import com.openclassrooms.etudiant.dto.StudentRequestDTO;
import com.openclassrooms.etudiant.entities.Student;
import com.openclassrooms.etudiant.repository.StudentRepository;
import com.openclassrooms.etudiant.repository.UserRepository;
import com.openclassrooms.etudiant.service.StudentService;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

import java.time.LocalDate;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Testcontainers
public class StudentControllerTest {

    private static final String BASE_URL = "/api/student";
    private static final String FIRST_NAME = "John";
    private static final String LAST_NAME = "Doe";
    private static final String LOGIN = "testuser";
    private static final String PASSWORD = "testpassword";
    private static final String DATE_OF_BIRTH_STRING = "1995-05-05";

    @Container
    static MySQLContainer mySQLContainer = new MySQLContainer("mysql:8");

    @Autowired
    private StudentService studentService;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private MockMvc mockMvc;

    private String jwtToken;

    @DynamicPropertySource
    static void configureTestProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", () -> mySQLContainer.getJdbcUrl());
        registry.add("spring.datasource.username", () -> mySQLContainer.getUsername());
        registry.add("spring.datasource.password", () -> mySQLContainer.getPassword());
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "create");
    }

    @BeforeEach
    public void beforeEach() throws Exception {
        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.setFirstName("StudentController");
        registerDTO.setLastName("TestName");
        registerDTO.setLogin(LOGIN);
        registerDTO.setPassword(PASSWORD);

        mockMvc.perform(MockMvcRequestBuilders.post("/api/register")
                .content(objectMapper.writeValueAsString(registerDTO))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)).andDo(print());

        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setLogin(LOGIN);
        loginDTO.setPassword(PASSWORD);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.post("/api/login")
                        .content(objectMapper.writeValueAsString(loginDTO))
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)).andDo(print())
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        jwtToken = objectMapper.readTree(responseBody).get("token").asText();
    }

    @AfterEach
    public void afterEach() {
        studentRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    public void createStudentSuccessful() throws Exception {
        // GIVEN
        StudentRequestDTO studentRequestDTO = new StudentRequestDTO(FIRST_NAME, LAST_NAME, DATE_OF_BIRTH_STRING);

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.post(BASE_URL + "/create")
                        .header("Authorization", "Bearer " + jwtToken)
                        .content(objectMapper.writeValueAsString(studentRequestDTO))
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.lastName").value(LAST_NAME));
    }

    @Test
    public void getAllStudentsSuccessful() throws Exception {
        // GIVEN
        Student student = new Student();
        student.setFirstName(FIRST_NAME);
        student.setLastName(LAST_NAME);
        student.setDateOfBirth(LocalDate.of(1995,05,05));
        studentService.create(student);

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.get(BASE_URL + "/getall")
                        .header("Authorization", "Bearer " + jwtToken)
                        .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].lastName").value(LAST_NAME));
    }

    @Test
    public void getStudentInfoSuccessful() throws Exception {
        // GIVEN
        Student student = new Student();
        student.setFirstName(FIRST_NAME);
        student.setLastName(LAST_NAME);
        student.setDateOfBirth(LocalDate.of(1995,05,05));
        Student saved = studentService.create(student);

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.get(BASE_URL + "/getInfo/" + saved.getId())
                        .header("Authorization", "Bearer " + jwtToken)
                        .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.lastName").value(LAST_NAME));
    }

    @Test
    public void updateStudentSuccessful() throws Exception {
        // GIVEN
        Student student = new Student();
        student.setFirstName(FIRST_NAME);
        student.setLastName(LAST_NAME);
        student.setDateOfBirth(LocalDate.of(1995,05,05));
        Student saved = studentService.create(student);

        StudentRequestDTO updateDTO = new StudentRequestDTO("Jane", "Smith", "1997-07-07");

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.post(BASE_URL + "/update/" + saved.getId())
                        .header("Authorization", "Bearer " + jwtToken)
                        .content(objectMapper.writeValueAsString(updateDTO))
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.lastName").value("Smith"));
    }

    @Test
    public void deleteStudentSuccessful() throws Exception {
        // GIVEN
        Student student = new Student();
        student.setFirstName(FIRST_NAME);
        student.setLastName(LAST_NAME);
        student.setDateOfBirth(LocalDate.of(1995,05,05));
        Student savedStudent = studentService.create(student);

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders.delete(BASE_URL + "/delete/" + savedStudent.getId())
                        .header("Authorization", "Bearer " + jwtToken)
                        .accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(MockMvcResultMatchers.status().isNoContent());
    }
}