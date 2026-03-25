package com.nhom.backend.service;

import com.nhom.backend.dto.employee.EmployeeCreateRequest;
import com.nhom.backend.dto.employee.EmployeeResponse;
import com.nhom.backend.dto.employee.EmployeeUpdateRequest;
import com.nhom.backend.entity.EmployeeEntity;
import com.nhom.backend.entity.UserEntity;
import com.nhom.backend.exception.BadRequestException;
import com.nhom.backend.exception.ResourceNotFoundException;
import com.nhom.backend.repository.EmployeeRepository;
import com.nhom.backend.util.CryptoFieldUtil;
import com.nhom.backend.util.Pbkdf2Core;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    // Repository thao tác DB với bảng employee
    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    /**
     * Tạo hồ sơ nhân viên cho user hiện tại
     */
    public EmployeeResponse createProfile(UserEntity currentUser, EmployeeCreateRequest request) {

        // Kiểm tra user đã có profile chưa (1 user chỉ có 1 employee)
        if (employeeRepository.findByUser(currentUser).isPresent()) {
            throw new BadRequestException("Employee profile already exists");
        }

        // Validate code
        if (request.getCode() == null || request.getCode().isBlank()) {
            throw new BadRequestException("Code is required");
        }

        // Check trùng mã nhân viên
        if (employeeRepository.existsByCode(request.getCode())) {
            throw new BadRequestException("Employee code already exists");
        }

        // Bắt buộc phải có dataPassword (dùng để mã hóa dữ liệu nhạy cảm)
        if (request.getDataPassword() == null || request.getDataPassword().isBlank()) {
            throw new BadRequestException("dataPassword is required");
        }

        // ===== Sinh salt + hash password =====
        byte[] salt = Pbkdf2Core.randomSalt(16);
        String saltBase64 = Base64.getEncoder().encodeToString(salt);

        // Hash password bằng PBKDF2
        String dataPasswordHash = Pbkdf2Core.encodePbkdf2(request.getDataPassword(), salt, 10000, 32);

        // Sinh AES key từ password để mã hóa dữ liệu
        byte[] aesKey = Pbkdf2Core.deriveKey(request.getDataPassword(), salt, 10000, 16);

        // ===== Mapping dữ liệu thường =====
        EmployeeEntity employee = new EmployeeEntity();
        employee.setCode(request.getCode());
        employee.setName(request.getName());
        employee.setGender(request.getGender());
        employee.setDateOfBirth(request.getDateOfBirth());
        employee.setProbationaryStartDate(request.getProbationaryStartDate());
        employee.setProbationaryEndDate(request.getProbationaryEndDate());
        employee.setOfficialStartDate(request.getOfficialStartDate());
        employee.setType(request.getType());
        employee.setLevel(request.getLevel());
        employee.setGraduationYear(request.getGraduationYear());
        employee.setEducation(request.getEducation());

        // ===== Mã hóa dữ liệu nhạy cảm =====
        applyEncryptedFields(employee, request, aesKey);

        // Lưu thông tin bảo mật
        employee.setDataSalt(saltBase64);
        employee.setDataPasswordHash(dataPasswordHash);

        // Thời gian tạo / cập nhật
        employee.setCreatedAt(LocalDateTime.now().toString());
        employee.setUpdatedAt(LocalDateTime.now().toString());

        // Liên kết với user
        employee.setUser(currentUser);

        // Lưu DB
        EmployeeEntity saved = employeeRepository.save(employee);

        // Trả response (có thể decrypt nếu có password)
        return toResponse(saved, request.getDataPassword());
    }

    /**
     * Cập nhật hồ sơ của chính user
     */
    public EmployeeResponse updateMyProfile(UserEntity currentUser, EmployeeUpdateRequest request) {

        // Lấy employee theo user
        EmployeeEntity employee = employeeRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found"));

        // Kiểm tra password để giải mã
        if (request.getDataPassword() == null || request.getDataPassword().isBlank()) {
            throw new BadRequestException("dataPassword is required");
        }

        if (!Pbkdf2Core.verifyPassword(request.getDataPassword(), employee.getDataPasswordHash())) {
            throw new BadRequestException("Data password is incorrect");
        }

        // Lấy lại AES key từ salt đã lưu
        byte[] salt = Base64.getDecoder().decode(employee.getDataSalt());
        byte[] aesKey = Pbkdf2Core.deriveKey(request.getDataPassword(), salt, 10000, 16);

        // Nếu đổi code thì check trùng
        if (request.getCode() != null && !request.getCode().equals(employee.getCode())) {
            if (employeeRepository.existsByCode(request.getCode())) {
                throw new BadRequestException("Employee code already exists");
            }
            employee.setCode(request.getCode());
        }

        // Update dữ liệu thường
        employee.setName(request.getName());
        employee.setGender(request.getGender());
        employee.setDateOfBirth(request.getDateOfBirth());
        employee.setProbationaryStartDate(request.getProbationaryStartDate());
        employee.setProbationaryEndDate(request.getProbationaryEndDate());
        employee.setOfficialStartDate(request.getOfficialStartDate());
        employee.setType(request.getType());
        employee.setLevel(request.getLevel());
        employee.setGraduationYear(request.getGraduationYear());
        employee.setEducation(request.getEducation());

        // Mã hóa lại dữ liệu nhạy cảm
        applyEncryptedFields(employee, request, aesKey);

        // Update thời gian
        employee.setUpdatedAt(LocalDateTime.now().toString());

        EmployeeEntity saved = employeeRepository.save(employee);

        return toResponse(saved, request.getDataPassword());
    }

    /**
     * Lấy profile của chính mình
     */
    public EmployeeResponse getMyProfile(UserEntity currentUser, String dataPassword) {
        EmployeeEntity employee = employeeRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found"));

        return toResponse(employee, dataPassword);
    }

    /**
     * Lấy danh sách tất cả employee
     */
    public List<EmployeeResponse> getAll(String dataPassword) {
        return employeeRepository.findAll()
                .stream()
                .map(e -> toResponse(e, dataPassword))
                .collect(Collectors.toList());
    }

    /**
     * Lấy employee theo ID
     */
    public EmployeeResponse getById(Long id, String dataPassword) {
        EmployeeEntity employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        return toResponse(employee, dataPassword);
    }

    /**
     * Xóa hồ sơ employee của user hiện tại
     * ⚠️ CHỈ xóa bảng employee
     * ❌ KHÔNG xóa user (tài khoản login vẫn còn)
     */
    public void deleteMyProfile(UserEntity currentUser) {
        EmployeeEntity employee = employeeRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found"));

        employeeRepository.delete(employee);
    }

    private void applyEncryptedFields(EmployeeEntity employee, EmployeeCreateRequest request, byte[] aesKey) {
        employee.setEmailEnc(CryptoFieldUtil.encryptString(request.getEmail(), aesKey));
        employee.setTaxCodeEnc(CryptoFieldUtil.encryptString(request.getTaxCode(), aesKey));
        employee.setSocialInsuranceCodeEnc(CryptoFieldUtil.encryptString(request.getSocialInsuranceCode(), aesKey));
        employee.setPhoneNumberEnc(CryptoFieldUtil.encryptString(request.getPhoneNumber(), aesKey));
        employee.setCitizenIdentificationCodeEnc(CryptoFieldUtil.encryptString(request.getCitizenIdentificationCode(), aesKey));
        employee.setPersonalEmailEnc(CryptoFieldUtil.encryptString(request.getPersonalEmail(), aesKey));
        employee.setBirthplaceEnc(CryptoFieldUtil.encryptString(request.getBirthplace(), aesKey));
        employee.setCurrentAddressEnc(CryptoFieldUtil.encryptString(request.getCurrentAddress(), aesKey));
        employee.setPermanentAddressEnc(CryptoFieldUtil.encryptString(request.getPermanentAddress(), aesKey));
        employee.setBankNameEnc(CryptoFieldUtil.encryptString(request.getBankName(), aesKey));
        employee.setBankAccountNumberEnc(CryptoFieldUtil.encryptString(request.getBankAccountNumber(), aesKey));
    }

    private void applyEncryptedFields(EmployeeEntity employee, EmployeeUpdateRequest request, byte[] aesKey) {
        employee.setEmailEnc(CryptoFieldUtil.encryptString(request.getEmail(), aesKey));
        employee.setTaxCodeEnc(CryptoFieldUtil.encryptString(request.getTaxCode(), aesKey));
        employee.setSocialInsuranceCodeEnc(CryptoFieldUtil.encryptString(request.getSocialInsuranceCode(), aesKey));
        employee.setPhoneNumberEnc(CryptoFieldUtil.encryptString(request.getPhoneNumber(), aesKey));
        employee.setCitizenIdentificationCodeEnc(CryptoFieldUtil.encryptString(request.getCitizenIdentificationCode(), aesKey));
        employee.setPersonalEmailEnc(CryptoFieldUtil.encryptString(request.getPersonalEmail(), aesKey));
        employee.setBirthplaceEnc(CryptoFieldUtil.encryptString(request.getBirthplace(), aesKey));
        employee.setCurrentAddressEnc(CryptoFieldUtil.encryptString(request.getCurrentAddress(), aesKey));
        employee.setPermanentAddressEnc(CryptoFieldUtil.encryptString(request.getPermanentAddress(), aesKey));
        employee.setBankNameEnc(CryptoFieldUtil.encryptString(request.getBankName(), aesKey));
        employee.setBankAccountNumberEnc(CryptoFieldUtil.encryptString(request.getBankAccountNumber(), aesKey));
    }

    private EmployeeResponse toResponse(EmployeeEntity employee, String dataPassword) {
        EmployeeResponse response = new EmployeeResponse();
        response.setId(employee.getId());
        response.setCode(employee.getCode());
        response.setName(employee.getName());
        response.setGender(employee.getGender());
        response.setDateOfBirth(employee.getDateOfBirth());
        response.setProbationaryStartDate(employee.getProbationaryStartDate());
        response.setProbationaryEndDate(employee.getProbationaryEndDate());
        response.setOfficialStartDate(employee.getOfficialStartDate());
        response.setType(employee.getType());
        response.setLevel(employee.getLevel());
        response.setGraduationYear(employee.getGraduationYear());
        response.setEducation(employee.getEducation());

        boolean unlocked = false;
        if (dataPassword != null && !dataPassword.isBlank()) {
            unlocked = Pbkdf2Core.verifyPassword(dataPassword, employee.getDataPasswordHash());
        }
        response.setUnlocked(unlocked);

        if (unlocked) {
            byte[] salt = Base64.getDecoder().decode(employee.getDataSalt());
            byte[] aesKey = Pbkdf2Core.deriveKey(dataPassword, salt, 10000, 16);

            response.setEmail(CryptoFieldUtil.decryptString(employee.getEmailEnc(), aesKey));
            response.setTaxCode(CryptoFieldUtil.decryptString(employee.getTaxCodeEnc(), aesKey));
            response.setSocialInsuranceCode(CryptoFieldUtil.decryptString(employee.getSocialInsuranceCodeEnc(), aesKey));
            response.setPhoneNumber(CryptoFieldUtil.decryptString(employee.getPhoneNumberEnc(), aesKey));
            response.setCitizenIdentificationCode(CryptoFieldUtil.decryptString(employee.getCitizenIdentificationCodeEnc(), aesKey));
            response.setPersonalEmail(CryptoFieldUtil.decryptString(employee.getPersonalEmailEnc(), aesKey));
            response.setBirthplace(CryptoFieldUtil.decryptString(employee.getBirthplaceEnc(), aesKey));
            response.setCurrentAddress(CryptoFieldUtil.decryptString(employee.getCurrentAddressEnc(), aesKey));
            response.setPermanentAddress(CryptoFieldUtil.decryptString(employee.getPermanentAddressEnc(), aesKey));
            response.setBankName(CryptoFieldUtil.decryptString(employee.getBankNameEnc(), aesKey));
            response.setBankAccountNumber(CryptoFieldUtil.decryptString(employee.getBankAccountNumberEnc(), aesKey));
        } else {
            response.setEmail("****");
            response.setTaxCode("****");
            response.setSocialInsuranceCode("****");
            response.setPhoneNumber("****");
            response.setCitizenIdentificationCode("****");
            response.setPersonalEmail("****");
            response.setBirthplace("****");
            response.setCurrentAddress("****");
            response.setPermanentAddress("****");
            response.setBankName("****");
            response.setBankAccountNumber("****");
        }

        return response;
    }
}