package com.nhom.backend.controller;

import com.nhom.backend.dto.employee.EmployeeCreateRequest;
import com.nhom.backend.dto.employee.EmployeeResponse;
import com.nhom.backend.dto.employee.EmployeeUpdateRequest;
import com.nhom.backend.entity.UserEntity;
import com.nhom.backend.service.EmployeeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    /**
     * API: Tạo hồ sơ nhân viên cho chính user đang đăng nhập
     * - Lấy currentUser từ filter (JWT)
     * - Nhận thông tin từ request body
     * - Gọi service để tạo profile
     */
    @PostMapping("/me")
    public ResponseEntity<EmployeeResponse> createMyProfile(
            @RequestAttribute("currentUser") UserEntity currentUser,
            @RequestBody EmployeeCreateRequest request
    ) {
        return ResponseEntity.ok(employeeService.createProfile(currentUser, request));
    }

    /**
     * API: Cập nhật hồ sơ cá nhân của user hiện tại
     * - Yêu cầu dataPassword để giải mã + mã hóa lại dữ liệu nhạy cảm
     * - Chỉ update profile của chính mình
     */
    @PutMapping("/me")
    public ResponseEntity<EmployeeResponse> updateMyProfile(
            @RequestAttribute("currentUser") UserEntity currentUser,
            @RequestBody EmployeeUpdateRequest request
    ) {
        return ResponseEntity.ok(employeeService.updateMyProfile(currentUser, request));
    }

    /**
     * API: Lấy thông tin hồ sơ cá nhân
     * - Có thể truyền header X-Data-Password để giải mã dữ liệu nhạy cảm
     * - Nếu không có password → trả về dữ liệu bị che (****)
     */
    @GetMapping("/me")
    public ResponseEntity<EmployeeResponse> getMyProfile(
            @RequestAttribute("currentUser") UserEntity currentUser,
            @RequestHeader(value = "X-Data-Password", required = false) String dataPassword
    ) {
        return ResponseEntity.ok(employeeService.getMyProfile(currentUser, dataPassword));
    }

    /**
     * API: Xóa hồ sơ cá nhân của user hiện tại
     */
    @DeleteMapping("/me")
    public ResponseEntity<?> deleteMyProfile(
            @RequestAttribute("currentUser") UserEntity currentUser
    ) {
        employeeService.deleteMyProfile(currentUser);
        return ResponseEntity.ok().body("Deleted successfully");
    }

    /**
     * API: Lấy danh sách tất cả nhân viên
     * - Có thể truyền X-Data-Password để giải mã dữ liệu nhạy cảm
     * - Nếu không → dữ liệu bị ẩn (****)
     */
    @GetMapping
    public ResponseEntity<List<EmployeeResponse>> getAll(
            @RequestHeader(value = "X-Data-Password", required = false) String dataPassword
    ) {
        return ResponseEntity.ok(employeeService.getAll(dataPassword));
    }

    /**
     * API: Lấy thông tin nhân viên theo ID
     * - Có thể truyền X-Data-Password để xem dữ liệu thật
     * - Nếu sai hoặc không có → dữ liệu bị che
     */
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponse> getById(
            @PathVariable Long id,
            @RequestHeader(value = "X-Data-Password", required = false) String dataPassword
    ) {
        return ResponseEntity.ok(employeeService.getById(id, dataPassword));
    }
}