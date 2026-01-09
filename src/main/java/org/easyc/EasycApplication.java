package org.easyc;

import org.easyc.member.constant.MemberRole;
import org.easyc.member.entity.Member;
import org.easyc.member.repository.MemberRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class EasycApplication {

	public static void main(String[] args) {
		SpringApplication.run(EasycApplication.class, args);
	}


	@Bean
	CommandLineRunner init(MemberRepository repo, PasswordEncoder encoder) {
		return args -> {
			if (repo.findByLoginId("admin").isEmpty()) {
				repo.save(
						Member.builder()
								.loginId("admin")
								.password(encoder.encode("1234"))
								.nickname("관리자")
								.memberRole(MemberRole.ROLE_ADMIN)
								.build()
				);

				repo.save(
						Member.builder()
								.loginId("user1")
								.password(encoder.encode("1234"))
								.nickname("사용자1")
								.memberRole(MemberRole.ROLE_USER)
								.build()
				);
			}
		};
	}
}
