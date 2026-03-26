package com.nhom.backend.repository.specification;

import com.nhom.backend.dto.employee.EmployeeSearchRequest;
import com.nhom.backend.entity.EmployeeEntity;
import org.springframework.data.jpa.domain.Specification;

public class EmployeeSpecification {

    private EmployeeSpecification() {
    }

    public static Specification<EmployeeEntity> build(EmployeeSearchRequest request) {
        return Specification.where(hasCode(request.getCode()))
                .and(hasName(request.getName()))
                .and(hasGender(request.getGender()))
                .and(hasType(request.getType()))
                .and(hasLevel(request.getLevel()))
                .and(hasEducation(request.getEducation()))
                .and(hasGraduationYear(request.getGraduationYear()));
    }

    private static Specification<EmployeeEntity> hasCode(String code) {
        return (root, query, cb) ->
                code == null || code.isBlank() ? null : cb.like(cb.lower(root.get("code")), "%" + code.toLowerCase() + "%");
    }

    private static Specification<EmployeeEntity> hasName(String name) {
        return (root, query, cb) ->
                name == null || name.isBlank() ? null : cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    private static Specification<EmployeeEntity> hasGender(String gender) {
        return (root, query, cb) ->
                gender == null || gender.isBlank() ? null : cb.equal(cb.lower(root.get("gender")), gender.toLowerCase());
    }

    private static Specification<EmployeeEntity> hasType(String type) {
        return (root, query, cb) ->
                type == null || type.isBlank() ? null : cb.like(cb.lower(root.get("type")), "%" + type.toLowerCase() + "%");
    }

    private static Specification<EmployeeEntity> hasLevel(String level) {
        return (root, query, cb) ->
                level == null || level.isBlank() ? null : cb.like(cb.lower(root.get("level")), "%" + level.toLowerCase() + "%");
    }

    private static Specification<EmployeeEntity> hasEducation(String education) {
        return (root, query, cb) ->
                education == null || education.isBlank() ? null : cb.like(cb.lower(root.get("education")), "%" + education.toLowerCase() + "%");
    }

    private static Specification<EmployeeEntity> hasGraduationYear(String graduationYear) {
        return (root, query, cb) ->
                graduationYear == null || graduationYear.isBlank() ? null : cb.equal(root.get("graduationYear"), graduationYear);
    }
}