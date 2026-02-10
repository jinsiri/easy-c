package org.easyc.auth.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.easyc.auth.dto.CustomUserDetails;
import org.easyc.common.dto.AuditUser;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.List;

@Component
public class JwtProvider {

    // 서명용 Key 객체
    // JWT 서명용 "안전한 비밀키(Key 객체)"를 만들어주는 헬퍼
    // secret 길이 검증함 (HS256 → 최소 256bit)
    // jjwt가 안전하지 않으면 바로 에러냄

//    private static final String SECRET =
//            "Qx9!kA2$eP7L@rD4m#ZB8YcJw0NfT%S*"; // 32바이트 이상
//    private final Key key =
//            Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
//    private final long EXP = 1000 * 60 * 60;

    private final Key accessTokenKey;
    private final Key refreshTokenKey;
//    private final long ACCESS_EXP;
//    private final long REFRESH_EXP;

    private final JwtProperties jwtProperties;

//    // 테스트용
//    private static final long ACCESS_TOKEN_EXPIRE = 10 * 1000L; // 10초


    public JwtProvider(
//            @Value("${jwt.access.secret}") String accessSecret,
//            @Value("${jwt.refresh.secret}") String refreshSecret,
//            @Value("${jwt.access.expiration}") long accessExp,
//            @Value("${jwt.refresh.expiration}") long refreshExp
            JwtProperties jwtProperties
    ) {

        this.jwtProperties = jwtProperties;
        this.accessTokenKey = Keys.hmacShaKeyFor(jwtProperties.getAccessSecret().getBytes(StandardCharsets.UTF_8));
        this.refreshTokenKey = Keys.hmacShaKeyFor(jwtProperties.getRefreshSecret().getBytes(StandardCharsets.UTF_8));
//        this.ACCESS_EXP = ACCESS_TOKEN_EXPIRE ; //테스트용
//        this.ACCESS_EXP = accessExp;
//        this.REFRESH_EXP = refreshExp;

        System.out.println("===========================ACCESS_EXP===========================");
        System.out.println(jwtProperties.getAccessExpiration());
        System.out.println("===========================REFRESH_EXP===========================");
        System.out.println(jwtProperties.getRefreshExpiration());
    }

    public long getAccessExpiration() {
        return jwtProperties.getAccessExpiration();
    }

    public long getRefreshExpiration() {
        return jwtProperties.getRefreshExpiration();
    }

    public String createAccessToken(Authentication auth) {
        CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();

        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("memberNm", user.getMemberNm())
                .claim("role", user.getAuthorities().iterator().next().getAuthority())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtProperties.getAccessExpiration()))
                .signWith(accessTokenKey)
                .compact();

        /*return Jwts.builder()
                    .setSubject(auth.getName()) // loginId
                    .claim("role", auth.getAuthorities().iterator().next().getAuthority())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + ACCESS_EXP))
                  //  .signWith(SignatureAlgorithm.HS256, SECRET) // 구식 - 문자열 서명, 보안적으로 권장하지 않음.
                    .signWith(accessTokenKey)
                    .compact();*/
    }

    public String createRefreshToken(Authentication auth) {
        CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();

        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("memberNm", user.getMemberNm())
                .claim("role", user.getAuthorities().iterator().next().getAuthority())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtProperties.getRefreshExpiration()))
                .signWith(refreshTokenKey)
                .compact();

        /*return Jwts.builder()
                    .setSubject(auth.getName()) // loginId
                    .claim("role", auth.getAuthorities().iterator().next().getAuthority())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + REFRESH_EXP))
                //  .signWith(SignatureAlgorithm.HS256, SECRET) // 구식 - 문자열 서명, 보안적으로 권장하지 않음.
                    .signWith(refreshTokenKey)
                    .compact();*/
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(accessTokenKey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }


    public boolean validateRefreshToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(refreshTokenKey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Authentication getAuthenticationFromRefreshToken(String refreshToken) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(refreshTokenKey)
                .build()
                .parseClaimsJws(refreshToken)
                .getBody();

        String loginId = claims.getSubject();
        String memberNm = claims.get("memberNm", String.class);
        String role = claims.get("role", String.class);

//        BaseUserDto loginUser =
//                new BaseUserDto(loginId, memberNm, role);

        // 토큰 정보로 CustomUserDetails 생성
        CustomUserDetails user = new CustomUserDetails(new AuditUser(loginId, memberNm, role));

        return new UsernamePasswordAuthenticationToken(
                user,
                null,
                List.of(new SimpleGrantedAuthority(role)) // role_~
        );
    }


    public String getSubject(String token) {
        Jws<Claims> claimsJws = Jwts.parserBuilder()
                .setSigningKey(accessTokenKey)
                .build()
                .parseClaimsJws(token);

        return claimsJws.getBody().getSubject();
    }

    public String getMemberNm(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(accessTokenKey)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.get("memberNm", String.class);
    }

    public String getRole(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(accessTokenKey)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.get("role", String.class);
    }

}
