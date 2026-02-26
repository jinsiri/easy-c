package org.easyc.auth.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.easyc.auth.dto.LoginRequestDto;
import org.easyc.auth.dto.LoginResponseDto;
import org.easyc.auth.jwt.JwtProvider;
import org.easyc.member.entity.Member;
import org.easyc.member.repository.MemberRepository;
import org.easyc.util.RsaUtil;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final RsaUtil rsaUtil;
    private final MemberRepository memberRepository;
    private final JwtProvider jwtProvider;


    @GetMapping("/test")
    public String test() {
        return "OK";
    }

    /**
     * RSA 공개키 조회 - 비밀번호 암호화 목적
     * @return
     */
    @GetMapping("/public-key")
    public ResponseEntity<String> getPublicKey() {
        return ResponseEntity.ok(rsaUtil.getPublicKey());
    }

    /**
     * 로그인
     * @param requestDto
     * @return
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto requestDto) throws Exception {

        String rawPassword = rsaUtil.decrypt(requestDto.getEncryptedPassword());

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                requestDto.getLoginId(),
                                rawPassword
                        )
                );

        String accessToken = jwtProvider.createAccessToken(authentication);
        String refreshToken = jwtProvider.createRefreshToken(authentication);

//        ResponseCookie cookie = ResponseCookie.from("ACCESS_TOKEN", jwt)
//                // 브라우저 자바스크립트에서 접근할 수 없는 쿠키 생성, XSS 공격으로 자바스크립트에서 쿠키 훔치는 것 방지
//                // => 즉 프론트에서 document.cookie 로는 접근 불가. 서버 요청 시만 자동 전송
//                .httpOnly(true)
//                // 이 쿠키가 적용될 URL 경로, 사이트 전체에서 쿠키 사용 가능 (모든 요청에서 쿠키 전송)
//                .path("/")
//                // 쿠키가 만료되기 전 살아있는 시간 (60 * 15 = 15분), 로그인 후 15분만 유지
//                // * 서버에서 Access Token 만료와 일치시키는 게 안전
//                .maxAge(60 * 15)
//                // Cross-Site 요청에서 쿠키 전송 제한 정책
//                // 1. Strict → 완전히 제한, 다른 사이트에서 오는 요청에는 쿠키 전송 X
//                // 2. Lax → 일부 허용, 같은 사이트 내 요청 + top-level GET 요청 허용
//                // 3. None → 모든 사이트에서 쿠키 전송 허용 (HTTPS 필수)
//                // JWT 쿠키는 CSRF 공격 방지 때문에 일반적으로 Lax 또는 Strict 사용.
//                .sameSite("Lax")
//                .build();

        ResponseCookie accessCookie = ResponseCookie.from("ACCESS_TOKEN", accessToken)
                .httpOnly(true)
                .path("/") // 모든 API 요청에 accessToken이 자동으로 포함됨
                .maxAge(jwtProvider.getAccessExpiration())
                .sameSite("Lax")
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("REFRESH_TOKEN", refreshToken)
                .httpOnly(true)
                .path("/api/auth/refresh") // /api/auth/refresh 요청일 때만 브라우저가 자동으로 보냄
                .maxAge(jwtProvider.getRefreshExpiration())
                .sameSite("Lax")
                .build();


        Member member = memberRepository.findAllByLoginId(requestDto.getLoginId());
        LoginResponseDto loginResponseDto = new LoginResponseDto(member);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(loginResponseDto);
    }

    /**
     * 로그아웃
     * @return
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        ResponseCookie clearAccess = ResponseCookie.from("ACCESS_TOKEN", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .build();


        ResponseCookie clearRefresh =
                ResponseCookie.from("REFRESH_TOKEN", "")
                        .httpOnly(true)
                        .path("/api/auth/refresh")
                        .maxAge(0)
                        .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, clearAccess.toString())
                .header(HttpHeaders.SET_COOKIE, clearRefresh.toString())
                .build();
    }

    /**
     * 리프레시 토큰
     *
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(
            @CookieValue(value = "REFRESH_TOKEN", required = false) String refreshToken) {

        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (!jwtProvider.validateRefreshToken(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            Authentication authentication =
                    jwtProvider.getAuthenticationFromRefreshToken(refreshToken);

            String newAccessToken =
                    jwtProvider.createAccessToken(authentication);

            ResponseCookie accessCookie = ResponseCookie.from("ACCESS_TOKEN", newAccessToken)
                    .httpOnly(true)
                    .path("/")
                    .maxAge(jwtProvider.getAccessExpiration())
                    .sameSite("Lax")
                    .build();

            System.out.println("==============================refresh token=================================");
            System.out.println(refreshToken);
            System.out.println("==============================new access token=================================");
            System.out.println(newAccessToken);

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                    .build();

        } catch (Exception e) {
            log.info(e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

}
