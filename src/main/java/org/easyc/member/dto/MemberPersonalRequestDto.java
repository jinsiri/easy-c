package org.easyc.member.dto;

import lombok.Getter;
import lombok.Setter;
import org.easyc.member.constant.*;

import java.time.LocalDate;

@Getter
@Setter
public class MemberPersonalRequestDto {
    private Long memberId;

    // 생년월일
    private LocalDate dateOfBirth;
    // 성별
    private Gender gender;
    // 휴대전화
    private String phoneNumber;
    // 외부 이메일
    private String externalEmail;

    //국적
    private Nationality nationality;

    private String address; //더 상세하게 분리할지 고민 중 todo
    private String faxNumber; //팩스번호

    // 보훈 정보
    // 보훈 구분
    private VeteranType veteranType; //to enum
    // 보훈번호
    private String veteranNumber;
    // 보훈 가족 여부
    private Boolean veteranFamily;

    // 장애정보
    // 장애 등록 번호
    private String disabilityRegistrationNumber;
    // 장애구분
    private DisabilityType disabilityType;
    // 장애등급
    private String disabilityGrade;
    // 장애인정구분
    private DisabilityRecognition disabilityRecognition;

    // 계좌(급여)
    // 은행명
    private String bankName; //to enum
    // 계좌번호 (암호화)
    private String accountNumber;
    // 예금주
    private String accountHolderName;
    // 계좌 유형
    private String accountType; //to enum //todo 일반 예금이라고 되어있는데 필요한지?


    public MemberPersonalRequestDto(
            LocalDate dateOfBirth,
            Gender gender,
            String phoneNumber,
            String externalEmail,
            Nationality nationality,
            String address,
            String faxNumber,
            VeteranType veteranType,
            String veteranNumber,
            Boolean veteranFamily,
            String disabilityRegistrationNumber,
            DisabilityType disabilityType,
            String disabilityGrade,
            DisabilityRecognition disabilityRecognition,
            String bankName,
            String accountNumber,
            String accountHolderName
    ) {
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.phoneNumber = phoneNumber;
        this.externalEmail = externalEmail;
        this.nationality = nationality;
        this.address = address;
        this.faxNumber = faxNumber;
        this.veteranType = veteranType;
        this.veteranNumber = veteranNumber;
        this.veteranFamily = veteranFamily;
        this.disabilityRegistrationNumber = disabilityRegistrationNumber;
        this.disabilityType = disabilityType;
        this.disabilityGrade = disabilityGrade;
        this.disabilityRecognition = disabilityRecognition;
        this.bankName = bankName;
        this.accountNumber = accountNumber;
        this.accountHolderName = accountHolderName;
    }
}
