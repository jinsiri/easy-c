
package org.easyc;

import org.easyc.member.constant.*;
import org.easyc.member.dto.*;
import org.easyc.member.repository.MemberRepository;
import org.easyc.member.service.MemberService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import java.time.LocalDate;
import java.util.List;

@EnableJpaAuditing
@SpringBootApplication
public class EasycApplication {


	public static void main(String[] args) {
		SpringApplication.run(EasycApplication.class, args);
	}


	@Bean
    @Profile("!test")
	CommandLineRunner init(MemberRepository memberRepo, MemberService memberService) {
		return args -> {
			if (memberRepo.findByLoginId("admin").isEmpty()) {
				createMemberIfNotExist(memberService,
						"admin", "관리자", "admin", MemberRole.ROLE_ADMIN,
						"admin001");
			}

			if (memberRepo.findByLoginId("user1").isEmpty()) {
				createMemberIfNotExist(memberService,
						"user1", "사용자1", "user1", MemberRole.ROLE_USER,
						"user001");
			}

		};
	}

	private void createMemberIfNotExist(MemberService memberService,
										String loginId,
										String memberNm,
										String memberNmEn,
										MemberRole role,
										String employeeId) {

		MemberJoinRequestDto adminDto = new MemberJoinRequestDto(
				loginId,
				"1234",
				memberNm,
				memberNmEn,
				role
		);


		MemberProfileRequestDto profileDto =
				new MemberProfileRequestDto(
						RecruitmentType.OPEN,
						EmploymentType.REGULAR,
						SalaryType.ANNUAL,
						EmploymentStatus.ACTIVE,
						employeeId,
						"easyc@email.com",
						"02-1234-1234",
						"테스터",
						LocalDate.of(2024, 1, 1),
						LocalDate.of(2026, 1, 1)
				);

		MemberPersonalRequestDto personalDto =
				new MemberPersonalRequestDto(
						LocalDate.of(2000, 1, 7),          // dateOfBirth
						Gender.FEMALE,                     // gender
						"010-1212-1212",                     // phoneNumber
						"test@naver.com",                  // externalEmail
						Nationality.KR,                    // nationality
						"서울특별시",                       // address

						"000",                             // faxNumber
						"-",                               // veteranType
						"-",                               // veteranNumber
						false,                             // veteranFamily

						"-",                               // disabilityRegistrationNumber
						DisabilityType.NONE,               // disabilityType
						"-",                               // disabilityGrade
						DisabilityRecognition.NOT_RECOGNIZED, // disabilityRecognition

						"한국은행",                         // bankName
						"1231234123444",                   // accountNumber
						"아무개"                           // accountHolderName
				);

		// 경력
		List<MemberCareerRequestDto> careers = List.of(
				new MemberCareerRequestDto(
						LocalDate.of(2022, 1, 1),
						LocalDate.of(2023, 12, 31),
						"EasyC",
						"Backend Developer",
						"사내 인사 시스템 개발",
						"2년",
						"이직"
				)
		);

		// 포상 / 징계
		List<MemberRewardDisciplineRequestDto> rewardDisciplines = List.of(
				new MemberRewardDisciplineRequestDto(
						RewardDisciplineType.REWARD,
						LocalDate.of(2024, 12, 31),
						"우수사원 표창",
						"연말 우수 성과"
				),
				new MemberRewardDisciplineRequestDto(
						RewardDisciplineType.DISCIPLINE,
						LocalDate.of(2023, 5, 10),
						"경고",
						"지각 누적"
				)
		);

		// 자격
		List<MemberQualificationRequestDto> qualifications = List.of(
				new MemberQualificationRequestDto(
						QualificationType.CERTIFICATE,
						"정보처리기사",
						null,
						null,
						"한국산업인력공단",
						LocalDate.of(2023, 6, 1)
				)
		);

		// 어학
		List<MemberLanguageRequestDto> languages = List.of(
				new MemberLanguageRequestDto(
						"ENGLISH",
						"TOEIC",
						LocalDate.of(2024, 3, 1),
						"ETS",
						"850",
						"A",
						null
				)
		);

		memberService.createMember(adminDto, profileDto, personalDto, careers, rewardDisciplines, qualifications, languages);
	}
}
