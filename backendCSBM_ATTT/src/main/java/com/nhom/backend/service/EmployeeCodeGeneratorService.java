package com.nhom.backend.service;

import com.nhom.backend.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

@Service
public class EmployeeCodeGeneratorService {

    private final EmployeeRepository employeeRepository;

    public EmployeeCodeGeneratorService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public synchronized String generateNextCode() {
        long total = employeeRepository.countAllEmployees() + 1;
        return String.format("EMP%05d", total);
    }
}