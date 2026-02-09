package org.easyc.member.dto;

import lombok.Getter;
import lombok.experimental.SuperBuilder;
import org.easyc.common.dto.BaseDto;
import org.easyc.common.dto.EnumOption;
import org.easyc.common.support.EnumOptionMapper;
import org.easyc.member.entity.MemberPersonal;

import java.time.LocalDate;

@Getter
@SuperBuilder
public class MemberPersonalResponseDto extends BaseDto {
    private Long memberId;

    // 생년월일
    private LocalDate dateOfBirth;
    // 성별
//    private Gender gender;
    private EnumOption gender;
    // 휴대전화
    private String phoneNumber;
    // 외부 이메일
    private String externalEmail;

    //국적
//    private Nationality nationality;
    private EnumOption nationality;

    private String address; //더 상세하게 분리할지 고민 중 todo
    private String faxNumber; //팩스번호

    // 보훈 정보
    // 보훈 구분
    private String veteranType; //to enum
    // 보훈번호
    private String veteranNumber;
    // 보훈 가족 여부
    private boolean veteranFamily;

    // 장애정보
    // 장애 등록 번호
    private String disabilityRegistrationNumber;
    // 장애구분
//    private DisabilityType disabilityType;
    private EnumOption disabilityType;
    // 장애등급
    private String disabilityGrade;
    // 장애인정구분
//    private DisabilityRecognition disabilityRecognition;
    private EnumOption disabilityRecognition;

    // 계좌(급여)
    // 은행명
    private String bankName; //to enum
    // 계좌번호 (암호화)
    private String accountNumber;
    // 예금주
    private String accountHolderName;
    // 계좌 유형
    private String accountType; //to enum //todo 일반 예금이라고 되어있는데 필요한지?


    public static MemberPersonalResponseDto fromEntity(MemberPersonal memberPersonal) {
        return MemberPersonalResponseDto.builder()
                .memberId(memberPersonal.getMemberId())
                .dateOfBirth(memberPersonal.getDateOfBirth())
                .gender(EnumOptionMapper.toOption(memberPersonal.getGender(), "gender"))
                .phoneNumber(memberPersonal.getPhoneNumber())
                .externalEmail(memberPersonal.getExternalEmail())
                .nationality(EnumOptionMapper.toOption(memberPersonal.getNationality(), "nationality"))
                .address(memberPersonal.getAddress())
                .faxNumber(memberPersonal.getFaxNumber())
                .veteranType(memberPersonal.getVeteranType())
                .veteranNumber(memberPersonal.getVeteranNumber())
                .veteranFamily(memberPersonal.isVeteranFamily())
                .disabilityRegistrationNumber(memberPersonal.getDisabilityRegistrationNumber())
                .disabilityType(EnumOptionMapper.toOption(memberPersonal.getDisabilityType(), "disability.type"))
                .disabilityGrade(memberPersonal.getDisabilityGrade())
                .disabilityRecognition(EnumOptionMapper.toOption(memberPersonal.getDisabilityRecognition(), "disability.recognition"))
                .bankName(memberPersonal.getBankName())
                .accountNumber(memberPersonal.getAccountNumber())
                .accountHolderName(memberPersonal.getAccountHolderName())
                .accountType(memberPersonal.getAccountType())
                .deleted(memberPersonal.isDeleted())
                .active(memberPersonal.isActive())
                .registerDate(memberPersonal.getRegisterDate())
                .registerIp(memberPersonal.getRegisterIp())
                .registerUser(memberPersonal.getRegisterUser())
                .lastUpdateDate(memberPersonal.getLastUpdateDate())
                .lastUpdateIp(memberPersonal.getLastUpdateIp())
                .lastUpdateId(memberPersonal.getLastUpdateId())
                .lastUpdateNm(memberPersonal.getLastUpdateNm())
                .build();
    }

}
