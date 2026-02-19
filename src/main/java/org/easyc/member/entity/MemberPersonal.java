package org.easyc.member.entity;

import jakarta.persistence.*;
import lombok.*;
import org.easyc.common.entity.BaseEntity;
import org.easyc.member.constant.*;
import org.easyc.member.dto.MemberPersonalRequestDto;

import java.time.LocalDate;

@Entity
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Getter
public class MemberPersonal extends BaseEntity { //회원정보_개인정보

    @Id
    private Long memberId;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="member_id")
    private Member member;

    // 생년월일
    private LocalDate dateOfBirth;
    // 성별
    @Enumerated(EnumType.STRING)
    private Gender gender;
    // 휴대전화
    private String phoneNumber;
    // 외부 이메일
    private String externalEmail;

    //국적
    @Enumerated(EnumType.STRING)
    private Nationality nationality;

    private String address; //더 상세하게 분리할지 고민 중 todo
    private String faxNumber; //팩스번호

    // 보훈 정보
    // 보훈 구분
    @Enumerated(EnumType.STRING)
    private VeteranType veteranType; //to enum
    // 보훈번호
    private String veteranNumber;
    // 보훈 가족 여부
    private Boolean veteranFamily;

    // 장애정보
    // 장애 등록 번호
    private String disabilityRegistrationNumber;
    // 장애구분
    @Enumerated(EnumType.STRING)
    private DisabilityType disabilityType;
    // 장애등급
    private String disabilityGrade;
    // 장애인정구분
    @Enumerated(EnumType.STRING)
    private DisabilityRecognition disabilityRecognition;

    // 계좌(급여)
    // 은행명
    private String bankName; //to enum
    // 계좌번호 (암호화)
    private String accountNumber;
    // 예금주
    private String accountHolderName;
    // 계좌 유형
    private String accountType; //to enum //todo 일반 예금이라고 되어있는데 필요한지? 뭐 들어가야하는지


    private MemberPersonal(Member member, MemberPersonalRequestDto dto) {
        this.member = member;
        this.dateOfBirth = dto.getDateOfBirth();
        this.gender = dto.getGender();
        this.phoneNumber = dto.getPhoneNumber();
        this.externalEmail = dto.getExternalEmail();
        this.nationality = dto.getNationality();
        this.address = dto.getAddress();
        this.faxNumber = dto.getFaxNumber();
        this.veteranType = dto.getVeteranType();
        this.veteranNumber = dto.getVeteranNumber();
        this.veteranFamily = dto.getVeteranFamily();
        this.disabilityRegistrationNumber = dto.getDisabilityRegistrationNumber();
        this.disabilityType = dto.getDisabilityType();
        this.disabilityGrade = dto.getDisabilityGrade();
        this.disabilityRecognition = dto.getDisabilityRecognition();
        this.bankName = dto.getBankName();
        this.accountNumber = dto.getAccountNumber();
        this.accountHolderName = dto.getAccountHolderName();
        this.accountType = dto.getAccountType();
    }

    public void update(MemberPersonalRequestDto dto) {
        this.dateOfBirth = dto.getDateOfBirth();
        this.gender = dto.getGender();
        this.phoneNumber = dto.getPhoneNumber();
        this.externalEmail = dto.getExternalEmail();
        this.nationality = dto.getNationality();
        this.address = dto.getAddress();
        this.faxNumber = dto.getFaxNumber();
        this.veteranType = dto.getVeteranType();
        this.veteranNumber = dto.getVeteranNumber();
        this.veteranFamily = dto.getVeteranFamily();
        this.disabilityRegistrationNumber = dto.getDisabilityRegistrationNumber();
        this.disabilityType = dto.getDisabilityType();
        this.disabilityGrade = dto.getDisabilityGrade();
        this.disabilityRecognition = dto.getDisabilityRecognition();
        this.bankName = dto.getBankName();
        this.accountNumber = dto.getAccountNumber();
        this.accountHolderName = dto.getAccountHolderName();
    }

    public boolean isVeteranFamily() {
        return Boolean.TRUE.equals(veteranFamily);
    }

    public static MemberPersonal of(Member member, MemberPersonalRequestDto dto) {
        return new MemberPersonal(member, dto);
    }
}
